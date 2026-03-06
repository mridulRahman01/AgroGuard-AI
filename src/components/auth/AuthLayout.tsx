import React from 'react';
import { Leaf } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-white lg:bg-[#fafaf9] flex flex-col lg:flex-row w-full font-['Inter',sans-serif]">
            {/* Mobile Header (Logo) */}
            <div className="lg:hidden order-1 w-full flex justify-center py-5 bg-white z-20 shadow-sm border-b border-gray-100 items-center">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white shadow-md">
                        <Leaf className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <span className="text-xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        অ্যাগ্রোগার্ড এআই
                    </span>
                </div>
            </div>

            {/* Left Side - Auth Form */}
            <div className="w-full lg:w-[45%] flex flex-col justify-center items-center px-4 py-6 sm:px-8 sm:py-10 lg:p-16 xl:p-24 relative z-10 shrink-0 order-3 lg:order-1 bg-white lg:bg-transparent">
                <div className="w-full max-w-md space-y-2">
                    {/* Desktop Logo */}
                    <div className="hidden lg:flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white shadow-md">
                            <Leaf className="w-6 h-6" strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            অ্যাগ্রোগার্ড এআই
                        </span>
                    </div>

                    {children}
                </div>
            </div>

            {/* Right Side - Visual Section */}
            <div className="w-full lg:w-[55%] h-[200px] sm:h-[300px] lg:h-auto xl:min-h-screen relative overflow-hidden flex items-center justify-center bg-gray-900 border-b lg:border-b-0 lg:border-l border-gray-200 order-2 lg:order-2">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: "url('/assets/wilsan-u-BCATbA86WAw-unsplash.jpg')" }}
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-green-950/40 to-black/20 z-0" />

                {/* Floating Cards Container */}
                <div className="hidden lg:block relative z-10 w-full max-w-lg h-[600px]" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    {/* Crop Analysis Card */}
                    <div className="absolute top-8 right-0 backdrop-blur-md bg-black/40 border border-white/20 p-5 rounded-2xl shadow-2xl w-64 animate-fade-in-up hover:-translate-y-1 hover:bg-black/50 hover:border-white/30 transition-all duration-300" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full bg-yellow-400/20 flex items-center justify-center">
                                <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse"></span>
                            </div>
                            <span className="text-white font-medium text-sm">ফসল বিশ্লেষণ</span>
                        </div>
                        <h4 className="text-white font-bold text-lg leading-tight mb-2">ধানের পাতার রোগ শনাক্ত হয়েছে</h4>
                        <p className="text-green-300 text-sm font-medium">নির্ভুলতা: <span className="text-white font-bold text-base">৯২%</span></p>
                    </div>

                    {/* Farmer Activity Card */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 backdrop-blur-md bg-black/40 border border-white/20 p-6 rounded-2xl shadow-2xl w-72 animate-fade-in-up hover:-translate-y-1 hover:bg-black/50 hover:border-white/30 transition-all duration-300" style={{ animationDelay: '0.3s' }}>
                        <h4 className="text-white font-bold mb-4 border-b border-white/20 pb-3">কৃষক কার্যক্রম</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-300 font-medium whitespace-nowrap">কৃষক:</span>
                                <span className="text-white font-bold text-right ml-2">রহিম মিয়া</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-300 font-medium whitespace-nowrap">ফসল:</span>
                                <span className="text-white font-bold text-right ml-2">ধান</span>
                            </div>
                            <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-white/20">
                                <span className="text-gray-300 font-medium whitespace-nowrap">স্ট্যাটাস:</span>
                                <span className="bg-green-500/30 text-green-50 px-2.5 py-1 rounded-md text-xs font-semibold border border-green-500/30 ml-2 shadow-sm text-center">বিশ্লেষণ সম্পন্ন</span>
                            </div>
                        </div>
                    </div>

                    {/* Crop Calendar Widget */}
                    <div className="absolute bottom-12 right-12 backdrop-blur-md bg-black/40 border border-white/20 p-5 rounded-2xl shadow-2xl w-64 animate-fade-in-up hover:-translate-y-1 hover:bg-black/50 hover:border-white/30 transition-all duration-300" style={{ animationDelay: '0.5s' }}>
                        <h4 className="text-white font-bold mb-1">ফসল ক্যালেন্ডার</h4>
                        <p className="text-green-300 font-medium text-sm">ধান রোপণের মৌসুম</p>
                        <div className="flex items-center gap-3 mt-4 mb-1">
                            <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="w-[40%] h-full bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                            </div>
                            <span className="text-white text-xs font-bold whitespace-nowrap tracking-wide leading-none">মার্চ – মে</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
