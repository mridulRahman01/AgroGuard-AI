import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Leaf, Mail, Phone, ArrowLeft } from 'lucide-react';
import { AuthForm } from '../components/auth/AuthForm';
import { SocialLoginButtons } from '../components/auth/SocialLoginButtons';
import { OTPInput } from '../components/auth/OTPInput';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
    const { session } = useAuth();
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [phoneMode, setPhoneMode] = useState<'input' | 'verify'>('input');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // If already logged in, redirect to dashboard
    if (session) {
        return <Navigate to="/dashboard" replace />;
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
                    স্বাগতম! আবার লগইন করুন
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    অ্যাকাউন্ট নেই?{' '}
                    <Link to="/signup" className="font-semibold text-green-600 hover:text-green-500 hover:underline transition-all">
                        এখানে তৈরি করুন
                    </Link>
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-[480px] relative z-10">
                <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/40 sm:rounded-2xl sm:px-10 border border-gray-100">

                    {/* Auth Method Toggles */}
                    {phoneMode === 'input' && (
                        <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                            <button
                                onClick={() => setAuthMethod('email')}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${authMethod === 'email' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                            >
                                <Mail className="w-4 h-4" /> ইমেইল
                            </button>
                            <button
                                onClick={() => setAuthMethod('phone')}
                                className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${authMethod === 'phone' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                            >
                                <Phone className="w-4 h-4" /> মোবাইল নম্বর
                            </button>
                        </div>
                    )}

                    {/* Email/Password Auth */}
                    {authMethod === 'email' && <AuthForm type="login" />}

                    {/* Phone OTP Auth */}
                    {authMethod === 'phone' && (
                        <div>
                            {phoneMode === 'input' ? (
                                <form onSubmit={handleSendOTP} className="space-y-5">
                                    <div className="flex flex-col space-y-2">
                                        <label className="text-gray-700 text-sm font-semibold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                            আপনার মোবাইল নম্বর
                                        </label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm font-medium">
                                                +880
                                            </span>
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                placeholder="17XX XXXXXX"
                                                className="flex-1 input-field rounded-l-none"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn-primary w-full shadow-lg shadow-green-600/20"
                                        style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                    >
                                        {isLoading ? 'প্রক্রিয়াকরণ চলছে...' : 'OTP পাঠান'}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-6 animate-fade-in-up">
                                    <button
                                        onClick={resetPhoneAuth}
                                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
                                        style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                    >
                                        <ArrowLeft className="w-4 h-4" /> নম্বর পরিবর্তন করুন
                                    </button>

                                    <div className="text-center space-y-2 mb-8">
                                        <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>OTP যাচাই করুন</h3>
                                        <p className="text-sm text-gray-500" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
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
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <SocialLoginButtons />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
