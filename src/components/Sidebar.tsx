import React, { useState, useEffect } from 'react';
import { Home, PlusSquare, Image, User, HelpCircle, LogOut, Sun, Moon, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getUserGeneratedImagesCount, getUserSubscription } from '../services/api';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: PlusSquare, label: 'Create', path: '/create' },
  { icon: Image, label: 'Library', path: '/mediatheque' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [generatedCount, setGeneratedCount] = useState<number>(0);
  const [currentPlan, setCurrentPlan] = useState<string>('Free');
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchUserData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const [imagesCount, subscription] = await Promise.all([
        getUserGeneratedImagesCount(user.id),
        getUserSubscription(user.id)
      ]);

      setGeneratedCount(imagesCount.generatedImagesCount);
      setCurrentPlan(subscription.currentPlan);
    } catch {
      setGeneratedCount(0);
      setCurrentPlan('Free');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user?.id]);

  useEffect(() => {
    const interval = setInterval(fetchUserData, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  const getNextPlan = (currentPlan: string) => {
    const plans = ['Free', 'Basic', 'Pro', 'Business'];
    const currentIndex = plans.indexOf(currentPlan);
    return currentIndex < plans.length - 1 ? plans[currentIndex + 1] : null;
  };

  const renderUpgradeSection = () => {
    if (loading) {
      return (
        <div className={`p-4 rounded-lg ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} border transition-colors duration-200 flex justify-center`}>
          <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
        </div>
      );
    }

    const nextPlan = currentPlan ? getNextPlan(currentPlan) : 'Basic';

    return (
      <div className={`p-4 rounded-lg ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'} border transition-colors duration-200`}>
        <p className={`text-sm mb-2 font-inter ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          {currentPlan === 'Free' 
            ? `Visual generated : ${generatedCount}/3`
            : `Visual generated : ${generatedCount}`
          }
        </p>
        {nextPlan && (
          <>
            <p className="text-xs text-yellow-500 mb-3 font-inter">
              Upgrade to {nextPlan} plan and unlock all features
            </p>
            <Link
              to="/pricing?upgrade=true"
              className={`${isDark ? 'bg-white text-zinc-900 hover:bg-zinc-100' : 'bg-zinc-900 text-white hover:bg-zinc-800'} px-4 py-2 rounded-lg text-sm font-inter w-full transition-colors inline-block text-center`}
            >
              Upgrade to {nextPlan}
            </Link>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={`fixed left-0 top-0 h-full w-64 ${isDark ? 'bg-black' : 'bg-white'} border-r ${isDark ? 'border-zinc-800' : 'border-zinc-200'} p-6 flex flex-col transition-colors duration-200`}>
      <div className="mb-12">
        <Link to="/">
          <img 
            src={isDark 
              ? "https://2points.fr/allsports/wp-content/uploads/2024/06/Logo-All-Sports.png"
              : "https://2points.fr/allsports/wp-content/uploads/2024/11/allsportb.webp"
            } 
            alt="AM Sports" 
            className="w-24 h-auto"
          />
        </Link>
      </div>

      <nav className="flex-1">
        <ul className="space-y-6">
          {menuItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 transition-colors font-inter ${
                  location.pathname === item.path 
                    ? isDark ? 'text-white' : 'text-zinc-900'
                    : isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={toggleTheme}
              className={`flex items-center space-x-3 w-full transition-colors font-inter ${
                isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </li>
        </ul>
      </nav>

      <div className="mt-auto space-y-6">
        {renderUpgradeSection()}

        <button 
          onClick={handleLogout}
          className={`flex items-center space-x-3 font-inter ${
            isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
          } transition-colors w-full`}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;