import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface Plan {
  id: string;
  name: string;
  subtitle?: string;
  features: {
    title: string;
    description: string;
  }[];
  price: string;
  period: string;
  billingPeriod?: string;
  highlight?: string;
  buttonText: string;
  buttonClass?: string;
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
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
    price: '0€',
    period: '/month',
    buttonText: 'Try Allsports Free',
    buttonClass: 'bg-black hover:bg-zinc-900 text-white'
  },
  {
    id: 'basic',
    name: 'Basic',
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
    price: '70€',
    period: '/month',
    billingPeriod: 'billed monthly',
    buttonText: 'Buy now',
    buttonClass: 'bg-black hover:bg-zinc-900 text-white'
  },
  {
    id: 'pro',
    name: 'Pro',
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
    price: '60€',
    period: '/month',
    billingPeriod: 'billed monthly',
    highlight: '-15% than Basic',
    buttonText: 'Buy now',
    buttonClass: 'bg-amber-700/80 hover:bg-amber-700/90 text-white'
  },
  {
    id: 'business',
    name: 'Business',
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
    price: '598€',
    period: '/year',
    billingPeriod: 'billed annually',
    highlight: '30% than Basic',
    buttonText: 'Buy now',
    buttonClass: 'bg-amber-500 hover:bg-amber-600 text-white'
  }
];

interface SubscriptionFormProps {
  onSubmit: (planId: string) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error?: string;
}

const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onSubmit,
  onBack,
  isLoading,
  error
}) => {
  return (
    <div className="h-full overflow-y-auto">
      <div className="grid grid-cols-4 gap-4">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-zinc-900/30 rounded-3xl p-4 flex flex-col"
          >
            {/* Header */}
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
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex gap-2">
                  <svg className={`w-5 h-5 flex-shrink-0 ${
                    plan.name === 'Pro' ? 'text-amber-700' :
                    plan.name === 'Business' ? 'text-amber-500' :
                    'text-white'
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-medium text-white text-sm">{feature.title}</p>
                    <p className="text-xs text-zinc-400 leading-snug">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing and Button */}
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
                onClick={() => onSubmit(plan.id)}
                disabled={isLoading}
                className={`w-full py-2 rounded-full text-sm font-medium transition-colors ${plan.buttonClass} ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-sm text-center mt-4">{error}</p>
      )}

      <div className="flex justify-start mt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-2 bg-zinc-800 text-white rounded-full text-sm hover:bg-zinc-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
    </div>
  );
};

export default SubscriptionForm;