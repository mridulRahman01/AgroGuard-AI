import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Microscope, BarChart3, Lightbulb, ArrowRight, CheckCircle, Users, Zap, Shield, Leaf, Star, ChevronDown } from 'lucide-react';
import AudioGuidePlayer from '../components/AudioGuidePlayer';

/* ── Data ── */
const FEATURES = [
    {
        icon: Microscope,
        title: 'রোগ সনাক্তকরণ',
        desc: 'AI প্রযুক্তি ব্যবহার করে মাত্র কয়েক সেকেন্ডে ফসলের রোগ সনাক্ত করুন।',
        gradient: 'bg-green-100 text-green-600',
    },
    {
        icon: BarChart3,
        title: 'ক্ষতির মাত্রা নির্ণয়',
        desc: 'কতটুকু জমি আক্রান্ত এবং ক্ষতির পরিমাণ কতটুকু তা নির্ভুলভাবে জানুন।',
        gradient: 'bg-amber-100 text-amber-600',
    },
    {
        icon: Lightbulb,
        title: 'বুদ্ধিমান প্রতিকার',
        desc: 'রোগ অনুযায়ী সঠিক কীটনাশক ও চিকিৎসার পরামর্শ পান বাংলায়।',
        gradient: 'bg-blue-100 text-blue-600',
    },
];

const STATS = [
    { value: '৫০,০০০+', label: 'কৃষক উপকৃত', icon: Users },
    { value: '৯৫%', label: 'নির্ভুলতা', icon: Zap },
    { value: '২০+', label: 'রোগ সনাক্ত', icon: Shield },
    { value: '৬টি', label: 'ফসলের ধরন', icon: Leaf },
];

const STEPS = [
    { step: '০১', icon: '📸', title: 'ছবি তুলুন', desc: 'ফসলের আক্রান্ত অংশের ছবি তুলুন বা গ্যালারি থেকে আপলোড করুন।' },
    { step: '০২', icon: '🤖', title: 'AI বিশ্লেষণ', desc: 'AI মডেল ছবি বিশ্লেষণ করে রোগ সনাক্ত করে এবং ক্ষতির মাত্রা নির্ণয় করে।' },
    { step: '০৩', icon: '💊', title: 'প্রতিকার পান', desc: 'বাংলায় বিস্তারিত প্রতিকার পরামর্শ পান এবং সঠিক ব্যবস্থা নিন।' },
];

const TESTIMONIALS = [
    { name: 'রহিম উদ্দিন', location: 'রাজশাহী', text: 'এই ওয়েবসাইট ব্যবহার করে আমার ধান ক্ষেতের রোগ সময়মতো ধরা পড়েছে। অনেক উপকার হয়েছে।', rating: 5, crop: '🌾 ধান চাষি' },
    { name: 'সুমাইয়া বেগম', location: 'বগুড়া', text: 'আলুর লেট ব্লাইট রোগ আগে চিনতাম না। এখন ছবি তুলে দিলেই সব বুঝে যাই।', rating: 5, crop: '🥔 আলু চাষি' },
    { name: 'করিম শেখ', location: 'যশোর', text: 'টমেটো চাষে অনেক লোকসান হতো। এখন AgroGuard AI দিয়ে আগেভাগেই ব্যবস্থা নিতে পারি।', rating: 5, crop: '🍅 টমেটো চাষি' },
];

/* ── Animated Counter ── */
const Counter = ({ value }) => {
    const [show, setShow] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setShow(true); }, { threshold: 0.4 });
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);
    return <span ref={ref}>{show ? value : '—'}</span>;
};

