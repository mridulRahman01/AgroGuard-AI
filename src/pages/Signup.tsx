import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { SocialLoginButtons } from '../components/auth/SocialLoginButtons';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../hooks/useAuth';

const Signup: React.FC = () => {
    const { session, role, isLoading: isAuthLoading } = useAuth();

    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
        );
    }

    // If already logged in, redirect to appropriate dashboard
    if (session && role) {
        return <Navigate to={role === 'Admin' ? '/admin-dashboard' : '/dashboard'} replace />;
    }

    return (
        <AuthLayout>
            <div className="w-full mb-8 text-center sm:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2 font-['Hind_Siliguri',sans-serif]">
                    নতুন অ্যাকাউন্ট তৈরি করুন
                </h2>
                <p className="text-sm text-gray-500 font-medium font-['Hind_Siliguri',sans-serif]">
                    আগে থেকে অ্যাকাউন্ট আছে?{' '}
                    <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-all">
                        লগইন করুন
                    </Link>
                </p>
            </div>

            <div className="w-full">
                <AuthForm type="signup" />

                <div className="mt-8 pt-6">
                    <SocialLoginButtons />
                </div>
            </div>
        </AuthLayout>
    );
};

export default Signup;
