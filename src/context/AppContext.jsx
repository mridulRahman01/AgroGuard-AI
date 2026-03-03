import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};

export const AppProvider = ({ children }) => {
    const [uploadedImage, setUploadedImage] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [selectedCrop, setSelectedCrop] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);

    const clearAnalysis = () => {
        setUploadedImage(null);
        setUploadedFile(null);
        setSelectedCrop('');
        setAnalysisResult(null);
    };

    return (
        <AppContext.Provider value={{
            uploadedImage, setUploadedImage,
            uploadedFile, setUploadedFile,
            selectedCrop, setSelectedCrop,
            analysisResult, setAnalysisResult,
            isAnalyzing, setIsAnalyzing,
            chatOpen, setChatOpen,
            clearAnalysis,
        }}>
            {children}
        </AppContext.Provider>
    );
};
