import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Mic, User, Bot, Loader2, Sparkles, Leaf, Info } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import axios from 'axios';

const SUGGESTIONS = [
    "ধানের ব্লাস্ট রোগের লক্ষণ কী?",
    "কীটনাশক ছাড়াই পোকা দমনের উপায়",
    "টমেটো পাতায় কালো দাগ কেন হয়?",
    "আলুর লেট ব্লাইট প্রতিরোধের উপায়"
];

const ChatPage = () => {
    const { user, session } = useAuth();
    const [messages, setMessages] = useState([
        { id: 1, text: "হ্যালো! আমি AgroGuard AI। আমি আপনাকে কৃষি সম্পর্কিত যেকোনো বিষয়ে সাহায্য করতে পারি। আপনার কি জানার আছে?", sender: 'bot' }
    ]);
    const [inputStr, setInputStr] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (text) => {
        const messageText = typeof text === 'string' ? text : inputStr;
        if (!messageText.trim()) return;

        // Add user message
        const newMsg = { id: Date.now(), text: messageText, sender: 'user' };
        setMessages(prev => [...prev, newMsg]);
        setInputStr('');
        setIsLoading(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            // Call the backend endpoint
            const res = await fetch(`${apiUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    message: messageText,
                    userId: user?.id,
                    token: session?.access_token
                })
            });

            const data = await res.json();
            
            if (data.reply) {
                setMessages(prev => [...prev, { id: Date.now(), text: data.reply, sender: 'bot' }]);
            } else {
                setMessages(prev => [...prev, { id: Date.now(), text: "দুঃখিত, কোনো উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।", sender: 'bot' }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { id: Date.now(), text: "দুঃখিত, সার্ভারে সমস্যা হয়েছে।", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleVoiceRecording = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("আপনার ব্রাউজারে ভয়েস রেকর্ডিং সাপোর্ট করে না। Google Chrome ব্যবহার করুন।");
            return;
        }

        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = "bn-BD";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInputStr(transcript);
            handleSendMessage(transcript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50 font-sans relative max-w-5xl mx-auto border border-gray-100 rounded-2xl shadow-sm overflow-hidden bg-white">
            
            {/* Header */}
            <div className="bg-white border-b border-gray-100 p-5 flex items-center gap-4 shrink-0 z-10">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                    <Sparkles className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>AI কৃষি সহায়তা</h1>
                    <p className="text-sm text-gray-500 font-medium mt-0.5" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>কৃষি বিষয়ক যেকোনো প্রশ্নের উত্তর পান মুহূর্তেই</p>
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-gray-50/30">
                
                {/* Initial suggestion pills - show only if chat is mostly empty */}
                {messages.length === 1 && (
                    <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up">
                        {SUGGESTIONS.map((sug, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSendMessage(sug)}
                                className="px-4 py-2 bg-white border border-gray-200 hover:border-green-300 hover:bg-green-50 text-sm font-medium text-gray-700 hover:text-green-700 rounded-full transition-all shadow-sm"
                                style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                            >
                                {sug}
                            </button>
                        ))}
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={msg.id || idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'user' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-green-600 text-white'}`}>
                                {msg.sender === 'user' ? <User className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bot className="w-4 h-4 sm:w-5 sm:h-5" />}
                            </div>
                            <div 
                                className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed whitespace-pre-wrap shadow-sm ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}
                                style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                            >
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="flex gap-3 max-w-[85%]">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 bg-green-600 text-white shadow-sm">
                                <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                            </div>
                            <div className="p-4 bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl rounded-tl-none flex items-center gap-3">
                                <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                                <span className="text-sm font-medium text-gray-500" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>AgroGuard AI চিন্তা করছে...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-100 p-4 shrink-0 z-10">
                <div className="max-w-4xl mx-auto flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-3xl p-2 focus-within:ring-2 focus-within:ring-green-500/50 focus-within:border-green-500 transition-all shadow-inner">
                    
                    <button 
                        onClick={toggleVoiceRecording}
                        className={`p-3 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'hover:bg-gray-200 text-gray-500 hover:text-green-700'}`}
                        title="ভয়েস ইনপুট"
                    >
                        <Mic className="w-5 h-5" />
                    </button>
                    
                    <textarea
                        value={inputStr}
                        onChange={(e) => setInputStr(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="ফসল বা কৃষি সম্পর্কিত আপনার প্রশ্ন লিখুন..."
                        className="flex-1 bg-transparent border-none px-2 py-3 max-h-32 min-h-[44px] text-sm resize-none outline-none text-gray-900 placeholder-gray-400 scrollbar-hide"
                        style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                        rows={1}
                    />
                    
                    <button 
                        onClick={() => handleSendMessage()}
                        disabled={!inputStr.trim() || isLoading}
                        className="p-3 bg-green-600 text-white rounded-full flex items-center justify-center shrink-0 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg transform active:scale-95"
                    >
                        <Send className="w-5 h-5 -ml-0.5" />
                    </button>
                </div>
                <div className="text-center mt-3">
                    <p className="text-[11px] text-gray-400 font-medium flex items-center justify-center gap-1 uppercase tracking-wider">
                        <Info className="w-3 h-3" />
                        AI জেনারেটেড তথ্য, সিদ্ধান্ত নেওয়ার আগে যাচাই করুন
                    </p>
                </div>
            </div>

        </div>
    );
};

export default ChatPage;
