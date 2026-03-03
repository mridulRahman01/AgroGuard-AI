# Supabase PostgreSQL Configuration

-- Execute this script in your Supabase SQL Editor

-- 1. Create a custom users table that holds extended profile information
create table public.users (
  id uuid references auth.users(id) on delete cascade not null primary key,
  name text,
  phone text,
  role text default 'Farmer' check (role in ('Farmer', 'Officer', 'Admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Turn on Row Level Security (RLS)
alter table public.users enable row level security;

-- 3. Create Row Level Security (RLS) Policies
-- Users can read their own profile
create policy "Users can view their own profile" 
on public.users for select 
using ( auth.uid() = id );

-- Users can update their own profile
create policy "Users can update their own profile" 
on public.users for update 
using ( auth.uid() = id );

-- Admins can read all profiles (Requires an admin check function)
create policy "Admins can view all profiles" 
on public.users for select 
using ( exists (select 1 from public.users where id = auth.uid() and role = 'Admin') );

-- 4. Set up an Auth Trigger to automatically create a profile for new users
-- This runs safely whenever a user signs up via Email, OAuth, or Phone
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    new.phone,
    coalesce(new.raw_user_meta_data->>'role', 'Farmer')
  );
  return new;
end;
$$;

-- Connect the trigger to auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
