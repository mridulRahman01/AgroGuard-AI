import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
    const { session, user, role, profileName, signOut } = useAuth();

    // Render logic based on Roles
    const renderRoleContent = () => {
        switch (role) {
            case 'Admin':
                return (
                    <div className="grid md:grid-cols-2 gap-6 animate-fade-in-up">
                        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">System Analytics</h3>
                            <p className="text-gray-500">View overall platform usage and user registration metrics.</p>
                            <div className="mt-4 h-32 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">Chart Placeholder</div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">User Management</h3>
                            <p className="text-gray-500">Manage Officer and Farmer accounts across the system.</p>
                            <div className="mt-4 h-32 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">List Placeholder</div>
                        </div>
                    </div>
                );
            case 'Officer':
                return (
                    <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
                        <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Pending Reviews</h3>
                            <p className="text-3xl font-bold text-blue-600">24</p>
                            <p className="text-sm text-gray-500 mt-1">AI analyses requiring manual review</p>
                        </div>
                        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Farmer Consultations</h3>
                            <p className="text-gray-500 mb-4">You have 3 upcoming scheduled calls with farmers today.</p>
                            <div className="h-24 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-gray-400">Meeting List Placeholder</div>
                        </div>
                    </div>
                );
            case 'Farmer':
            default:
                return (
                    <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
                        <div className="bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>মোট বিশ্লেষণ</h3>
                            <p className="text-3xl font-bold text-green-600">১২</p>
                            <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>গত ৩০ দিনে</p>
                        </div>
                        <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-green-100 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সাম্প্রতিক ক্রিয়াকলাপ</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">🌿</div>
                                        <div>
                                            <p className="font-semibold text-sm text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>ধান গাছের রোগ বিশ্লেষণ</p>
                                            <p className="text-xs text-gray-500" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>২ দিন আগে সম্পন্ন হয়েছে</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-[80vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Header Profile Section */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                            <User className="w-10 h-10" />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                স্বাগতম, {profileName || 'ব্যবহারকারী'}!
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${role === 'Admin' ? 'bg-rose-100 text-rose-700' :
                                    role === 'Officer' ? 'bg-blue-100 text-blue-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                    <ShieldCheck className="w-4 h-4" />
                                    {role || 'Farmer'}
                                </span>
                                <span className="text-gray-500 text-sm">{user?.email || user?.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10">
                        <button className="p-2.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 rounded-xl transition-colors">
                            <Settings className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Role Specific Content */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <LayoutDashboard className="w-5 h-5 text-gray-400" />
                        <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>আপনার ড্যাশবোর্ড</h2>
                    </div>
                    {renderRoleContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
