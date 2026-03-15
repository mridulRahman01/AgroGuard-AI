import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    LayoutDashboard,
    ScanLine,
    MessageSquare,
    Settings,
    Home,
    HelpCircle,
    Users,
    ActivitySquare,
    FileText,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Leaf
} from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import toast from 'react-hot-toast';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const { role } = useAuth();
    const navigate = useNavigate();
    const isAdmin = role === 'Admin';

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            toast.success('সফলভাবে লগআউট হয়েছে');
            navigate('/login');
        } catch (error) {
            toast.error('লগআউট করতে সমস্যা হয়েছে');
        }
    };

    const commonNavClasses = ({ isActive }: { isActive: boolean }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive
                ? 'bg-green-600 text-white shadow-md shadow-green-600/20'
                : 'text-gray-600 hover:bg-green-50 hover:text-green-700'
        }`;

    return (
        <aside
            className={`fixed lg:static inset-y-0 left-0 z-40 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out ${
                isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
            }`}
        >
            {/* Logo Section */}
            <div className="h-20 flex items-center justify-between px-6 border-b border-gray-50">
                <div className={`flex items-center gap-3 overflow-hidden ${!isOpen && 'lg:hidden'}`}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Leaf className="w-6 h-6 text-white" />
                    </div>
                </div>
                {/* Desktop Toggle */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="hidden lg:flex w-8 h-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:text-green-600 hover:border-green-200 transition-colors absolute -right-4 top-6 z-50 shadow-sm"
                >
                    {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
            </div>

            {/* Role Badge */}
            <div className={`px-4 py-4 transition-all duration-300 ${!isOpen && 'lg:hidden'}`}>
                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-3">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        {isAdmin ? 'Admin Portal' : 'Farmer Portal'}
                    </span>
                </div>
            </div>

            {/* Navigation Menus */}
            <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide space-y-8">
                
                {/* Main Navigation */}
                <div className="space-y-1">
                    <h4 className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4 transition-all duration-300 ${!isOpen && 'lg:hidden'}`}>
                        {isAdmin ? 'Management' : 'My Farm'}
                    </h4>
                    
                    <NavLink to={isAdmin ? "/admin-dashboard" : "/dashboard"} className={commonNavClasses}>
                        <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                        <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && 'lg:hidden'}`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            {isAdmin ? 'Overview' : 'Dashboard'}
                        </span>
                    </NavLink>

                    {isAdmin ? (
                        <>
                            <NavLink to="/admin/logs" className={commonNavClasses}>
                                <ActivitySquare className="w-5 h-5 flex-shrink-0" />
                                <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && 'lg:hidden'}`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>Analysis Logs</span>
                            </NavLink>
                            <NavLink to="/admin/farmers" className={commonNavClasses}>
                                <Users className="w-5 h-5 flex-shrink-0" />
                                <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && 'lg:hidden'}`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>Farmers</span>
                            </NavLink>
                            <NavLink to="/admin/chat-logs" className={commonNavClasses}>
                                <MessageSquare className="w-5 h-5 flex-shrink-0" />
                                <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && 'lg:hidden'}`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>Chat Logs</span>
                            </NavLink>
                            <NavLink to="/admin/reports" className={commonNavClasses}>
                                <FileText className="w-5 h-5 flex-shrink-0" />
                                <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && 'lg:hidden'}`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>Reports</span>
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/analyze" className={commonNavClasses}>
                                <ScanLine className="w-5 h-5 flex-shrink-0" />
                                <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && 'lg:hidden'}`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>Crop Analysis</span>
                            </NavLink>
                            <NavLink to="/chat" className={commonNavClasses}>
                                <MessageSquare className="w-5 h-5 flex-shrink-0" />
                                <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && 'lg:hidden'}`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>AI Chat</span>
                            </NavLink>
                        </>
                    )}

                    <NavLink to="/settings" className={commonNavClasses}>
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && 'lg:hidden'}`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>Settings</span>
                    </NavLink>
                    
                    {!isAdmin && (
                        <NavLink to="/" className={commonNavClasses}>
                            <Home className="w-5 h-5 flex-shrink-0" />
                            <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && 'lg:hidden'}`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>Home</span>
                        </NavLink>
                    )}
                </div>

                {/* Support Navigation */}
                <div className="space-y-1">
                    <h4 className={`text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-4 transition-all duration-300 ${!isOpen && 'lg:hidden'}`}>
                        Support
                    </h4>
                    <NavLink to="/about" className={commonNavClasses}>
                        <HelpCircle className="w-5 h-5 flex-shrink-0" />
                        <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && 'lg:hidden'}`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>Help & About</span>
                    </NavLink>
                </div>
            </div>

            {/* Profile/Logout Section */}
            <div className="p-4 border-t border-gray-50">
                <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span className={`whitespace-nowrap transition-all duration-300 ${!isOpen && 'lg:hidden'}`} style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>Log Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
