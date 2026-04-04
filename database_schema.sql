-- =========================================================================================
-- AGROGUARD AI: COMPLETE SUPABASE DATABASE ARCHITECTURE
-- =========================================================================================

-- -----------------------------------------------------------------------------------------
-- 0. EXTENSIONS & HELPER FUNCTIONS
-- -----------------------------------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- -----------------------------------------------------------------------------------------
-- 1. PROFILES (USER AUTHENTICATION)
-- -----------------------------------------------------------------------------------------

-- Clean up old tables so you can run this script multiple times without errors
drop table if exists public.users cascade;
drop table if exists public.regional_reports cascade;
drop table if exists public.activity_logs cascade;
drop table if exists public.treatments cascade;
drop table if exists public.recommendations cascade;
drop table if exists public.damage cascade;
drop table if exists public.problem cascade;
drop table if exists public.analysis cascade;
drop table if exists public.media cascade;
drop table if exists public.profiles cascade;

create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  full_name text,
  phone text,
  role text default 'Farmer' check (role in ('Farmer', 'Officer', 'Admin')),
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger to automatically create a profile when a new user signs up in Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.phone,
    coalesce(new.raw_user_meta_data->>'role', 'Farmer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -----------------------------------------------------------------------------------------
-- 2. MEDIA / IMAGE STORAGE
-- -----------------------------------------------------------------------------------------
create table public.media (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  image_url text not null,
  crop_type text,
  location text,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------------------
-- 3. AI ANALYSIS
-- -----------------------------------------------------------------------------------------
create table public.analysis (
  id uuid primary key default uuid_generate_v4(),
  media_id uuid references public.media(id) on delete cascade not null,
  disease_name text,
  severity_level text,
  confidence_score numeric,
  analysis_date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------------------
-- 4. PROBLEM DETECTION
-- -----------------------------------------------------------------------------------------
create table public.problem (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid references public.analysis(id) on delete cascade not null,
  problem_type text,
  description text
);

-- -----------------------------------------------------------------------------------------
-- 5. DAMAGE ESTIMATION
-- -----------------------------------------------------------------------------------------
create table public.damage (
  id uuid primary key default uuid_generate_v4(),
  analysis_id uuid references public.analysis(id) on delete cascade not null,
  damage_percentage numeric,
  affected_area text,
  detection_date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------------------
-- 6. RECOMMENDATION SYSTEM
-- -----------------------------------------------------------------------------------------
create table public.recommendations (
  id uuid primary key default uuid_generate_v4(),
  problem_id uuid references public.problem(id) on delete cascade not null,
  recommendation_type text check (recommendation_type in ('pesticide', 'organic', 'cultural', 'other')),
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------------------
-- 7. TREATMENTS
-- -----------------------------------------------------------------------------------------
create table public.treatments (
  id uuid primary key default uuid_generate_v4(),
  recommendation_id uuid references public.recommendations(id) on delete cascade not null,
  treatment_name text,
  dosage text,
  instructions text
);

-- -----------------------------------------------------------------------------------------
-- 8. ACTIVITY LOGS
-- -----------------------------------------------------------------------------------------
create table public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  action_type text,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- -----------------------------------------------------------------------------------------
-- 9. DASHBOARD ANALYTICS (REGIONAL REPORTS)
-- -----------------------------------------------------------------------------------------
create table public.regional_reports (
  id uuid primary key default uuid_generate_v4(),
  region text not null,
  disease_name text,
  cases_count integer default 0,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null
);


-- =========================================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.media enable row level security;
alter table public.analysis enable row level security;
alter table public.problem enable row level security;
alter table public.damage enable row level security;
alter table public.recommendations enable row level security;
alter table public.treatments enable row level security;
alter table public.activity_logs enable row level security;
alter table public.regional_reports enable row level security;

-- PROFILES
create policy "Users can view their own profile" on public.profiles for select using ( auth.uid() = id );
create policy "Users can update their own profile" on public.profiles for update using ( auth.uid() = id );
create policy "Admins and Officers can view all profiles" on public.profiles for select using ( 
  exists (select 1 from public.profiles where id = auth.uid() and role in ('Admin', 'Officer')) 
);
create policy "Admins can update all profiles" on public.profiles for update using ( 
  exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin') 
);

-- MEDIA
create policy "Farmers can insert their own media" on public.media for insert with check ( auth.uid() = user_id );
create policy "Users can view their own media" on public.media for select using ( auth.uid() = user_id );
create policy "Officers and Admins can view all media" on public.media for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('Admin', 'Officer'))
);
create policy "Admins can do all on media" on public.media for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
);

-- ANALYSIS
create policy "Farmers can view analysis for their media" on public.analysis for select using (
  exists (select 1 from public.media where id = public.analysis.media_id and user_id = auth.uid())
);
create policy "Officers and Admins can view all analysis" on public.analysis for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('Admin', 'Officer'))
);
create policy "System/Admins can generate analysis" on public.analysis for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
);

