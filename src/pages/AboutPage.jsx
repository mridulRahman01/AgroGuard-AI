import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Heart, Zap, Shield, Users, Code, ArrowRight } from 'lucide-react';

const MISSION_CARDS = [
    {
        icon: Target,
        title: 'আমাদের লক্ষ্য',
        desc: 'বাংলাদেশের কৃষকদের আধুনিক AI প্রযুক্তি ব্যবহার করে ফসল রোগ সনাক্তকরণ ও সুরক্ষায় সহায়তা করা।',
        gradient: 'bg-green-100 text-green-600',
    },
    {
        icon: Heart,
        title: 'আমাদের অঙ্গীকার',
        desc: 'কৃষকদের জীবনমান উন্নয়নে প্রতিশ্রুতিবদ্ধ। বিনামূল্যে সেবা প্রদানের মাধ্যমে কৃষি খাতকে এগিয়ে নিয়ে যাওয়া।',
        gradient: 'bg-rose-100 text-rose-500',
    },
    {
        icon: Zap,
        title: 'আমাদের প্রযুক্তি',
        desc: 'সর্বাধুনিক Deep Learning ও Computer Vision প্রযুক্তি ব্যবহার করে ৯৫% নির্ভুলতায় রোগ সনাক্ত করা হয়।',
        gradient: 'bg-blue-100 text-blue-500',
    },
];

const HOW_HELPS = [
    { icon: '🎯', title: 'সঠিক সময়ে সনাক্তকরণ', desc: 'রোগ ছড়িয়ে পড়ার আগেই সনাক্ত করে ক্ষতি কমানো সম্ভব।' },
    { icon: '💰', title: 'খরচ সাশ্রয়', desc: 'অপ্রয়োজনীয় কীটনাশক ব্যবহার কমিয়ে কৃষকের খরচ বাঁচায়।' },
    { icon: '📱', title: 'সহজ ব্যবহার', desc: 'স্মার্টফোনের ক্যামেরা দিয়ে যেকোনো জায়গা থেকে ব্যবহার করুন।' },
    { icon: '🌿', title: 'পরিবেশবান্ধব', desc: 'সঠিক পরিমাণে কীটনাশক ব্যবহারে পরিবেশ রক্ষায় সহায়তা করে।' },
];

const TECH_STACK = [
    { icon: '🤖', name: 'Deep Learning', desc: 'TensorFlow / PyTorch' },
    { icon: '👁️', name: 'Computer Vision', desc: 'OpenCV / YOLO' },
    { icon: '⚛️', name: 'React.js', desc: 'Frontend Framework' },
    { icon: '🐍', name: 'Python', desc: 'Backend API' },
    { icon: '☁️', name: 'Cloud AI', desc: 'Scalable Inference' },
    { icon: '📊', name: 'Data Science', desc: 'Model Training' },
];

const TEAM = [
    { name: 'মৃদুল রহমান', role: 'প্রধান বিকাশকারী', emoji: '👨‍💻' },
    { name: 'মেহরাব মাহমুদ', role: 'AI বিশেষজ্ঞ', emoji: '🤖' },
    { name: 'সুহাইল হাসান সায়েম', role: 'UI/UX ডিজাইনার', emoji: '🎨' },
];

const AboutPage = () => (
    <div className="bg-white">

        {/* ── Hero ── */}
        <section className="bg-gray-50 py-20 md:py-32 border-b border-gray-100 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 -translate-y-1/2 translate-x-1/3 rounded-full bg-green-200/40 blur-3xl opacity-60" />
            </div>

            <div className="container-main text-center relative z-10 max-w-3xl space-y-6 md:space-y-8">
                <div className="section-badge mx-auto">
                    <Shield className="w-4 h-4" />
                    আমাদের সম্পর্কে
                </div>
                <h1 className="text-hero">
                    AgroGuard AI কী?
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                    AI প্রযুক্তি ব্যবহার করে বাংলাদেশের কৃষকদের ফসল রোগ সনাক্তকরণ ও সুরক্ষায় সহায়তা করছে।
                </p>
            </div>
        </section>

        {/* ── Mission Cards ── */}
        <section className="py-20 md:py-24 bg-white border-b border-gray-100">
            <div className="container-main">
                <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-section-title">আমাদের মিশন</h2>
                    <p className="text-subtext">কৃষকদের উন্নত প্রযুক্তি দিয়ে ক্ষমতায়ন করা</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MISSION_CARDS.map(({ icon: Icon, title, desc, gradient }) => (
                        <div key={title} className="card group">
                            <div className={`w-14 h-14 rounded-2xl ${gradient} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                                <Icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{title}</h3>
                            <p className="text-body flex-1">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── How It Helps ── */}
        <section className="py-20 md:py-24 bg-gray-50 border-b border-gray-100">
            <div className="container-main">
                <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-section-title">কীভাবে কৃষকদের সাহায্য করে?</h2>
                    <p className="text-subtext">উন্নত কৃষি ব্যবস্থাপনায় আমাদের ভূমিকা</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {HOW_HELPS.map(({ icon, title, desc }) => (
                        <div key={title} className="card flex-row items-start gap-6 group hover:border-green-100 border border-gray-100">
                            <div className="text-4xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110">{icon}</div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{title}</h3>
                                <p className="text-body">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Tech Stack ── */}
        <section className="py-20 md:py-24 bg-white border-b border-gray-100">
            <div className="container-main">
                <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
                    <div className="section-badge mx-auto">
                        <Code className="w-4 h-4" />
                        প্রযুক্তি
                    </div>
                    <h2 className="text-section-title">আমাদের প্রযুক্তি স্ট্যাক</h2>
                    <p className="text-subtext">সর্বাধুনিক প্রযুক্তি ব্যবহার করে তৈরি</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-6 gap-6">
                    {TECH_STACK.map(({ icon, name, desc }) => (
                        <div key={name} className="card bg-gray-50 border border-gray-100 text-center items-center group shadow-none hover:shadow-md">
                            <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110">{icon}</div>
                            <div className="font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{name}</div>
                            <div className="text-gray-500 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{desc}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── Team ── */}
        <section className="py-20 md:py-24 bg-gray-50 border-b border-gray-100">
            <div className="container-main">
                <div className="text-center mb-16 space-y-4 max-w-2xl mx-auto">
                    <div className="section-badge mx-auto">
                        <Users className="w-4 h-4" />
                        আমাদের দল
                    </div>
                    <h2 className="text-section-title">দলের সদস্যরা</h2>
                    <p className="text-subtext">যারা সর্বদা কাজ করে যাচ্ছে</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {TEAM.map(({ name, role, emoji }) => (
                        <div key={name} className="card text-center items-center border border-gray-100">
                            <div className="w-20 h-20 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-4xl mb-6 shadow-sm">
                                {emoji}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{name}</h3>
                            <p className="text-gray-500 font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 md:py-32 bg-green-50 relative overflow-hidden">
            <div className="container-main text-center relative z-10 max-w-3xl space-y-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>এখনই ব্যবহার শুরু করুন</h2>
                <p className="text-xl text-gray-600 leading-relaxed max-w-xl mx-auto">
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
    </div>
);

export default AboutPage;
