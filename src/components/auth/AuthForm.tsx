import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';

interface AuthFormProps {
    type: 'login' | 'signup';
}

const authSchema = z.object({
    name: z.string().min(2, 'নাম কমপক্ষে ২ অক্ষরের হতে হবে').optional(),
    email: z.string().email('অনুগ্রহ করে সঠিক ইমেইল দিন'),
    password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে'),
    role: z.enum(['Farmer', 'Officer', 'Admin']).optional()
});

type AuthFormData = z.infer<typeof authSchema>;

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            role: 'Farmer'
        }
    });

    const onSubmit = async (data: AuthFormData) => {
        setIsLoading(true);
        try {
            if (type === 'signup') {
                const { error } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                    options: {
                        data: {
                            full_name: data.name,
                            role: data.role
                        }
                    }
                });
                if (error) throw error;
                toast.success('অ্যাকাউন্ট তৈরি সফল! ইমেইল ভেরিফিকেশন চেক করুন।', { duration: 5000 });
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: data.email,
                    password: data.password,
                });
                if (error) throw error;
                // Redirect will be handled by the onAuthStateChange in App/ProtectedRoute
                toast.success('সফলভাবে লগইন হয়েছে!');
            }
        } catch (error: any) {
            toast.error(error.message || 'একটি ত্রুটি ঘটেছে');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {type === 'signup' && (
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700 text-sm font-semibold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        আপনার নাম *
                    </label>
                    <input
                        {...register('name')}
                        type="text"
                        placeholder="আপনার নাম লিখুন"
                        className={`input-field ${errors.name ? 'border-red-300 focus:ring-red-200' : ''}`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs flex items-center gap-1 font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            <AlertCircle className="w-3 h-3" /> {errors.name.message}
                        </p>
                    )}
                </div>
            )}

            <div className="flex flex-col space-y-2">
                <label className="text-gray-700 text-sm font-semibold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    ইমেইল ঠিকানা *
                </label>
                <input
                    {...register('email')}
                    type="email"
                    placeholder="example@email.com"
                    className={`input-field ${errors.email ? 'border-red-300 focus:ring-red-200' : ''}`}
                />
                {errors.email && (
                    <p className="text-red-500 text-xs flex items-center gap-1 font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        <AlertCircle className="w-3 h-3" /> {errors.email.message}
                    </p>
                )}
            </div>

            <div className="flex flex-col space-y-2">
                <label className="text-gray-700 text-sm font-semibold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    পাসওয়ার্ড *
                </label>
                <div className="relative">
                    <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className={`input-field w-full pr-10 ${errors.password ? 'border-red-300 focus:ring-red-200' : ''}`}
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
                    <p className="text-red-500 text-xs flex items-center gap-1 font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        <AlertCircle className="w-3 h-3" /> {errors.password.message}
                    </p>
                )}
            </div>

            {type === 'signup' && (
                <div className="flex flex-col space-y-2">
                    <label className="text-gray-700 text-sm font-semibold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        ব্যবহারকারীর ধরন *
                    </label>
                    <select
                        {...register('role')}
                        className="input-field"
                        style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                    >
                        <option value="Farmer">কৃষক</option>
                        <option value="Officer">কৃষি কর্মকর্তা</option>
                        <option value="Admin">অ্যাডমিন</option>
                    </select>
                </div>
            )}

            {type === 'login' && (
                <div className="flex items-center justify-between pb-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>আমাকে মনে রাখুন</span>
                    </label>
                    <a href="#" className="text-sm font-semibold text-green-600 hover:text-green-700 hover:underline" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        পাসওয়ার্ড ভুলে গেছেন?
                    </a>
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex justify-center items-center gap-2 ${isLoading ? 'bg-green-700/70 text-white cursor-not-allowed' : 'btn-primary shadow-lg shadow-green-600/20'
                    }`}
                style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
            >
                {isLoading ? (
                    <><Loader className="w-5 h-5 animate-spin" /> প্রক্রিয়াকরণ চলছে...</>
                ) : type === 'login' ? (
                    'লগইন করুন'
                ) : (
                    'অ্যাকাউন্ট তৈরি করুন'
                )}
            </button>
        </form>
    );
};