-- PROBLEM, DAMAGE, RECOMMENDATIONS, TREATMENTS (View rules mirror Analysis)
create policy "Farmers view own problems" on public.problem for select using (
  exists (select 1 from public.analysis a join public.media m on a.media_id = m.id where a.id = public.problem.analysis_id and m.user_id = auth.uid())
);
create policy "Officers and Admins view all problems" on public.problem for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('Admin', 'Officer'))
);
create policy "Admins full access problems" on public.problem for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
);

create policy "Farmers view own damage" on public.damage for select using (
  exists (select 1 from public.analysis a join public.media m on a.media_id = m.id where a.id = public.damage.analysis_id and m.user_id = auth.uid())
);
create policy "Officers and Admins view all damage" on public.damage for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('Admin', 'Officer'))
);
create policy "Admins full access damage" on public.damage for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
);

create policy "Farmers view own recommendations" on public.recommendations for select using (
  exists (
    select 1 from public.problem p 
    join public.analysis a on p.analysis_id = a.id
    join public.media m on a.media_id = m.id 
    where p.id = public.recommendations.problem_id and m.user_id = auth.uid()
  )
);
create policy "Officers and Admins view all recommendations" on public.recommendations for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('Admin', 'Officer'))
);
create policy "Admins full access recommendations" on public.recommendations for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
);

create policy "Farmers view own treatments" on public.treatments for select using (
  exists (
    select 1 from public.recommendations r
    join public.problem p on r.problem_id = p.id 
    join public.analysis a on p.analysis_id = a.id
    join public.media m on a.media_id = m.id 
    where r.id = public.treatments.recommendation_id and m.user_id = auth.uid()
  )
);
create policy "Officers and Admins view all treatments" on public.treatments for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('Admin', 'Officer'))
);
create policy "Admins full access treatments" on public.treatments for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
);

-- ACTIVITY LOGS
create policy "Users can view own logs" on public.activity_logs for select using ( auth.uid() = user_id );
create policy "Users can insert own logs" on public.activity_logs for insert with check ( auth.uid() = user_id );
create policy "Admins can view all logs" on public.activity_logs for select using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'Admin')
);

-- REGIONAL REPORTS
create policy "Anyone can view regional reports" on public.regional_reports for select using ( true );
create policy "Only Admins/Officers can modify regional reports" on public.regional_reports for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('Admin', 'Officer'))
);


-- =========================================================================================
-- 11. STORAGE CONFIGURATION
-- =========================================================================================

-- Insert bucket if it doesn't exist
insert into storage.buckets (id, name, public) 
values ('crop-images', 'crop-images', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Users can upload their own images" 
on storage.objects for insert 
with check ( bucket_id = 'crop-images' and auth.uid() = owner );

create policy "Users can update their own images"
on storage.objects for update
using ( bucket_id = 'crop-images' and auth.uid() = owner );

create policy "Public read access for crop-images" 
on storage.objects for select 
using ( bucket_id = 'crop-images' );

create policy "Users can delete their own images"
on storage.objects for delete
using ( bucket_id = 'crop-images' and auth.uid() = owner );


-- =========================================================================================
-- 12. PERFORMANCE OPTIMIZATION (INDEXES)
-- =========================================================================================

create index if not exists idx_media_user_id on public.media(user_id);
create index if not exists idx_analysis_media_id on public.analysis(media_id);
create index if not exists idx_problem_analysis_id on public.problem(analysis_id);
create index if not exists idx_damage_analysis_id on public.damage(analysis_id);
create index if not exists idx_recommendations_problem_id on public.recommendations(problem_id);
create index if not exists idx_treatments_recommendation_id on public.treatments(recommendation_id);
create index if not exists idx_activity_logs_user_id on public.activity_logs(user_id);
create index if not exists idx_regional_reports_region on public.regional_reports(region);
