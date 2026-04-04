import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
    setSidebarOpen: (isOpen: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
    const { profileName, role } = useAuth();
    const location = useLocation();

    // Determine Page Title based on route
    let pageTitle = '';
    let pageSubtitle = '';

    switch (location.pathname) {
        case '/dashboard':
            pageTitle = 'আমার ফার্ম ড্যাশবোর্ড';
            pageSubtitle = `স্বাগতম, ${profileName || 'কৃষক'} • সর্বশেষ আপডেট: আজ`;
            break;
        case '/admin-dashboard':
            pageTitle = 'Admin Overview';
            pageSubtitle = 'System monitoring • Last sync: Just now';
            break;
        case '/analyze':
            pageTitle = 'ফসল বিশ্লেষণ';
            pageSubtitle = 'AI দিয়ে ফসলের রোগ শনাক্ত করুন';
            break;
        case '/chat':
            pageTitle = 'AI কৃষি সহায়তা';
            pageSubtitle = 'বাংলায় আপনার ফসলের যেকোনো প্রশ্ন করুন';
            break;
        case '/settings':
            pageTitle = 'সেটিংস';
            pageSubtitle = 'আপনার অ্যাকাউন্ট পরিচালনা করুন';
            break;
        default:
            pageTitle = 'AgroGuard AI';
            pageSubtitle = 'Smart farming platform';
    }

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Left side: Mobile menu toggle and Page Title */}
            <div className="flex items-center gap-4">
                <button 
                    className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
                    onClick={() => setSidebarOpen(true)}
                >
                    <Menu className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        {pageTitle}
                    </h1>
                    <p className="text-sm text-gray-500 font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        {pageSubtitle}
                    </p>
                </div>
            </div>

            {/* Right side: Search, Notifications, Profile */}
            <div className="flex items-center gap-4">
                {/* Search Bar - Hidden on small mobile */}
                <div className="hidden md:flex relative group">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-green-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search crops, diseases..." 
                        className="pl-9 pr-4 py-2 w-64 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-green-500/20 transition-all font-medium placeholder:text-gray-400"
                    />
                </div>

                <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                <button className="relative p-2 text-gray-400 hover:text-green-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-2 cursor-pointer p-1 pr-2 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all">
                    <div className="w-9 h-9 rounded-full bg-green-600 text-white font-bold flex items-center justify-center text-sm shadow-sm ring-2 ring-white">
                        {(profileName?.charAt(0) || 'U').toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left mr-1">
                        <div className="text-sm font-bold text-gray-900 leading-none mb-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            {profileName || 'User'}
                        </div>
                        <div className="text-xs font-semibold text-gray-500 capitalize leading-none">
                            {role || 'Farmer'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