/* ══════════════════════════════════════════════ */
const HomePage = () => (
    <div className="bg-white">

        {/* ═══════════════════════════════════════
            HERO
        ═══════════════════════════════════════ */}
        <section className="hero-pattern pt-20 md:pt-28 pb-16 md:pb-24 overflow-hidden border-b border-gray-100">
            <div className="container-main relative">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    {/* Left Content */}
                    <div className="animate-fade-in-up md:pr-10 z-10 space-y-8">
                        <div className="section-badge inline-flex">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            AI-চালিত কৃষি সুরক্ষা
                        </div>

                        <h1 className="text-hero">
                            AI দিয়ে{' '}
                            <span className="gradient-text">ফসল রক্ষা</span>{' '}
                            করুন
                        </h1>

                        <p className="text-subtext max-w-lg">
                            আপনার ফসলের ছবি তুলুন এবং মাত্র কয়েক সেকেন্ডে জানুন কোন রোগ হয়েছে, কতটুকু ক্ষতি হয়েছে এবং কী করতে হবে।
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link to="/analyze" className="btn-primary px-8 py-4 text-base">
                                🌿 ফসল বিশ্লেষণ করুন
                                <ArrowRight className="w-5 h-5 ml-1" />
                            </Link>
                            <AudioGuidePlayer variant="hero" />
                        </div>

                        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-4 border-t border-gray-100">
                            {['বিনামূল্যে ব্যবহার', 'বাংলায় ফলাফল', 'তাৎক্ষণিক বিশ্লেষণ'].map(t => (
                                <div key={t} className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Visuals (Desktop only) */}
                    <div className="hidden lg:flex justify-end relative animate-slide-right z-10 w-full pl-10">
                        <div className="relative w-full max-w-sm">
                            <div className="glass rounded-2xl p-6 md:p-8 shadow-xl border border-gray-100 bg-white/70">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-10 text-center mb-6 border border-green-100">
                                    <div className="text-7xl mb-4 animate-float">🌾</div>
                                    <p className="text-green-800 font-semibold text-base" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>ফসল স্ক্যান করুন</p>
                                    <p className="text-green-600 text-sm mt-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>ছবি আপলোড করুন</p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                                        <span className="text-gray-800 text-sm font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>রোগ সনাক্ত</span>
                                        <span className="badge-low text-xs">🟢 কম ক্ষতি</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
                                        <span className="text-gray-800 text-sm font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>আক্রান্ত জমি</span>
                                        <span className="text-amber-600 font-bold text-sm">১৮%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badges */}
                            <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-lg px-4 py-3 border border-gray-100 animate-float" style={{ animationDelay: '1s' }}>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xl">🎯</div>
                                    <div>
                                        <div className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>নির্ভুলতা</div>
                                        <div className="text-lg font-bold text-green-600">৯৫%</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-6 -left-8 bg-white rounded-2xl shadow-lg px-5 py-3 border border-gray-100 animate-float" style={{ animationDelay: '2s' }}>
                                <div className="flex items-center gap-2">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                    <span className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সিস্টেম অনলাইন</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* ═══════════════════════════════════════
            STATS BAR
        ═══════════════════════════════════════ */}
        <section className="bg-gray-50 py-16 md:py-20 border-b border-gray-100">
            <div className="container-main">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 divide-x-0 md:divide-x divide-gray-200">
                    {STATS.map(({ value, label, icon: Icon }) => (
                        <div key={label} className="text-center md:px-4">
                            <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4">
                                <Icon className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                                <Counter value={value} />
                            </div>
                            <div className="text-gray-600 text-sm md:text-base font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                {label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ═══════════════════════════════════════
            FEATURES
        ═══════════════════════════════════════ */}
        <section className="py-20 md:py-24 bg-white border-b border-gray-100">
            <div className="container-main">
                {/* Header */}
                <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
                    <div className="section-badge mx-auto">
                        <Zap className="w-4 h-4" />
                        আমাদের সুবিধাসমূহ
                    </div>
                    <h2 className="text-section-title">
                        কেন AgroGuard AI ব্যবহার করবেন?
                    </h2>
                    <p className="text-subtext">
                        আধুনিক AI প্রযুক্তি ব্যবহার করে আপনার ফসলকে রোগ থেকে রক্ষা করুন এবং ফলন বাড়ান।
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map(({ icon: Icon, title, desc, gradient }) => (
                        <div key={title} className="card group">
                            <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                                <Icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3 block" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{title}</h3>
                            <p className="text-body flex-1">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ═══════════════════════════════════════
            HOW IT WORKS
        ═══════════════════════════════════════ */}
        <section className="py-20 md:py-24 bg-gray-50 border-b border-gray-100">
            <div className="container-main">
                <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-section-title">কীভাবে কাজ করে?</h2>
                    <p className="text-subtext">মাত্র ৩টি সহজ ধাপে আপনার ফসলের রোগ নির্ণয় করুন</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-0">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 -translate-y-4" />

                    {STEPS.map(({ step, icon, title, desc }, i) => (
                        <div key={step} className="card bg-white relative">
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-5xl bg-white p-2 rounded-full border-4 border-gray-50 shadow-sm">{icon}</div>

                            <div className="pt-8 text-center flex-1 flex flex-col items-center">
                                <div className="text-4xl font-black text-gray-100 select-none mb-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{step}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{title}</h3>
                                <p className="text-body">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ═══════════════════════════════════════
            TESTIMONIALS
        ═══════════════════════════════════════ */}
        <section className="py-20 md:py-24 bg-white border-b border-gray-100">
            <div className="container-main">
                <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-section-title">কৃষকদের মতামত</h2>
                    <p className="text-subtext">দেখুন যারা আমাদের পরিষেবা ব্যবহার করে উপকৃত হয়েছেন</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {TESTIMONIALS.map(({ name, location, text, rating, crop }) => (
                        <div key={name} className="card bg-white border border-gray-100">
                            <div className="flex gap-1 mb-4">
                                {[...Array(rating)].map((_, j) => (
                                    <Star key={j} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                                ))}
                            </div>
                            <p className="text-body italic mb-6 break-words">"{text}"</p>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                                    {name[0]}
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{name}</div>
                                    <div className="text-sm text-gray-500" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{crop} • {location}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ═══════════════════════════════════════
            CTA
        ═══════════════════════════════════════ */}
        <section className="py-20 md:py-32 bg-green-50 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 -translate-y-1/2 translate-x-1/3 rounded-full bg-green-200/50 blur-3xl opacity-60" />
                <div className="absolute bottom-0 left-0 w-96 h-96 translate-y-1/2 -translate-x-1/3 rounded-full bg-green-200/50 blur-3xl opacity-60" />
            </div>

            <div className="container-main text-center relative z-10 max-w-3xl space-y-8">
                <div className="text-6xl mb-6 animate-float">🌾</div>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>আজই শুরু করুন</h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                    বিনামূল্যে আপনার ফসলের বিশ্লেষণ করুন এবং সঠিক সময়ে সঠিক ব্যবস্থা নিন।
                </p>
                <div className="pt-4">
                    <Link
                        to="/analyze"
                        className="inline-flex items-center justify-center gap-3 bg-green-600 text-white font-medium px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg shadow-green-600/20 hover:shadow-xl hover:shadow-green-600/30 hover:-translate-y-1 text-lg w-full sm:w-auto"
                        style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                    >
                        🌿 ফসল বিশ্লেষণ শুরু করুন
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>

        {/* Floating Audio Guide Widget */}
        <AudioGuidePlayer variant="floating" />
    </div>
);

export default HomePage;
