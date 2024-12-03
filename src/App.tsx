import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MediaProvider } from './contexts/MediaContext';
import { ProfileProvider } from './contexts/ProfileContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import BusinessRegistration from './pages/BusinessRegistration';
import PricingPlans from './pages/PricingPlans';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentSuccessUpgrade from './pages/PaymentSuccessUpgrade';
import Questionnaire from './pages/Questionnaire';
import Favorites from './pages/Favorites';
import Sidebar from './components/Sidebar';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import Create from './pages/Create';
import Football from './pages/Football';
import LeagueSchedule from './pages/LeagueSchedule';
import MediaLibrary from './pages/MediaLibrary';
import Profile from './pages/Profile';
import Help from './pages/Help';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AuthenticatedLayout = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'} transition-colors duration-200`}>
      <Sidebar />
      <ChatBot />
      <main className={`ml-64 p-8 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
        <div className="max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/create/football" element={<Football />} />
            <Route path="/create/football/:leagueId" element={<LeagueSchedule />} />
            <Route path="/mediatheque" element={<MediaLibrary />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-6 px-8 transition-colors duration-200">
      <div className="w-full max-w-7xl">
        <div className="bg-zinc-900/30 rounded-[30px] overflow-hidden h-[calc(100vh-3rem)] transition-colors duration-200">
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ProfileProvider>
            <MediaProvider>
              <Routes>
                <Route path="/signup" element={<AuthLayout><SignUp /></AuthLayout>} />
                <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
                <Route path="/business-registration" element={<AuthLayout><BusinessRegistration /></AuthLayout>} />
                <Route path="/pricing" element={<AuthLayout><PricingPlans /></AuthLayout>} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/success/upgrade" element={
                  <ProtectedRoute>
                    <PaymentSuccessUpgrade />
                  </ProtectedRoute>
                } />
                <Route path="/questionnaire" element={<AuthLayout><Questionnaire /></AuthLayout>} />
                <Route path="/favorites" element={<AuthLayout><Favorites /></AuthLayout>} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <AuthenticatedLayout />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </MediaProvider>
          </ProfileProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;