import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';

interface AuthFormProps {
    type: 'login' | 'signup';
}

const getSchema = (type: 'login' | 'signup') => z.object({
    email: z.string().email('অনুগ্রহ করে সঠিক ইমেইল দিন'),
    password: z.string().min(8, 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে'),
    name: type === 'signup' ? z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে') : z.string().optional(),
    role: type === 'signup' ? z.enum(['Farmer', 'Agricultural Officer', 'Admin']) : z.enum(['Farmer', 'Agricultural Officer', 'Admin']).optional()
});

type AuthFormData = z.infer<ReturnType<typeof getSchema>>;

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
        resolver: zodResolver(getSchema(type)),
        defaultValues: {
            role: 'Farmer'
        }
    });

    const onSubmit = async (data: AuthFormData) => {
        setIsLoading(true);
        try {
            if (type === 'signup') {
                // 1. Create account in Supabase Auth
                const { error: authError } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            full_name: data.name,
                            role: data.role
                        }
                    }
                });

                if (authError) {
                    if (authError.status === 429 || authError.message.includes('rate limit')) {
                        toast.error('অত্যধিক চেষ্টা করা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন');
                    } else if (authError.message.includes('already registered')) {
                        toast.error('এই ইমেইলটি ইতিমধ্যে ব্যবহৃত হয়েছে');
                    } else if (authError.message.toLowerCase().includes('password')) {
                        toast.error('পাসওয়ার্ড আরও শক্তিশালী হতে হবে');
                    } else {
                        toast.error(authError.message || 'নেটওয়ার্ক ত্রুটি');
                    }
                    return;
                }

                // Do NOT insert into profiles manually! The database trigger handles it.
                toast.success('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
                navigate('/login');
            } else {
                // Login
                const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                });
                if (loginError) {
                    if (loginError.message.toLowerCase().includes('invalid')) {
                        toast.error('ভুল ইমেইল বা পাসওয়ার্ড');
                    } else if (loginError.message.toLowerCase().includes('not found')) {
                        toast.error('অ্যাকাউন্ট খুঁজে পাওয়া যায়নি');
                    } else if (loginError.message.toLowerCase().includes('email not confirmed')) {
                        toast.error('দয়া করে আপনার ইমেইল ভেরিফাই করুন');
                    } else {
                        toast.error(loginError.message || 'লগইন করতে সমস্যা হয়েছে');
                    }
                    return;
                }

                // Fetch user role and redirect
                if (loginData?.user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', loginData.user.id)
                        .maybeSingle();

                    toast.success('লগইন সফল হয়েছে');

                    if (profile?.role === 'Admin') {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/dashboard');
                    }
                }
            }
        } catch (error: any) {
            toast.error(error.message || 'একটি ত্রুটি ঘটেছে');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
            {type === 'signup' && (
                <div className="flex flex-col space-y-2 relative pb-2">
                    <label className="text-gray-700 text-sm font-semibold font-['Hind_Siliguri',sans-serif]">
                        আপনার নাম <span className="text-red-500">*</span>
                    </label>
                    <input
                        {...register('name')}
                        type="text"
                        placeholder="আপনার নাম লিখুন"
                        className={`input-field font-['Hind_Siliguri',sans-serif] bg-white border border-gray-200 rounded-xl px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${errors.name ? 'border-red-300 focus:ring-red-200' : ''}`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs flex items-center gap-1 font-medium mt-1 font-['Hind_Siliguri',sans-serif] absolute -bottom-4">
                            <AlertCircle className="w-3 h-3" /> {errors.name.message}
                        </p>
                    )}
                </div>
            )}

            <div className={`flex flex-col space-y-2 relative pb-2 ${type === 'signup' ? 'mt-4' : ''}`}>
                <label className="text-gray-700 text-sm font-semibold font-['Hind_Siliguri',sans-serif]">
                    ইমেইল ঠিকানা <span className="text-red-500">*</span>
                </label>
                <input
                    {...register('email')}
                    type="email"
                    placeholder="example@email.com"
                    className={`input-field font-['Inter',sans-serif] bg-white border border-gray-200 rounded-xl px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${errors.email ? 'border-red-300 focus:ring-red-200' : ''}`}
                />
                {errors.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1 font-medium mt-1 font-['Hind_Siliguri',sans-serif] absolute -bottom-4">
                        <AlertCircle className="w-3 h-3" /> {errors.email.message}
                    </p>
                )}
            </div>

            <div className="flex flex-col space-y-2 relative pb-2 mt-4">
                <div className="flex justify-between items-center mb-1">
                    <label className="text-gray-700 text-sm font-semibold font-['Hind_Siliguri',sans-serif]">
                        পাসওয়ার্ড <span className="text-red-500">*</span>
                    </label>
                    {type === 'login' && (
                        <a href="#" className="text-sm font-medium text-green-600 hover:text-green-700 hover:underline font-['Hind_Siliguri',sans-serif]">
                            পাসওয়ার্ড ভুলে গেছেন?
                        </a>
                    )}
                </div>
                <div className="relative">
                    <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`input-field font-['Inter',sans-serif] bg-white border border-gray-200 rounded-xl px-4 py-3 pr-10 placeholder-gray-400 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all w-full tracking-wider ${errors.password ? 'border-red-300 focus:ring-red-200' : ''}`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-red-500 text-xs flex items-center gap-1 font-medium mt-1 font-['Hind_Siliguri',sans-serif] absolute -bottom-4">
                        <AlertCircle className="w-3 h-3" /> {errors.password.message}
                    </p>
                )}
            </div>

            {type === 'signup' && (
                <div className="flex flex-col space-y-2 mt-4">
                    <label className="text-gray-700 text-sm font-semibold font-['Hind_Siliguri',sans-serif] mb-1">
                        ব্যবহারকারীর ধরন <span className="text-red-500">*</span>
                    </label>
                    <select
                        {...register('role')}
                        className="input-field font-['Hind_Siliguri',sans-serif] text-sm bg-white border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none cursor-pointer"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                    >
                        <option value="Farmer">কৃষক</option>
                        <option value="Agricultural Officer">কৃষি কর্মকর্তা</option>
                        <option value="Admin">অ্যাডমিন</option>
                    </select>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 mt-8 rounded-xl font-bold text-base transition-all duration-300 flex justify-center items-center gap-2 font-['Hind_Siliguri',sans-serif] ${isLoading ? 'bg-green-700/70 text-white cursor-not-allowed' : 'bg-[#eab308] hover:bg-[#ca8a04] text-gray-900 shadow-md hover:shadow-lg'
                    }`}
            >
                {isLoading ? (
                    <><Loader className="w-5 h-5 animate-spin" /> {type === 'login' ? 'লগইন হচ্ছে...' : 'অ্যাকাউন্ট তৈরি হচ্ছে...'}</>
                ) : type === 'login' ? (
                    'লগইন করুন'
                ) : (
                    'অ্যাকাউন্ট তৈরি করুন'
                )}
            </button>
        </form>
    );
};
