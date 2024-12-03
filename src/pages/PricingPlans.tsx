import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { subscribeToPlan } from '../services/api/payment';
import toast from 'react-hot-toast';

const PricingPlans = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isUpgrade = location.search.includes('upgrade=true');
  const [loading, setLoading] = React.useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSelectPlan = async (planType: string) => {
    if (!user?.id) {
      toast.error('Please log in to subscribe');
      return;
    }

    if (planType === 'free' && !isUpgrade) {
      navigate('/questionnaire');
      return;
    }

    try {
      setLoading(planType);
      const response = await subscribeToPlan(user.id, planType);
      
      if (response.url) {
        window.location.href = response.url;
      } else {
        throw new Error('Invalid payment URL');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process subscription');
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '0€',
      period: '/month',
      features: [
        {
          title: '3 visuals per month',
          description: 'Create up to 3 personalized visuals every 30 days for your events'
        },
        {
          title: '25 backgrounds',
          description: 'Access a selection of 25 backgrounds to enhance your visuals'
        },
        {
          title: '5 font choices',
          description: 'Customize the text of your visuals with 5 distinct font choices'
        }
      ],
      buttonText: 'Try Allsports Free',
      buttonClass: 'bg-black hover:bg-zinc-900',
      checkColor: 'text-white',
      onClick: () => handleSelectPlan('free'),
      disabled: isUpgrade
    },
    {
      id: 'basic',
      name: 'Basic',
      price: '70€',
      period: '/month',
      subtitle: 'No-commitment',
      features: [
        {
          title: 'Unlimited Visuals',
          description: 'Create as many custom visuals as you want, without restrictions'
        },
        {
          title: 'Complete catalog of backgrounds',
          description: 'Access our full library of premium backgrounds'
        },
        {
          title: 'Large selection of fonts',
          description: 'Benefit from a rich selection of fonts to make each visual unique'
        }
      ],
      buttonText: 'Buy now',
      buttonClass: 'bg-black hover:bg-zinc-900',
      billingPeriod: 'billed monthly',
      checkColor: 'text-white',
      onClick: () => handleSelectPlan('basic')
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '60€',
      period: '/month',
      subtitle: 'with commitment',
      features: [
        {
          title: 'Unlimited Visuals',
          description: 'Create as many custom visuals as you want, without restrictions'
        },
        {
          title: 'Complete catalog of backgrounds',
          description: 'Access our full library of premium backgrounds'
        },
        {
          title: 'Large selection of fonts',
          description: 'Benefit from a rich selection of fonts to make each visual unique'
        }
      ],
      buttonText: 'Buy now',
      buttonClass: 'bg-amber-700/80 hover:bg-amber-700/90',
      highlight: '-15% than Basic',
      billingPeriod: 'billed monthly',
      checkColor: 'text-amber-700',
      onClick: () => handleSelectPlan('pro')
    },
    {
      id: 'business',
      name: 'Business',
      price: '598€',
      period: '/year',
      subtitle: 'Best Plan',
      features: [
        {
          title: 'Unlimited Visuals',
          description: 'Create as many custom visuals as you want, without restrictions'
        },
        {
          title: 'Complete catalog of backgrounds',
          description: 'Access our full library of premium backgrounds'
        },
        {
          title: 'Large selection of fonts',
          description: 'Benefit from a rich selection of fonts to make each visual unique'
        }
      ],
      buttonText: 'Buy now',
      buttonClass: 'bg-amber-500 hover:bg-amber-600',
      highlight: '30% than Basic',
      billingPeriod: 'billed annually',
      checkColor: 'text-amber-500',
      onClick: () => handleSelectPlan('business')
    }
  ];

  return (
    <div className="min-h-screen bg-black overflow-y-visible">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="w-24">
            <img 
              src="https://2points.fr/allsports/wp-content/uploads/2024/06/Logo-All-Sports.png" 
              alt="AM Sports" 
              className="w-full h-auto object-contain" 
            />
          </div>
          <button
            onClick={handleBack}
            className="px-8 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            Back
          </button>
        </div>

        <h1 className="text-3xl font-bold tracking-wider text-white mb-12">
          {isUpgrade ? 'UPGRADE YOUR PLAN' : 'CHOOSE YOUR PLAN'}
        </h1>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-y-visible">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-zinc-900/30 rounded-3xl p-4 flex flex-col ${
                plan.disabled ? 'opacity-50' : ''
              }`}
            >
              {/* Plan Header */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <h2 className="text-xl font-medium text-white">{plan.name}</h2>
                  {plan.subtitle && (
                    <span className={`text-xs ${
                      plan.name === 'Pro' ? 'text-amber-700' : 
                      plan.name === 'Business' ? 'text-amber-500' : 
                      'text-zinc-400'
                    }`}>
                      {plan.subtitle}
                    </span>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-4 flex-1">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Check className={`w-5 h-5 flex-shrink-0 ${plan.checkColor}`} />
                    <div>
                      <p className="font-medium text-white text-sm">{feature.title}</p>
                      <p className="text-xs text-zinc-400 leading-snug">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pricing and CTA */}
              <div className="mt-4">
                {plan.highlight && (
                  <div className={`text-center mb-2 py-1 rounded-full text-sm ${
                    plan.name === 'Pro' ? 'bg-amber-700/20 text-amber-700' :
                    'bg-amber-500/20 text-amber-500'
                  }`}>
                    {plan.highlight}
                  </div>
                )}
                
                <div className="text-center mb-3">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    <span className="text-sm text-zinc-400">{plan.period}</span>
                  </div>
                  {plan.billingPeriod && (
                    <span className="text-xs text-zinc-500">{plan.billingPeriod}</span>
                  )}
                </div>

                <button
                  onClick={plan.onClick}
                  disabled={plan.disabled || loading === plan.id}
                  className={`w-full py-3 rounded-full text-sm font-medium transition-colors ${
                    plan.disabled ? 'bg-zinc-600 cursor-not-allowed' : plan.buttonClass
                  } text-white`}
                >
                  {loading === plan.id ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    plan.buttonText
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;