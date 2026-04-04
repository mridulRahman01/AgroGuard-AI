import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { 
    User, 
    Settings as SettingsIcon, 
    Bell, 
    Globe, 
    Shield, 
    LogOut,
    Save
} from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
    const { user, profileName, role, signOut } = useAuth();
    
    const [name, setName] = useState(profileName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [notifications, setNotifications] = useState(true);
    const [language, setLanguage] = useState('bn');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulation of save
        setTimeout(() => {
            setIsSaving(false);
            toast.success('প্রোফাইল আপডেট সফল হয়েছে!');
        }, 1000);
    };

    const handleLogout = async () => {
        const { error } = await signOut();
        if (error) {
            toast.error('লগআউট করতে সমস্যা হয়েছে');
        } else {
            toast.success('সফলভাবে লগআউট করা হয়েছে');
        }
    };

    return (
        <div className="font-sans space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সেটিংস</h1>
                <p className="text-gray-500 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>আপনার অ্যাকাউন্ট পরিচালনা করুন এবং সিস্টেমের পছন্দগুলি সেট করুন।</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                
                {/* Left Sidebar for Navigation inside Settings */}
                <div className="md:col-span-1 space-y-2">
                    <button className="w-full flex items-center gap-3 px-4 py-3 bg-white text-green-700 font-bold border border-green-200 shadow-sm rounded-xl transition-colors" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        <User className="w-5 h-5" />
                        আমার প্রোফাইল
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 font-medium rounded-xl transition-colors disabled:opacity-50" style={{ fontFamily: 'Hind Siliguri, sans-serif' }} disabled>
                        <Shield className="w-5 h-5" />
                        পাসওয়ার্ড ও নিরাপত্তা
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 font-medium rounded-xl transition-colors disabled:opacity-50" style={{ fontFamily: 'Hind Siliguri, sans-serif' }} disabled>
                        <Bell className="w-5 h-5" />
                        নোটিফিকেশন
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-white hover:text-gray-900 font-medium rounded-xl transition-colors disabled:opacity-50" style={{ fontFamily: 'Hind Siliguri, sans-serif' }} disabled>
                        <Globe className="w-5 h-5" />
                        ভাষা পরিবর্তন
                    </button>
                    
                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 font-bold rounded-xl transition-colors" 
                            style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                        >
                            <LogOut className="w-5 h-5" />
                            লগআউট করুন
                        </button>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="md:col-span-2 space-y-6">
                    
                    {/* Profile Information */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            <SettingsIcon className="w-5 h-5 text-gray-400" />
                            প্রোফাইল তথ্য
                        </h2>
                        
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-3xl font-bold shadow-inner">
                                {(profileName?.charAt(0) || 'U').toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{profileName || 'ব্যবহারকারী'}</h3>
                                <p className="text-sm text-gray-500 font-medium mb-3">{user?.email || 'email@example.com'}</p>
                                <button className="px-4 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg transition-colors border border-gray-200">ছবি পরিবর্তন করুন</button>
                            </div>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>পূর্ণ নাম</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="আপনার নাম লিখুন"
                                        style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>ইমেইল ঠিকানা</label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all placeholder:text-gray-400"
                                        placeholder="আপনার ইমেইল"
                                        disabled
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>অ্যাকাউন্টের ধরন / ভূমিকা</label>
                                <input 
                                    type="text" 
                                    value={role === 'Admin' ? 'অ্যাডমিন (Admin)' : 'কৃষক (Farmer)'}
                                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-medium cursor-not-allowed outline-none"
                                    disabled
                                    style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button 
                                    type="submit"
                                    disabled={isSaving}
                                    className="px-6 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                >
                                    {isSaving ? (
                                        <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    সংরক্ষণ করুন
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Preferences Area */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>পছন্দসমূহ (Preferences)</h2>
                        
                        <div className="flex items-center justify-between py-2 border-b border-gray-50">
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>ইমেইল নোটিফিকেশন</h4>
                                <p className="text-xs text-gray-500" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>রোগের পূর্বাভাস এবং সতর্কতা ইমেইলে পান</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={notifications} onChange={(e) => setNotifications(e.target.checked)} />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>
                        
                        <div className="flex items-center justify-between py-2">
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সিস্টেমের ভাষা</h4>
                                <p className="text-xs text-gray-500" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>আপনার পছন্দের ভাষা নির্বাচন করুন</p>
                            </div>
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button 
                                    onClick={() => setLanguage('bn')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${language === 'bn' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                    style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                >
                                    বাংলা
                                </button>
                                <button 
                                    onClick={() => setLanguage('en')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${language === 'en' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                                >
                                    English
                                </button>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default Settings;
