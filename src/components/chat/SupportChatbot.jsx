import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Mic, User, Bot, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SupportChatbot = () => {
    const { user, session } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
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
        const messageText = text || inputStr;
        if (!messageText.trim()) return;

        // Add user message
        const newMsg = { id: Date.now(), text: messageText, sender: 'user' };
        setMessages(prev => [...prev, newMsg]);
        setInputStr('');
        setIsLoading(true);

        try {
            // Call the backend endpoint
            const res = await fetch('http://localhost:5000/api/chat', {
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
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chatbot Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white shadow-xl hover:bg-green-700 hover:scale-110 transition-all duration-300 animate-bounce"
                >
                    <MessageCircle className="w-8 h-8" />
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100" style={{ height: '500px' }}>
                    
                    {/* Header */}
                    <div className="bg-green-600 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                                AI
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg leading-tight" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>Support AI</h3>
                                <p className="text-sm text-green-100">কৃষি বিষয়ক সহকারী</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 p-4 bg-gray-50 overflow-y-auto space-y-4">
                        {messages.map((msg, idx) => (
                            <div key={msg.id || idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white'}`}>
                                        {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div 
                                        className={`p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'}`}
                                        style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-green-600 text-white">
                                        <Bot className="w-4 h-4" />
                                    </div>
                                    <div className="p-3 bg-white text-gray-800 shadow-sm border border-gray-100 rounded-2xl rounded-tl-none flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                                        <span className="text-sm text-gray-500" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>AI টাইপ করছে...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
                        <button 
                            onClick={toggleVoiceRecording}
                            className={`p-2.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'}`}
                        >
                            <Mic className="w-5 h-5" />
                        </button>
                        
                        <input
                            type="text"
                            value={inputStr}
                            onChange={(e) => setInputStr(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="আপনার প্রশ্ন লিখুন..."
                            className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
                            style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
                        />
                        
                        <button 
                            onClick={() => handleSendMessage()}
                            disabled={!inputStr.trim() || isLoading}
                            className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center shrink-0 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4 -ml-0.5" />
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
};

export default SupportChatbot;
