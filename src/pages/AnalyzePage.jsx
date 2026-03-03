import React, { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, Loader, Camera, FileImage, Microscope, Info, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeImage } from '../services/api';
import ResultCard from '../components/ResultCard';

const CROPS = [
    { value: 'ধান', emoji: '🌾', desc: 'Rice' },
    { value: 'আলু', emoji: '🥔', desc: 'Potato' },
    { value: 'টমেটো', emoji: '🍅', desc: 'Tomato' },
    { value: 'গম', emoji: '🌾', desc: 'Wheat' },
    { value: 'পেঁয়াজ', emoji: '🧅', desc: 'Onion' },
    { value: 'মরিচ', emoji: '🌶️', desc: 'Chili' },
];

const AnalyzePage = () => {
    const {
        uploadedImage, setUploadedImage,
        uploadedFile, setUploadedFile,
        selectedCrop, setSelectedCrop,
        analysisResult, setAnalysisResult,
        isAnalyzing, setIsAnalyzing,
        clearAnalysis,
    } = useApp();

    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');

    const handleFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) { setError('শুধুমাত্র ছবি ফাইল আপলোড করুন।'); return; }
        if (file.size > 10 * 1024 * 1024) { setError('ফাইলের আকার ১০ MB-এর বেশি হতে পারবে না।'); return; }
        setError('');
        setUploadedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setUploadedImage(e.target.result);
        reader.readAsDataURL(file);
        setAnalysisResult(null);
    };

    const onDrop = useCallback((e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files[0]); }, []);
    const onDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);
    const handleFileInput = (e) => handleFile(e.target.files[0]);

    const handleSubmit = async () => {
        if (!uploadedFile) { setError('প্রথমে একটি ছবি আপলোড করুন।'); return; }
        if (!selectedCrop) { setError('ফসলের ধরন বেছে নিন।'); return; }
        setError('');
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeImage(uploadedFile, selectedCrop);
            setAnalysisResult(result);
        } catch {
            setError('বিশ্লেষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => { clearAnalysis(); setError(''); };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container-main py-12 md:py-16">

                {/* ── Page Header ── */}
                <div className="text-center mb-12 max-w-2xl mx-auto space-y-4">
                    <div className="section-badge mx-auto">
                        <Microscope className="w-4 h-4" />
                        AI ফসল বিশ্লেষণ
                    </div>
                    <h1 className="text-section-title">
                        ফসল বিশ্লেষণ করুন
                    </h1>
                    <p className="text-subtext">
                        আপনার ফসলের আক্রান্ত অংশের ছবি আপলোড করুন এবং AI-এর সাহায্যে রোগ সনাক্ত করুন।
                    </p>
                </div>

                {/* ── Main Grid ── */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                    {/* ══ LEFT PANEL (Inputs) ══ */}
                    <div className="space-y-6 md:space-y-8">

                        {/* Upload Zone */}
                        <div className="card space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                <FileImage className="w-5 h-5 text-green-600" />
                                ১. ছবি আপলোড করুন
                            </h2>

                            {!uploadedImage ? (
                                <div
                                    className={`drop-zone p-8 text-center ${isDragging ? 'active' : ''}`}
                                    onDrop={onDrop}
                                    onDragOver={onDragOver}
                                    onDragLeave={onDragLeave}
                                    onClick={() => document.getElementById('fileInput').click()}
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4 text-green-500">
                                        <Upload className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-900 font-medium mb-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                        ছবি এখানে টেনে আনুন
                                    </p>
                                    <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                        অথবা ক্লিক করে ফাইল বেছে নিন
                                    </p>
                                    <button className="btn-secondary text-sm px-6 py-2.5 w-auto mx-auto" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                        <Camera className="w-4 h-4 mr-2 inline" />
                                        ছবি বেছে নিন
                                    </button>
                                    <p className="text-gray-400 text-xs mt-4" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                        সমর্থিত ফরম্যাট: JPG, PNG, WEBP • সর্বোচ্চ ১০ MB
                                    </p>
                                    <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                                </div>
                            ) : (
                                <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                                    <img src={uploadedImage} alt="আপলোড করা ছবি" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <button
                                        onClick={handleReset}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-red-600 flex items-center justify-center hover:bg-red-50 transition-colors shadow-lg backdrop-blur-sm"
                                        aria-label="ছবি মুছুন"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-lg px-4 py-2 shadow-lg">
                                        <CheckCircle className="w-5 h-5 text-green-500" />
                                        <span className="text-gray-900 text-sm font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>ছবি প্রস্তুত</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Crop Selector */}
                        <div className="card space-y-4">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                <Leaf className="w-5 h-5 text-green-600" />
                                ২. ফসলের ধরন বেছে নিন
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {CROPS.map(({ value, emoji, desc }) => (
                                    <button
                                        key={value}
                                        onClick={() => setSelectedCrop(value)}
                                        className={`relative p-4 rounded-xl border-2 text-center transition-all duration-300 ${selectedCrop === value
                                            ? 'border-green-500 bg-green-50 shadow-sm'
                                            : 'border-gray-100 bg-white hover:border-green-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{emoji}</div>
                                        <div className="font-semibold text-gray-900 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{value}</div>
                                        <div className="text-gray-500 text-xs mt-0.5">{desc}</div>

                                        {selectedCrop === value && (
                                            <div className="absolute top-2 right-2 flex items-center justify-center">
                                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white">
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm flex items-center gap-3 animate-fade-in-up" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                <Info className="w-5 h-5 flex-shrink-0 text-red-500" />
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isAnalyzing || !uploadedImage || !selectedCrop}
                            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-lg transition-all duration-300 ${isAnalyzing || !uploadedImage || !selectedCrop
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-none'
                                : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20 hover:shadow-green-600/30 hover:-translate-y-0.5'
                                }`}
                            style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                        >
                            {isAnalyzing ? (
                                <><Loader className="w-5 h-5 animate-spin" /> বিশ্লেষণ চলছে...</>
                            ) : (
                                <>🔍 বিশ্লেষণ শুরু করুন</>
                            )}
                        </button>
                    </div>

                    {/* ══ RIGHT PANEL (Results) ══ */}
                    <div className="lg:sticky lg:top-24">
                        {isAnalyzing && (
                            <div className="card border-green-100 text-center py-16">
                                <div className="relative w-24 h-24 mx-auto mb-8">
                                    <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                                    <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                                    <div className="absolute inset-0 flex items-center justify-center text-4xl animate-float">🌿</div>
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>AI বিশ্লেষণ চলছে...</h3>
                                <p className="text-gray-500 mb-8" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>আপনার ফসলের ছবি গভীরভাবে পর্যালোচনা করা হচ্ছে</p>

                                <div className="max-w-xs mx-auto space-y-4">
                                    {['ছবি প্রক্রিয়াকরণ...', 'রোগের উৎস সনাক্তকরণ...', 'সঠিক প্রতিকার তৈরি...'].map((step, i) => (
                                        <div key={step} className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {analysisResult && !isAnalyzing && (
                            <div className="animate-fade-in-up">
                                <div className="flex items-center gap-2 mb-6">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                    <h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>ফলাফল প্রস্তুত</h2>
                                </div>
                                <ResultCard result={analysisResult} />
                            </div>
                        )}

                        {!analysisResult && !isAnalyzing && (
                            <div className="card border border-dashed border-gray-300 bg-gray-50/50 text-center py-16 md:py-24 flex flex-col items-center justify-center min-h-[500px]">
                                <div className="w-24 h-24 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 text-green-200">
                                    <Microscope className="w-12 h-12" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>ফলাফল এখানে দেখাবে</h3>
                                <p className="text-gray-500 mb-8 max-w-sm mx-auto" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                    উপরের নির্দেশাবলী অনুযায়ী ছবি আপলোড করুন, ফসল বেছে নিন এবং বিশ্লেষণ শুরু করুন।
                                </p>

                                {/* Placeholder skeleton */}
                                <div className="w-full max-w-xs space-y-4 opacity-40">
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                                    <div className="h-32 bg-gray-100 rounded-xl w-full mt-6" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyzePage;
