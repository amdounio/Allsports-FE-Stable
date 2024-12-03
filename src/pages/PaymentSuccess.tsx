import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../contexts/AuthContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Trigger confetti animation on mount
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center">
            <Check className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-zinc-400 mb-8">
          Thank you for subscribing to All Sports. You now have access to all premium features.
        </p>

        {/* User Info */}
        <div className="bg-zinc-900/30 rounded-xl p-6 mb-8">
          <p className="text-white mb-2">
            Welcome, {user?.firstName} {user?.lastName}!
          </p>
          <p className="text-sm text-zinc-500">
            You will be redirected to the dashboard in a few seconds...
          </p>
        </div>

        {/* Manual Navigation */}
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          Go to Dashboard
        </button>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;