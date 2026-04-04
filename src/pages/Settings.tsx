import React from 'react';

const Settings = () => {
    // TODO: Implement the Settings page here
    return (
        <div className="flex items-center justify-center h-full p-8 text-gray-500 font-sans mt-20">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>সেটিংস পেজ</h2>
                <p style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>এই পেজটির ডিজাইন এবং ফাংশনালিটি যুক্ত করতে হবে।</p>
                <p className="mt-4 text-sm text-green-600 font-mono">File: src/pages/Settings.tsx</p>
            </div>
        </div>
    );
};

export default Settings;
