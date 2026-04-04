import React, { useState, useCallback, useEffect } from 'react';
import { Upload, X, CheckCircle, Loader, Camera, FileImage, Microscope, Info, Leaf, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { analyzeImage } from '../services/api';
import { supabase } from '../utils/supabaseClient';
import ResultCard from '../components/ResultCard';
import toast from 'react-hot-toast';

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
    const { user, session, isLoading: isAuthLoading } = useAuth();

    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const [recentScans, setRecentScans] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    const fetchHistory = useCallback(async () => {
        if (!user) return;
        setLoadingHistory(true);
        try {
            const { data, error } = await supabase
                .from('analysis')
                .select(`
                    id,
                    disease_name,
                    confidence_score,
                    analysis_date,
                    media!inner (
                        user_id,
                        crop_type
                    )
                `)
                .eq('media.user_id', user.id)
                .order('analysis_date', { ascending: false })
                .limit(5);

            if (error) throw error;
            setRecentScans(data || []);
        } catch (err) {
            console.error('Error fetching history:', err);
        } finally {
            setLoadingHistory(false);
        }
    }, [user]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

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
        if (isAuthLoading) { setError('অ্যাকাউন্ট চেক করা হচ্ছে, দয়া করে অপেক্ষা করুন...'); return; }
        if (!user) { setError('অ্যানালাইসিস করার জন্য অনুগ্রহ করে প্রথমে লগইন করুন।'); return; }
        setError('');
        setIsAnalyzing(true);
        setAnalysisResult(null);
        try {
            const result = await analyzeImage(uploadedFile, selectedCrop, user, session?.access_token);
            setAnalysisResult(result.report);
            toast.success('বিশ্লেষণ সফলভাবে সম্পন্ন হয়েছে');
            // Refresh history
            fetchHistory();
        } catch (err) {
            setError(err.message || 'বিশ্লেষণে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleReset = () => { clearAnalysis(); setError(''); };

    const formatTimestamp = (isoString) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('bn-BD', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="font-sans space-y-6">

            {/* Title Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>নতুন ফসল বিশ্লেষণ</h1>
                <p className="text-gray-500 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>আক্রান্ত পাতার ছবি আপলোড করুন এবং এআই এর সাহায্যে দ্রুত সমাধান পান।</p>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-start">

                {/* ══ LEFT PANEL (Inputs) - Takes up 2 columns out of 3 ══ */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Upload Zone */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                <FileImage className="w-4 h-4" />
                            </div>
                            ১. ছবি আপলোড করুন
                        </h2>

                        {!uploadedImage ? (
                            <div
                                className={`drop-zone p-8 text-center border-2 border-dashed rounded-xl transition-all ${isDragging ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-400 hover:bg-gray-50/50'}`}
                                onDrop={onDrop}
                                onDragOver={onDragOver}
                                onDragLeave={onDragLeave}
                                onClick={() => document.getElementById('fileInput').click()}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4 text-green-500">
                                    <Upload className="w-8 h-8" />
                                </div>
                                <p className="text-gray-900 font-bold mb-1" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                    ছবি এখানে টেনে আনুন
                                </p>
                                <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                    অথবা ক্লিক করে ফাইল বেছে নিন
                                </p>
                                <button className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors shadow-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                    <Camera className="w-4 h-4 mr-2 inline" />
                                    ছবি বেছে নিন
                                </button>
                                <p className="text-gray-400 text-[11px] mt-4 font-medium uppercase tracking-wider">
                                    সমর্থিত ফরম্যাট: JPG, PNG, WEBP • সর্বোচ্চ ১০ MB
                                </p>
                                <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                            </div>
                        ) : (
                            <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                                <img src={uploadedImage} alt="আপলোড করা ছবি" className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <button
                                    onClick={handleReset}
                                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-red-600 flex items-center justify-center hover:bg-red-50 hover:scale-110 transition-all shadow-lg backdrop-blur-sm"
                                    aria-label="ছবি মুছুন"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-lg px-4 py-2 shadow-lg">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <span className="text-gray-900 text-sm font-bold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>ছবি প্রস্তুত</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Crop Selector */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                                <Leaf className="w-4 h-4" />
                            </div>
                            ২. ফসলের ধরন বেছে নিন
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {CROPS.map(({ value, emoji, desc }) => (
                                <button
                                    key={value}
                                    onClick={() => setSelectedCrop(value)}
                                    className={`relative p-3 rounded-xl border-2 text-center transition-all duration-200 flex flex-col items-center justify-center h-28 ${selectedCrop === value
                                        ? 'border-green-500 bg-green-50 shadow-sm'
                                        : 'border-gray-100 bg-white hover:border-green-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="text-3xl mb-2">{emoji}</div>
                                    <div className="font-bold text-gray-900 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{value}</div>
                                    <div className="text-gray-400 text-[10px] font-bold uppercase tracking-wide mt-0.5">{desc}</div>

                                    {selectedCrop === value && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white shadow-sm shadow-green-500/30">
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
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm font-medium flex items-center gap-3 animate-fade-in-up" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            <Info className="w-5 h-5 flex-shrink-0 text-red-500" />
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={isAnalyzing || !uploadedImage || !selectedCrop}
                        className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${isAnalyzing || !uploadedImage || !selectedCrop
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-none'
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20 hover:shadow-green-600/30 hover:-translate-y-0.5'
                            }`}
                        style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                    >
                        {isAnalyzing ? (
                            <><Loader className="w-5 h-5 animate-spin" /> বিশ্লেষণ চলছে...</>
                        ) : (
                            <>
                                <Microscope className="w-5 h-5" /> 
                                বিশ্লেষণ শুরু করুন
                            </>
                        )}
                    </button>
                    
                    {/* Inline Result Display if any, so that History sidebar stays clean */}
                    {isAnalyzing && (
                        <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center animate-fade-in-up">
                            <div className="relative w-20 h-20 mx-auto mb-6">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                                <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center text-3xl animate-float">🌿</div>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>AI বিশ্লেষণ চলছে...</h3>
                            <p className="text-gray-500 text-sm font-medium">Please wait while our models scan the image for anomalies.</p>
                        </div>
                    )}

                    {analysisResult && !isAnalyzing && (
                        <div className="animate-fade-in-up">
                            <ResultCard result={analysisResult} />
                        </div>
                    )}

                </div>

                {/* ══ RIGHT PANEL (History Sidebar) ══ */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-140px)] sticky top-6">
                        <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                            <div className="flex items-center gap-2 text-gray-900">
                                <Clock className="w-5 h-5 text-green-600" />
                                <h3 className="font-bold text-lg" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সাম্প্রতিক বিশ্লেষণ</h3>
                            </div>
                            <span className="bg-white text-xs font-bold text-gray-500 px-2 py-1 rounded-md border border-gray-200">History</span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {loadingHistory ? (
                                <div className="flex justify-center items-center h-48">
                                    <Loader className="w-6 h-6 text-green-600 animate-spin" />
                                </div>
                            ) : recentScans.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-48 space-y-3 text-center">
                                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-300">
                                        <FileImage className="w-6 h-6" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-400" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>কোনো ইতিহাস নেই</p>
                                </div>
                            ) : (
                                recentScans.map((scan) => (
                                    <div key={scan.id} className="p-4 rounded-xl border border-gray-100 hover:border-green-200 bg-white hover:bg-green-50/30 transition-all cursor-pointer group flex gap-4">
                                        
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                                            {CROPS.find(c => c.value === scan.media.crop_type)?.emoji || '🌿'}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-bold text-gray-900 text-sm truncate" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                                    {scan.disease_name === 'Health' ? 'সুস্থ ফসল' : scan.disease_name || 'অজানা রোগ'}
                                                </h4>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${scan.disease_name === 'Health' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {Math.round(scan.confidence_score)}%
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-xs text-gray-500 font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>{scan.media.crop_type}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">{formatTimestamp(scan.analysis_date)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all">
                                            <ArrowRight className="w-4 h-4 text-green-600" />
                                        </div>
                                        
                                    </div>
                                ))
                            )}
                        </div>

                        {recentScans.length > 0 && (
                            <div className="p-4 border-t border-gray-50 bg-gray-50/30">
                                <button className="w-full py-2.5 text-sm font-bold text-green-700 bg-white border border-green-200 hover:bg-green-50 rounded-lg transition-colors" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                    সব দেখুন
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyzePage;
