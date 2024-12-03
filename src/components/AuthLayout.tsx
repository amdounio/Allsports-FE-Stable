import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?auto=format&fit=crop&q=80",
    slogan: "Transform your venue into a sports destination with stunning match visuals"
  },
  {
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80",
    slogan: "Elevate your game day experience with professional sports graphics"
  },
  {
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80",
    slogan: "Create unforgettable moments for your sports-loving audience"
  }
];

interface AuthLayoutProps {
  children: React.ReactNode;
  variant?: 'default' | 'tall' | 'medium';
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, variant = 'default' }) => {
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Show slider only on login page
  const isLoginPage = location.pathname === '/login';
  
  const heightClass = {
    default: 'h-[640px]',
    medium: 'h-[720px]',
    tall: 'h-[800px]'
  }[variant];

  useEffect(() => {
    if (!isLoginPage) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isLoginPage]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-6xl">
        <div className={`bg-zinc-900/30 rounded-[30px] overflow-hidden flex ${heightClass}`}>
          {/* Content Section */}
          <div className={isLoginPage ? 'w-1/2' : 'w-full'}>
            {children}
          </div>

          {/* Image Slider - Only shown on login page */}
          {isLoginPage && (
            <div className="flex-1 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <img
                    src={slides[currentSlide].image}
                    alt="Sports venue"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="text-center text-white">
                      <p className="text-3xl font-light">
                        {slides[currentSlide].slogan}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSlide === index ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;