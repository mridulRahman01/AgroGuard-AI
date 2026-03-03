import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
    const { session, isLoading } = useAuth();
    const location = useLocation();

    // Show a loading spinner while Supabase checks the session
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader className="w-12 h-12 text-green-600 animate-spin mb-4" />
                <p className="text-gray-500 font-medium" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                    অ্যাকাউন্ট যাচাই করা হচ্ছে...
                </p>
            </div>
        );
    }

    // Redirect to login if not authenticated, saving the attempted URL
    if (!session) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Render child routes if authenticated
    return <Outlet />;
};
