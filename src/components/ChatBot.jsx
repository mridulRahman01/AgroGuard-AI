import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Mic, Bot, User, ChevronDown } from 'lucide-react';
import { useApp } from '../context/AppContext';

const WELCOME_MESSAGES = [
    {
        id: 1,
        type: 'bot',
        text: '🌿 আস্সালামু আলাইকুম! আমি AgroGuard AI-এর সহকারী। আপনাকে স্বাগতম!',
        delay: 500,
    },
    {
        id: 2,
        type: 'bot',
        text: '🌾 এই ওয়েবসাইটে আপনি আপনার ফসলের ছবি আপলোড করে রোগ সনাক্ত করতে পারবেন।',
        delay: 1800,
    },
    {
        id: 3,
        type: 'bot',
        text: '📋 কীভাবে ব্যবহার করবেন:\n১. "বিশ্লেষণ" পেজে যান\n২. ফসলের ছবি আপলোড করুন\n৩. ফসলের ধরন বেছে নিন\n৪. "বিশ্লেষণ করুন" বাটনে ক্লিক করুন',
        delay: 3200,
    },
    {
        id: 4,
        type: 'bot',
        text: '❓ আপনার কোনো প্রশ্ন থাকলে এখানে লিখুন। আমি সাহায্য করতে প্রস্তুত! 😊',
        delay: 5000,
    },
];

const MOCK_RESPONSES = [
    'ধন্যবাদ আপনার প্রশ্নের জন্য! আমাদের AI সিস্টেম শীঘ্রই এই প্রশ্নের উত্তর দিতে সক্ষম হবে।',
    'ফসলের রোগ সনাক্ত করতে "বিশ্লেষণ" পেজে যান এবং ছবি আপলোড করুন।',
    'আমাদের AI ধান, আলু, টমেটো, গম, পেঁয়াজ ও মরিচের রোগ সনাক্ত করতে পারে।',
    'ব্যাকএন্ড সংযোগের পর আমি আরও সঠিক উত্তর দিতে পারব। এখন "বিশ্লেষণ" পেজ ব্যবহার করুন।',
    'আপনার ফসলের ছবি আপলোড করুন এবং AI-এর সাহায্যে রোগ নির্ণয় করুন।',
];

const ChatBot = () => {
    const { chatOpen, setChatOpen } = useApp();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);
    const [showBadge, setShowBadge] = useState(true);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Auto-show welcome badge after 2 seconds
        const timer = setTimeout(() => setShowBadge(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (chatOpen && !hasOpened) {
            setHasOpened(true);
            setShowBadge(false);
            // Load welcome messages with delays
            WELCOME_MESSAGES.forEach((msg) => {
                setTimeout(() => {
                    setMessages((prev) => [...prev, msg]);
                }, msg.delay);
            });
        }
        if (chatOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [chatOpen, hasOpened]);

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const userMsg = {
            id: Date.now(),
            type: 'user',
            text: inputText.trim(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulate bot response
        setTimeout(() => {
            setIsTyping(false);
            const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, type: 'bot', text: randomResponse },
            ]);
        }, 1500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Chat Panel */}
            {chatOpen && (
                <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 chatbot-panel">
                    <div className="bg-white rounded-2xl shadow-2xl shadow-green-200/50 border border-green-100 overflow-hidden flex flex-col"
                        style={{ height: '480px' }}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-green-700 to-green-600 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-white font-semibold text-sm" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                        AgroGuard সহকারী
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                                        <span className="text-green-200 text-xs" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                            অনলাইন
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setChatOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4 text-white" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-green-50/30 to-white">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-2 chatbot-bubble ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                                >
                                    {/* Avatar */}
                                    <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${msg.type === 'bot'
                                            ? 'bg-gradient-to-br from-green-500 to-green-700'
                                            : 'bg-gradient-to-br from-earth-400 to-earth-600 bg-yellow-400'
                                        }`}>
                                        {msg.type === 'bot'
                                            ? <Bot className="w-3.5 h-3.5 text-white" />
                                            : <User className="w-3.5 h-3.5 text-white" />
                                        }
                                    </div>
                                    {/* Bubble */}
                                    <div
                                        className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${msg.type === 'bot'
                                                ? 'bg-white text-green-900 shadow-sm border border-green-100 rounded-tl-sm'
                                                : 'bg-gradient-to-br from-green-600 to-green-700 text-white rounded-tr-sm'
                                            }`}
                                        style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <div className="flex gap-2 chatbot-bubble">
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="bg-white border border-green-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                        <div className="flex gap-1.5 items-center">
                                            <span className="typing-dot" />
                                            <span className="typing-dot" />
                                            <span className="typing-dot" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-green-100 bg-white">
                            <div className="flex gap-2 items-end">
                                <div className="flex-1 relative">
                                    <textarea
                                        ref={inputRef}
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="বাংলায় প্রশ্ন লিখুন..."
                                        rows={1}
                                        className="w-full px-4 py-2.5 pr-10 rounded-xl border-2 border-green-100 focus:border-green-400 focus:outline-none text-sm resize-none bg-green-50/50 text-green-900 transition-colors"
                                        style={{ fontFamily: 'Hind Siliguri, sans-serif', maxHeight: '80px' }}
                                    />
                                    <button className="absolute right-2.5 bottom-2.5 text-green-400 hover:text-green-600 transition-colors">
                                        <Mic className="w-4 h-4" />
                                    </button>
                                </div>
                                <button
                                    onClick={sendMessage}
                                    disabled={!inputText.trim()}
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-green-700 text-white flex items-center justify-center hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow-md"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => { setChatOpen(!chatOpen); setShowBadge(false); }}
                className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-700 text-white shadow-xl hover:shadow-2xl hover:shadow-green-300/50 transition-all duration-300 hover:scale-110 flex items-center justify-center animate-pulse-green"
            >
                {chatOpen
                    ? <ChevronDown className="w-6 h-6" />
                    : <MessageCircle className="w-6 h-6" />
                }
                {/* Badge */}
                {showBadge && !chatOpen && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold animate-bounce">
                        !
                    </div>
                )}
            </button>

            {/* Welcome tooltip */}
            {showBadge && !chatOpen && (
                <div className="fixed bottom-24 right-4 sm:right-6 z-50 animate-fade-in-up">
                    <div className="bg-green-800 text-white text-sm px-4 py-2.5 rounded-xl shadow-lg max-w-48 text-center"
                        style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                        👋 সাহায্য দরকার? আমাকে জিজ্ঞাসা করুন!
                        <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-green-800 rotate-45" />
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatBot;
