import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Leaf, Droplets, Lightbulb, Shield } from 'lucide-react';

const SEVERITY_CONFIG = {
    low: {
        label: 'কম ক্ষতি',
        labelEn: 'Low',
        icon: CheckCircle,
        badgeClass: 'badge-low',
        borderColor: 'border-green-300',
        bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
        headerBg: 'bg-gradient-to-r from-green-600 to-emerald-600',
        progressColor: 'bg-gradient-to-r from-green-400 to-emerald-400',
        emoji: '🟢',
    },
    medium: {
        label: 'মাঝারি ক্ষতি',
        labelEn: 'Medium',
        icon: AlertTriangle,
        badgeClass: 'badge-medium',
        borderColor: 'border-yellow-300',
        bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50',
        headerBg: 'bg-gradient-to-r from-yellow-500 to-amber-500',
        progressColor: 'bg-gradient-to-r from-yellow-400 to-amber-400',
        emoji: '🟡',
    },
    high: {
        label: 'বেশি ক্ষতি',
        labelEn: 'High',
        icon: XCircle,
        badgeClass: 'badge-high',
        borderColor: 'border-red-300',
        bgColor: 'bg-gradient-to-br from-red-50 to-rose-50',
        headerBg: 'bg-gradient-to-r from-red-500 to-rose-500',
        progressColor: 'bg-gradient-to-r from-red-400 to-rose-400',
        emoji: '🔴',
    },
};

const ResultCard = ({ result }) => {
    if (!result) return null;

    const {
        diseaseName,
        diseaseNameEn,
        damageLevel,
        affectedArea,
        confidence,
        symptoms = [],
        recommendations = [],
        preventions = [],
    } = result;

    const config = SEVERITY_CONFIG[damageLevel] || SEVERITY_CONFIG.low;
    const SeverityIcon = config.icon;

    return (
        <div className={`rounded-2xl border-2 ${config.borderColor} ${config.bgColor} overflow-hidden shadow-lg animate-fade-in-up`}>
            {/* Header */}
            <div className={`${config.headerBg} p-6 md:p-8 text-white`}>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Leaf className="w-5 h-5 opacity-80" />
                            <span className="text-sm opacity-80" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                রোগ সনাক্ত হয়েছে
                            </span>
                        </div>
                        <h3 className="text-xl font-bold leading-tight" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            {diseaseName}
                        </h3>
                        {diseaseNameEn && (
                            <p className="text-sm opacity-75 mt-0.5 italic">{diseaseNameEn}</p>
                        )}
                    </div>
                    {/* Severity Badge */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                            <SeverityIcon className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-xs font-semibold bg-white/20 px-2 py-0.5 rounded-full" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            {config.emoji} {config.label}
                        </span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white/15 rounded-xl p-3">
                        <div className="text-2xl font-bold">{affectedArea}%</div>
                        <div className="text-xs opacity-80" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            জমি আক্রান্ত
                        </div>
                        <div className="progress-bar mt-2 bg-white/20">
                            <div
                                className="h-full rounded-full bg-white/70 transition-all duration-1000"
                                style={{ width: `${affectedArea}%` }}
                            />
                        </div>
                    </div>
                    <div className="bg-white/15 rounded-xl p-3">
                        <div className="text-2xl font-bold">{confidence}%</div>
                        <div className="text-xs opacity-80" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            AI নিশ্চিততা
                        </div>
                        <div className="progress-bar mt-2 bg-white/20">
                            <div
                                className="h-full rounded-full bg-white/70 transition-all duration-1000"
                                style={{ width: `${confidence}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 space-y-6">
                {/* Symptoms */}
                {symptoms.length > 0 && (
                    <div>
                        <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            <Droplets className="w-4 h-4 text-blue-500" />
                            লক্ষণসমূহ
                        </h4>
                        <ul className="space-y-2">
                            {symptoms.map((s, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div>
                        <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            সুপারিশকৃত পদক্ষেপ
                        </h4>
                        <ul className="space-y-2">
                            {recommendations.map((r, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <span className="text-gray-700">{r}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Prevention */}
                {preventions.length > 0 && (
                    <div>
                        <h4 className="flex items-center gap-2 font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                            <Shield className="w-4 h-4 text-green-600" />
                            প্রতিরোধমূলক ব্যবস্থা
                        </h4>
                        <ul className="space-y-2">
                            {preventions.map((p, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-gray-600" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                    {p}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="px-6 md:px-8 pb-6 md:pb-8">
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    ⚠️ এই ফলাফল AI দ্বারা তৈরি। চূড়ান্ত সিদ্ধান্তের জন্য কৃষি বিশেষজ্ঞের পরামর্শ নিন।
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
