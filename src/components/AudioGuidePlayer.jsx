import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';

const AudioGuidePlayer = ({ variant = 'hero' }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // Pause any other playing audios on the page to prevent overlapping
            document.querySelectorAll('audio').forEach(el => el.pause());

            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Audio playback failed:", error);
                    setIsPlaying(false);
                    alert("অডিও ফাইলটি পাওয়া যায়নি। অনুগ্রহ করে 'agroguard-guide.mp3' ফাইলটি public/audio/ ফোল্ডারে যুক্ত করুন।");
                });
            }
        }
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio && audio.duration) {
            setProgress((audio.currentTime / audio.duration) * 100);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    const audioProps = {
        ref: audioRef,
        src: "/audio/agroguard-guide.mp3",
        onPlay: () => setIsPlaying(true),
        onPause: () => setIsPlaying(false),
        onEnded: handleEnded,
        onTimeUpdate: handleTimeUpdate
    };

    if (variant === 'floating') {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={togglePlay}
                    className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center relative group"
                    aria-label="কীভাবে ওয়েবসাইটটি ব্যবহার করবেন - অডিও গাইড"
                    title="এই বাটনে ক্লিক করলে AgroGuard AI কীভাবে ব্যবহার করবেন তা শোনা যাবে"
                >
                    {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Volume2 className="w-7 h-7" />}

                    {isPlaying && (
                        <span className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping opacity-75"></span>
                    )}
                </button>
                <audio {...audioProps} />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center sm:items-start gap-1 w-full sm:w-auto">
            <button
                onClick={togglePlay}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-green-600/20 hover:-translate-y-1 w-full sm:w-auto"
                aria-label="কিভাবে ওয়েবসাইটটি ব্যবহার করবেন"
                title="এই বাটনে ক্লিক করলে AgroGuard AI কীভাবে ব্যবহার করবেন তা শোনা যাবে"
            >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                <span className="text-base" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    {isPlaying ? 'শোনা হচ্ছে...' : 'কিভাবে ওয়েবসাইটটি চালাবেন'}
                </span>
            </button>

            {/* Progress Bar under the Hero button */}
            <div className={`w-full max-w-[240px] h-1.5 bg-green-100 rounded-full overflow-hidden transition-all duration-500 ${isPlaying || progress > 0 ? 'opacity-100' : 'opacity-0'}`}>
                <div
                    className="h-full bg-green-600 transition-all duration-100 ease-linear rounded-full"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <audio {...audioProps} />
        </div>
    );
};

export default AudioGuidePlayer;
