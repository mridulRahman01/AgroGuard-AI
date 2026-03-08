import axios from 'axios';
import { supabase } from '../utils/supabaseClient';

// Base API instance - connect backend URL here when ready
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

// Mock data for frontend demo
export const MOCK_RESULTS = {
    ধান: {
        diseaseName: 'ধানের ব্লাস্ট রোগ (Rice Blast)',
        diseaseNameEn: 'Magnaporthe oryzae',
        damageLevel: 'medium',
        affectedArea: 42,
        confidence: 87,
        symptoms: ['পাতায় ধূসর-সাদা দাগ', 'শীষে কালো দাগ', 'পাতা শুকিয়ে যাওয়া'],
        recommendations: [
            'ট্রাইসাইক্লাজোল ৭৫% WP @ ৬ গ্রাম/১০ লিটার পানি স্প্রে করুন',
            'আক্রান্ত গাছ সরিয়ে ফেলুন',
            'সেচ কমিয়ে দিন',
            'পটাশ সার প্রয়োগ করুন',
        ],
        preventions: ['রোগ প্রতিরোধী জাত ব্যবহার করুন', 'সুষম সার ব্যবস্থাপনা করুন'],
    },
    আলু: {
        diseaseName: 'আলুর লেট ব্লাইট (Late Blight)',
        diseaseNameEn: 'Phytophthora infestans',
        damageLevel: 'high',
        affectedArea: 68,
        confidence: 92,
        symptoms: ['পাতায় বাদামি-কালো দাগ', 'পাতার নিচে সাদা ছত্রাক', 'কন্দ পচে যাওয়া'],
        recommendations: [
            'ম্যানকোজেব ৮০% WP @ ২৫ গ্রাম/১০ লিটার পানি স্প্রে করুন',
            'আক্রান্ত গাছ তুলে পুড়িয়ে ফেলুন',
            'মাঠে জল জমতে দেবেন না',
            'সাইমোক্সানিল + ম্যানকোজেব ব্যবহার করুন',
        ],
        preventions: ['সার্টিফাইড বীজ ব্যবহার করুন', 'ফসল পর্যায়ক্রমে চাষ করুন'],
    },
    টমেটো: {
        diseaseName: 'টমেটোর আর্লি ব্লাইট (Early Blight)',
        diseaseNameEn: 'Alternaria solani',
        damageLevel: 'low',
        affectedArea: 18,
        confidence: 79,
        symptoms: ['পাতায় গোলাকার বাদামি দাগ', 'দাগের চারপাশে হলুদ রিং', 'পুরানো পাতা আগে আক্রান্ত'],
        recommendations: [
            'ক্লোরোথ্যালোনিল ৭৫% WP @ ২০ গ্রাম/১০ লিটার পানি স্প্রে করুন',
            'আক্রান্ত পাতা ছেঁটে ফেলুন',
            'গাছের গোড়ায় মালচিং করুন',
        ],
        preventions: ['রোগমুক্ত বীজ ব্যবহার করুন', 'গাছের মধ্যে বায়ু চলাচল নিশ্চিত করুন'],
    },
    গম: {
        diseaseName: 'গমের মরিচা রোগ (Wheat Rust)',
        diseaseNameEn: 'Puccinia striiformis',
        damageLevel: 'medium',
        affectedArea: 35,
        confidence: 84,
        symptoms: ['পাতায় হলুদ-কমলা পাউডার', 'ডোরাকাটা দাগ', 'পাতা শুকিয়ে যাওয়া'],
        recommendations: [
            'প্রোপিকোনাজোল ২৫% EC @ ১০ মিলি/১০ লিটার পানি স্প্রে করুন',
            'রোগাক্রান্ত এলাকায় যাতায়াত কমান',
        ],
        preventions: ['প্রতিরোধী জাত চাষ করুন', 'সঠিক সময়ে বীজ বপন করুন'],
    },
    পেঁয়াজ: {
        diseaseName: 'পেঁয়াজের বেগুনি দাগ রোগ (Purple Blotch)',
        diseaseNameEn: 'Alternaria porri',
        damageLevel: 'low',
        affectedArea: 22,
        confidence: 81,
        symptoms: ['পাতায় বেগুনি-বাদামি দাগ', 'দাগের চারপাশে হলুদ রিং', 'পাতা ঢলে পড়া'],
        recommendations: [
            'ইপ্রোডিওন ৫০% WP @ ১৫ গ্রাম/১০ লিটার পানি স্প্রে করুন',
            'আক্রান্ত পাতা কেটে ফেলুন',
        ],
        preventions: ['সুস্থ বীজ ব্যবহার করুন', 'অতিরিক্ত সেচ এড়িয়ে চলুন'],
    },
    মরিচ: {
        diseaseName: 'মরিচের অ্যান্থ্রাকনোজ (Anthracnose)',
        diseaseNameEn: 'Colletotrichum capsici',
        damageLevel: 'high',
        affectedArea: 55,
        confidence: 89,
        symptoms: ['ফলে কালো বৃত্তাকার দাগ', 'ফল পচে যাওয়া', 'পাতায় ছোট দাগ'],
        recommendations: [
            'কার্বেন্ডাজিম ৫০% WP @ ১০ গ্রাম/১০ লিটার পানি স্প্রে করুন',
            'আক্রান্ত ফল সংগ্রহ করে নষ্ট করুন',
            'মাঠ পরিষ্কার রাখুন',
        ],
        preventions: ['রোগমুক্ত বীজ ব্যবহার করুন', 'ফসল পর্যায়ক্রমে চাষ করুন'],
    },
};

export const analyzeImage = async (imageFile, cropType, user, token) => {
    try {
        if (!user || (!user.id && !user.sub)) {
            throw new Error("অ্যানালাইসিস করার জন্য অনুগ্রহ করে প্রথমে লগইন করুন।");
        }
        
        const userId = user.id || user.sub;

        // 1. Bypass Supabase Storage completely and encode to Base64
        const base64Data = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = () => resolve(reader.result.split(',')[1]); // Extract raw base64 string
            reader.onerror = error => reject(error);
        });

        // 2. Send directly to Backend AI API
        const response = await axios.post('http://localhost:5000/api/analyze', {
            userId: userId,
            imageBase64: base64Data,
            mimeType: imageFile.type,
            cropType: cropType,
            location: user.location || 'Unknown',
            token: token
        });

        return response.data;
    } catch (error) {
        console.error("AI Analysis Failed:", error);
        throw error;
    }
};

export const submitContact = async (formData) => {
    // TODO: Uncomment when backend is ready
    // const response = await api.post('/contact', formData);
    // return response.data;
    return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 1000);
    });
};

export default api;
