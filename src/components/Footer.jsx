import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Phone, Mail, MapPin, Facebook, Twitter, Youtube, Heart } from 'lucide-react';

const QUICK_LINKS = [
    { to: '/', label: 'হোম' },
    { to: '/analyze', label: 'ফসল বিশ্লেষণ' },
    { to: '/about', label: 'আমাদের সম্পর্কে' },
    { to: '/contact', label: 'যোগাযোগ' },
];

const CROPS = ['🌾 ধান', '🥔 আলু', '🍅 টমেটো', '🌾 গম', '🧅 পেঁয়াজ', '🌶️ মরিচ'];

const CONTACT_INFO = [
    { icon: MapPin, text: 'ঢাকা, বাংলাদেশ' },
    { icon: Phone, text: '+880 1700-000000' },
    { icon: Mail, text: 'info@agroguard.ai' },
];

const Footer = () => (
    <footer className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white">
        <div className="container-main py-16 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

                {/* Brand */}
                <div className="lg:col-span-1">
                    <Link to="/" className="flex items-center gap-2.5 mb-4 group">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md">
                            <Leaf className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="text-base font-bold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>AgroGuard AI</div>
                            <div className="text-xs text-green-300" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>কৃষি সুরক্ষা প্ল্যাটফর্ম</div>
                        </div>
                    </Link>
                    <p className="text-green-200 text-sm leading-relaxed mb-5" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        AI প্রযুক্তি ব্যবহার করে বাংলাদেশের কৃষকদের ফসল রোগ সনাক্তকরণ ও সুরক্ষায় সহায়তা করছে।
                    </p>
                    <div className="flex gap-2.5">
                        {[Facebook, Twitter, Youtube].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-9 h-9 rounded-xl bg-green-700 hover:bg-green-500 flex items-center justify-center transition-all duration-200 hover:scale-110"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-semibold text-green-300 mb-4 text-xs uppercase tracking-widest" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        দ্রুত লিংক
                    </h3>
                    <ul className="space-y-2.5">
                        {QUICK_LINKS.map(({ to, label }) => (
                            <li key={to}>
                                <Link
                                    to={to}
                                    className="text-green-200 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2 group"
                                    style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:bg-green-300 transition-colors flex-shrink-0" />
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Supported Crops */}
                <div>
                    <h3 className="font-semibold text-green-300 mb-4 text-xs uppercase tracking-widest" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        সমর্থিত ফসল
                    </h3>
                    <ul className="space-y-2.5">
                        {CROPS.map(crop => (
                            <li key={crop}>
                                <span className="text-green-200 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{crop}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-semibold text-green-300 mb-4 text-xs uppercase tracking-widest" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        যোগাযোগ
                    </h3>
                    <ul className="space-y-3">
                        {CONTACT_INFO.map(({ icon: Icon, text }) => (
                            <li key={text} className="flex items-start gap-3">
                                <Icon className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-green-200 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-700/60">
            <div className="container-main py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p className="text-green-300 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    © ২০২৬ AgroGuard AI। সর্বস্বত্ব সংরক্ষিত।
                </p>
                <p className="text-green-400 text-sm flex items-center gap-1.5" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    বাংলাদেশের কৃষকদের জন্য
                    <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" />
                    দিয়ে তৈরি
                </p>
            </div>
        </div>
    </footer>
);

export default Footer;
