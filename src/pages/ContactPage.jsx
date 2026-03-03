import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, Loader, MessageSquare } from 'lucide-react';
import { submitContact } from '../services/api';

const CONTACT_INFO = [
    { icon: Phone, label: 'ফোন', value: '+880 1700-000000' },
    { icon: Mail, label: 'ইমেইল', value: 'info@agroguard.ai' },
    { icon: MapPin, label: 'ঠিকানা', value: 'ঢাকা, বাংলাদেশ' },
];

const FAQS = [
    { q: 'কি বিনামূল্যে ব্যবহার করা যায়?', a: 'হ্যাঁ, বর্তমানে সম্পূর্ণ বিনামূল্যে।' },
    { q: 'কোন ফসলের রোগ সনাক্ত করা যায়?', a: 'ধান, আলু, টমেটো, গম, পেঁয়াজ ও মরিচ।' },
];

const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'নাম লিখুন';
        if (!form.message.trim()) e.message = 'বার্তা লিখুন';
        if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'সঠিক ইমেইল লিখুন';
        return e;
    };

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setLoading(true);
        try {
            await submitContact(form);
            setSuccess(true);
            setForm({ name: '', email: '', phone: '', message: '' });
        } catch {
            setErrors({ general: 'সমস্যা হয়েছে। আবার চেষ্টা করুন।' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">

            {/* ── Hero ── */}
            <section className="bg-white py-20 md:py-32 border-b border-gray-100 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 -translate-y-1/2 translate-x-1/3 rounded-full bg-green-200/40 blur-3xl opacity-60" />
                </div>

                <div className="container-main text-center relative z-10 max-w-3xl space-y-6 md:space-y-8">
                    <div className="section-badge mx-auto bg-green-50 text-green-600">
                        <MessageSquare className="w-4 h-4" />
                        যোগাযোগ করুন
                    </div>
                    <h1 className="text-hero">আমাদের সাথে কথা বলুন</h1>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-lg mx-auto">
                        কোনো প্রশ্ন বা পরামর্শ থাকলে আমাদের জানান। আমরা সাহায্য করতে সর্বদা প্রস্তুত।
                    </p>
                </div>
            </section>

            {/* ── Main Content ── */}
            <section className="py-20 md:py-24">
                <div className="container-main">
                    <div className="grid lg:grid-cols-5 gap-8 md:gap-12 items-start max-w-7xl mx-auto">

                        {/* ── Left: Contact Info + FAQ ── */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Info Card */}
                            <div className="card bg-green-600 border-none text-white shadow-xl shadow-green-600/20">
                                <h2 className="text-xl font-semibold text-white mb-8" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>যোগাযোগের তথ্য</h2>
                                <div className="space-y-6 md:space-y-8">
                                    {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-green-100 text-sm font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{label}</div>
                                                <div className="text-white text-base font-semibold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{value}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-green-500/50">
                                    <p className="text-green-100 text-sm font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                        🕐 সোম–শুক্র: সকাল ৯টা – সন্ধ্যা ৬টা
                                    </p>
                                </div>
                            </div>

                            {/* FAQ */}
                            <div className="card border border-gray-100">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সাধারণ প্রশ্নসমূহ</h3>
                                <div className="space-y-6">
                                    {FAQS.map(({ q, a }) => (
                                        <div key={q} className="space-y-2">
                                            <p className="font-semibold text-gray-800 text-base" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{q}</p>
                                            <p className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ── Right: Form ── */}
                        <div className="lg:col-span-3">
                            <div className="card border border-gray-100">
                                {success ? (
                                    <div className="text-center py-16 animate-fade-in-up space-y-6">
                                        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-12 h-12 text-green-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>বার্তা পাঠানো হয়েছে! ✅</h3>
                                        <p className="text-gray-600 text-lg max-w-sm mx-auto" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                            আপনার বার্তা আমরা পেয়েছি। শীঘ্রই যোগাযোগ করব।
                                        </p>
                                        <button onClick={() => setSuccess(false)} className="btn-secondary mt-4" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                            নতুন বার্তা পাঠান
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2 mb-8">
                                            <h2 className="text-2xl font-semibold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>বার্তা পাঠান</h2>
                                            <p className="text-gray-500 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>নিচের ফর্মটি পূরণ করে আমাদের কাছে পাঠান</p>
                                        </div>

                                        {errors.general && (
                                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                                {errors.general}
                                            </div>
                                        )}

                                        <div className="grid sm:grid-cols-2 gap-6">
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-gray-700 text-sm font-semibold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>আপনার নাম *</label>
                                                <input
                                                    type="text" name="name" value={form.name} onChange={handleChange}
                                                    placeholder="আপনার নাম লিখুন"
                                                    className={`input-field ${errors.name ? 'error' : ''}`}
                                                />
                                                {errors.name && <p className="text-red-500 text-xs font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{errors.name}</p>}
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <label className="text-gray-700 text-sm font-semibold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>ফোন নম্বর</label>
                                                <input
                                                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                                                    placeholder="+880 1700-000000"
                                                    className="input-field"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <label className="text-gray-700 text-sm font-semibold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>ইমেইল ঠিকানা</label>
                                            <input
                                                type="email" name="email" value={form.email} onChange={handleChange}
                                                placeholder="example@email.com"
                                                className={`input-field ${errors.email ? 'error' : ''}`}
                                            />
                                            {errors.email && <p className="text-red-500 text-xs font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{errors.email}</p>}
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <label className="text-gray-700 text-sm font-semibold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>আপনার বার্তা *</label>
                                            <textarea
                                                name="message" value={form.message} onChange={handleChange}
                                                placeholder="আপনার প্রশ্ন বা মতামত লিখুন..."
                                                rows={5}
                                                className={`input-field resize-none ${errors.message ? 'error' : ''}`}
                                            />
                                            {errors.message && <p className="text-red-500 text-xs font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{errors.message}</p>}
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="btn-primary w-full py-4 text-base"
                                                style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                            >
                                                {loading ? (
                                                    <><Loader className="w-5 h-5 animate-spin" /> পাঠানো হচ্ছে...</>
                                                ) : (
                                                    <><Send className="w-5 h-5" /> বার্তা পাঠান</>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactPage;
