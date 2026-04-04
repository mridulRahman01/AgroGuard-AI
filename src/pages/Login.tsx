import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Mail, Phone, ArrowLeft } from 'lucide-react';
import { AuthForm } from '../components/auth/AuthForm';
import { SocialLoginButtons } from '../components/auth/SocialLoginButtons';
import { OTPInput } from '../components/auth/OTPInput';
import { AuthLayout } from '../components/auth/AuthLayout';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
    const { session, role, isLoading: isAuthLoading } = useAuth();
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [phoneMode, setPhoneMode] = useState<'input' | 'verify'>('input');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber || phoneNumber.length < 10) {
            toast.error('সঠিক ফোন নম্বর দিন');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOtp({
                phone: phoneNumber,
            });
            if (error) throw error;
            toast.success('আপনার মোবাইলে OTP পাঠানো হয়েছে');
            setPhoneMode('verify');
        } catch (error: any) {
            toast.error(error.message || 'OTP পাঠাতে সমস্যা হয়েছে');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (otp: string) => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.verifyOtp({
                phone: phoneNumber,
                token: otp,
                type: 'sms'
            });
            if (error) throw error;
            toast.success('সফলভাবে লগইন হয়েছে!');
        } catch (error: any) {
            toast.error(error.message || 'ভুল OTP কোড');
        } finally {
            setIsLoading(false);
        }
    };

    const resetPhoneAuth = () => {
        setPhoneMode('input');
        setPhoneNumber('');
    };

    return (
        <AuthLayout>
            <div className="w-full mb-8 text-center sm:text-left">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2 font-['Hind_Siliguri',sans-serif]">
                    লগইন করুন
                </h2>
                <p className="text-sm text-gray-500 font-medium font-['Hind_Siliguri',sans-serif]">
                    অ্যাকাউন্ট নেই?{' '}
                    <Link to="/signup" className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-all">
                        এখানে তৈরি করুন
                    </Link>
                </p>
            </div>

            <div className="w-full">
                {/* Auth Method Toggles */}
                {phoneMode === 'input' && (
                    <div className="flex bg-gray-100/50 p-1.5 rounded-xl mb-8 border border-gray-100">
                        <button
                            onClick={() => setAuthMethod('email')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all font-['Hind_Siliguri',sans-serif] ${authMethod === 'email' ? 'bg-white shadow-sm text-gray-900 border border-gray-200/50' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <Mail className="w-4 h-4" /> ইমেইল
                        </button>
                        <button
                            onClick={() => setAuthMethod('phone')}
                            className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all font-['Hind_Siliguri',sans-serif] ${authMethod === 'phone' ? 'bg-white shadow-sm text-gray-900 border border-gray-200/50' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            <Phone className="w-4 h-4" /> মোবাইল নম্বর
                        </button>
                    </div>
                )}

                {/* Email/Password Auth */}
                {authMethod === 'email' && <AuthForm type="login" />}

                {/* Phone OTP Auth */}
                {authMethod === 'phone' && (
                    <div className="w-full">
                        {phoneMode === 'input' ? (
                            <form onSubmit={handleSendOTP} className="space-y-5">
                                <div className="flex flex-col space-y-2 relative pb-2">
                                    <label className="text-gray-700 text-sm font-semibold font-['Hind_Siliguri',sans-serif]">
                                        আপনার মোবাইল নম্বর <span className="text-red-500">*</span>
                                    </label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-600 sm:text-base font-semibold font-['Hind_Siliguri',sans-serif]">
                                            +880
                                        </span>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="17XX XXXXXX"
                                            className="flex-1 input-field font-['Inter',sans-serif] bg-white border border-gray-200 rounded-r-xl px-4 py-3 placeholder-gray-400 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all rounded-l-none"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 mt-8 rounded-xl font-bold text-base transition-all duration-300 flex justify-center items-center gap-2 font-['Hind_Siliguri',sans-serif] bg-[#eab308] hover:bg-[#ca8a04] text-gray-900 shadow-md hover:shadow-lg"
                                >
                                    {isLoading ? 'প্রক্রিয়াকরণ চলছে...' : 'OTP পাঠান'}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-6 animate-fade-in-up">
                                <button
                                    onClick={resetPhoneAuth}
                                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors font-['Hind_Siliguri',sans-serif]"
                                >
                                    <ArrowLeft className="w-4 h-4" /> নম্বর পরিবর্তন করুন
                                </button>

                                <div className="text-center space-y-2 mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 font-['Hind_Siliguri',sans-serif]">OTP যাচাই করুন</h3>
                                    <p className="text-sm text-gray-500 font-['Hind_Siliguri',sans-serif]">
                                        +880 {phoneNumber} নম্বরে পাঠানো ৬-ডিজিটের কোডটি লিখুন
                                    </p>
                                </div>

                                <OTPInput
                                    length={6}
                                    isLoading={isLoading}
                                    onVerify={handleVerifyOTP}
                                    onResend={() => handleSendOTP({ preventDefault: () => { } } as any)}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Social Auth (Google, FB, GitHub) */}
                {phoneMode === 'input' && (
                    <div className="mt-8 pt-6">
                        <SocialLoginButtons />
                    </div>
                )}
            </div>
        </AuthLayout>
    );
};

export default Login;
