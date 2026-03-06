import React, { useState, useRef, useEffect } from 'react';
import { Loader } from 'lucide-react';

interface OTPInputProps {
    length?: number;
    isLoading: boolean;
    onVerify: (otp: string) => void;
    onResend: () => void;
    resendCooldown?: number;
}

export const OTPInput: React.FC<OTPInputProps> = ({
    length = 6,
    isLoading,
    onVerify,
    onResend,
    resendCooldown = 60
}) => {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
    const [timeLeft, setTimeLeft] = useState(resendCooldown);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input only if a value was entered
        if (element.value !== "") {
            if (element.nextSibling) {
                (element.nextSibling as HTMLInputElement).focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && inputRefs.current[index - 1]) {
                inputRefs.current[index - 1]?.focus();
                const newOtp = [...otp];
                newOtp[index - 1] = "";
                setOtp(newOtp);
            } else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
        if (/^\d+$/.test(pastedData)) {
            const pastedArray = pastedData.split("");
            setOtp([...pastedArray, ...new Array(length - pastedArray.length).fill("")]);
            if (inputRefs.current[pastedArray.length - 1]) {
                inputRefs.current[pastedArray.length - 1]?.focus();
            }
        }
    };

    const submitOTP = () => {
        const otpValue = otp.join("");
        if (otpValue.length === length) {
            onVerify(otpValue);
        }
    };

    return (
        <div className="space-y-6 text-center">
            <div className="flex justify-center gap-2">
                {otp.map((data, index) => (
                    <input
                        className={`w-12 h-14 md:w-14 md:h-16 border-2 rounded-xl text-center text-xl font-bold transition-all focus:outline-none focus:ring-4 focus:ring-green-500/20 ${data !== "" ? 'border-green-500 bg-green-50' : 'border-gray-300'
                            }`}
                        type="text"
                        name="otp"
                        maxLength={1}
                        key={index}
                        value={data}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        disabled={isLoading}
                    />
                ))}
            </div>

            <button
                onClick={submitOTP}
                disabled={isLoading || otp.join("").length !== length}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex justify-center items-center gap-2 ${isLoading || otp.join("").length !== length
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-md'
                    }`}
                style={{ fontFamily: 'Hind Siliguri, sans-serif' }}
            >
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : null}
                {isLoading ? 'যাচাই করা হচ্ছে...' : 'যাচাই করুন'}
            </button>

            <div className="text-sm font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                {timeLeft > 0 ? (
                    <p className="text-gray-500">
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} মিনিট পর আবার চেষ্টা করতে পারবেন
                    </p>
                ) : (
                    <p className="text-gray-500">
                        কোড পাননি?{' '}
                        <button
                            onClick={() => {
                                setTimeLeft(resendCooldown);
                                setOtp(new Array(length).fill(""));
                                onResend();
                            }}
                            className="text-green-600 hover:text-green-700 font-bold hover:underline"
                        >
                            আবার পাঠান
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};
