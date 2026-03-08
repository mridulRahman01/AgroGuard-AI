import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SupportChatbot from './components/chat/SupportChatbot';
import HomePage from './pages/HomePage';
import AnalyzePage from './pages/AnalyzePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { ProtectedRoute } from './routes/ProtectedRoute';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AuthLayout = ({ children }) => {
  const { pathname } = useLocation();
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && <Navbar />}
      <main className="flex-1">
        {children}
      </main>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <SupportChatbot />}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AuthLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/analyze" element={<AnalyzePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin-dashboard" element={<Dashboard />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={
                <div className="flex items-center justify-center py-32 bg-green-50">
                  <div className="text-center">
                    <div className="text-8xl mb-6">🌿</div>
                    <h1 className="text-4xl font-bold text-green-900 mb-4" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                      পেজটি পাওয়া যায়নি
                    </h1>
                    <p className="text-green-600 mb-8" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                      আপনি যে পেজটি খুঁজছেন তা পাওয়া যায়নি।
                    </p>
                    <a href="/" className="btn-primary" style={{ fontFamily: 'Hind Siliguri, sans-serif' }}>
                      হোমে ফিরে যান
                    </a>
                  </div>
                </div>
              } />
            </Routes>
          </AuthLayout>
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
