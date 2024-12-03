import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthLayout from '../components/AuthLayout';
import { useTheme } from '../contexts/ThemeContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password, rememberMe);
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleAppleSignIn = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/apple`;
  };

  return (
    <AuthLayout>
      <div className="flex-1 p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <img 
            src={isDark 
              ? "https://2points.fr/allsports/wp-content/uploads/2024/06/Logo-All-Sports.png"
              : "https://2points.fr/allsports/wp-content/uploads/2024/11/allsportb.webp"
            } 
            alt="AM Sports" 
            className="w-24 h-auto mb-8"
          />

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-wider text-white mb-2">WELCOME BACK</h1>
          <p className="text-zinc-400 mb-6">Enter your email and password to access your account</p>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-black"
                />
                <span className="text-sm text-zinc-400">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-zinc-400 hover:text-white">
                Forgot password
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-white text-black rounded-lg py-3 font-medium transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-zinc-200'
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in with email'}
            </button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-zinc-500">Or continue with</span>
            </div>
          </div>

          {/* Social Sign In */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleAppleSignIn}
              className="flex items-center justify-center gap-3 px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white hover:bg-zinc-900 transition-colors"
            >
              <img src="/apple-logo.svg" alt="Apple" className="w-5 h-5" />
              <span>Apple</span>
            </button>
            <button
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-3 px-4 py-3 bg-black border border-zinc-800 rounded-lg text-white hover:bg-zinc-900 transition-colors"
            >
              <img src="/google-logo.svg" alt="Google" className="w-5 h-5" />
              <span>Google</span>
            </button>
          </div>

          <p className="text-center text-sm text-zinc-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;