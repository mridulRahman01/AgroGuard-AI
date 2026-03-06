import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Leaf, User, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const NAV_LINKS = [
    { to: '/', label: 'হোম' },
    { to: '/analyze', label: 'ফসল বিশ্লেষণ' },
    { to: '/about', label: 'আমাদের সম্পর্কে' },
    { to: '/contact', label: 'যোগাযোগ' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { session, profileName, user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
        setIsDropdownOpen(false);
    }, [location.pathname]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`w-full sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-white'}`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* ── Logo ── */}
                    <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                            <Leaf className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-bold text-green-600 tracking-tight" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            AgroGuard <span className="text-gray-900 group-hover:text-green-600 transition-colors">AI</span>
                        </span>
                    </Link>

                    {/* ── Desktop Navigation ── */}
                    <div className="hidden md:flex items-center gap-8">
                        <ul className="flex items-center gap-8">
                            {NAV_LINKS.map(({ to, label }) => (
                                <li key={to} className="relative">
                                    <Link
                                        to={to}
                                        className={`block py-5 text-base font-medium transition-colors duration-300 ${isActive(to) ? 'text-green-600' : 'text-gray-600 hover:text-green-600'
                                            }`}
                                        style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                    >
                                        {label}
                                    </Link>
                                    {/* Active link indicator */}
                                    {isActive(to) && (
                                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 rounded-t-full" />
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* CTA / Auth Actions */}
                        <div className="flex items-center gap-4 ml-2 pl-4 border-l border-gray-200">
                            {session ? (
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-600 hover:bg-green-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                    >
                                        <User className="w-5 h-5" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className={`absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 p-2 transition-all duration-200 origin-top-right ${isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                                        }`}>
                                        <div className="px-3 py-2 border-b border-gray-100 mb-2">
                                            <p className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{profileName || 'কৃষক প্রোফাইল'}</p>
                                            <p className="text-xs text-gray-500 break-all" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{user?.email || user?.phone || 'user'}</p>
                                        </div>
                                        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">
                                            <LayoutDashboard className="w-4 h-4" /> ড্যাশবোর্ড
                                        </Link>
                                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors">
                                            <Settings className="w-4 h-4" /> সেটিংস
                                        </Link>
                                        <div className="h-px bg-gray-100 my-1" />
                                        <button
                                            onClick={async (e) => {
                                                e.preventDefault();
                                                try {
                                                    await signOut();
                                                    toast.success('Logged out successfully');
                                                } finally {
                                                    setIsDropdownOpen(false);
                                                    navigate('/login');
                                                }
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
                                        >
                                            <LogOut className="w-4 h-4" /> লগআউট
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-medium transition duration-300 shadow-sm shadow-green-600/20"
                                    style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                >
                                    লগইন করুন
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* ── Mobile Hamburger Menu ── */}
                    <div className="md:hidden flex items-center gap-4">
                        {session && !isOpen && (
                            <div className="w-9 h-9 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-600">
                                <User className="w-4 h-4" />
                            </div>
                        )}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 -mr-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors focus:outline-none"
                            aria-label="মেনু খুলুন"
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Mobile Navigation Dropdown ── */}
            <div
                className={`md:hidden absolute top-16 left-0 w-full bg-white border-b border-gray-100 shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
                    }`}
            >
                <div className="max-w-7xl mx-auto flex flex-col gap-2 p-6">
                    {NAV_LINKS.map(({ to, label }) => (
                        <Link
                            key={to}
                            to={to}
                            className={`flex items-center px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive(to) ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                }`}
                            style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                        >
                            {label}
                        </Link>
                    ))}

                    <div className="h-px bg-gray-100 my-2" />

                    {session ? (
                        <>
                            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                                <LayoutDashboard className="w-5 h-5" /> ড্যাশবোর্ড
                            </Link>
                            <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors">
                                <Settings className="w-5 h-5" /> সেটিংস
                            </Link>
                            <button
                                onClick={async (e) => {
                                    e.preventDefault();
                                    try {
                                        await signOut();
                                        toast.success('Logged out successfully');
                                    } finally {
                                        setIsOpen(false);
                                        navigate('/login');
                                    }
                                }}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                            >
                                <LogOut className="w-5 h-5" /> লগআউট
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="w-full flex justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-3.5 rounded-xl font-medium transition duration-300 mt-2 shadow-sm"
                            style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                        >
                            লগইন করুন
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
