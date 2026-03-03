import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { AuthForm } from '../components/auth/AuthForm';
import { SocialLoginButtons } from '../components/auth/SocialLoginButtons';
import { useAuth } from '../hooks/useAuth';

const Signup: React.FC = () => {
    const { session } = useAuth();

    // If already logged in, redirect to dashboard
    if (session) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-green-200/40 blur-3xl opacity-60 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] translate-y-1/2 -translate-x-1/2 rounded-full bg-blue-200/30 blur-3xl opacity-60 pointer-events-none" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 mb-6">
                <Link to="/" className="flex items-center justify-center gap-2 group mb-6 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-sm">
                        <Leaf className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                </Link>
                <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    নতুন অ্যাকাউন্ট তৈরি করুন
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    আগে থেকে অ্যাকাউন্ট আছে?{' '}
                    <Link to="/login" className="font-semibold text-green-600 hover:text-green-500 hover:underline transition-all">
                        এখানে লগইন করুন
                    </Link>
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-[480px] relative z-10">
                <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/40 sm:rounded-2xl sm:px-10 border border-gray-100">
                    <AuthForm type="signup" />

                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <SocialLoginButtons />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
