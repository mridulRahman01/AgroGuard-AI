import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { ShieldCheck, User, LayoutDashboard, Settings } from 'lucide-react';
import FarmerDashboard from '../components/dashboard/FarmerDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';

const Dashboard: React.FC = () => {
    const { user, role, profileName } = useAuth();

    return (
        <div className="min-h-[80vh] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

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
                    {role === 'Admin' ? <AdminDashboard /> : <FarmerDashboard />}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
