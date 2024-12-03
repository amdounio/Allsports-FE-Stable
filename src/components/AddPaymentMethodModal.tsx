import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { addPaymentMethod } from '../services/api';
import { X, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Stripe appearance configuration
const appearance = {
  theme: 'night',
  variables: {
    colorPrimary: '#0070f3',
    colorBackground: '#18181b',
    colorText: '#ffffff',
    colorDanger: '#ef4444',
    fontFamily: 'ui-sans-serif, system-ui, sans-serif',
    spacingUnit: '4px',
    borderRadius: '8px',
  },
};

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CardForm = ({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (!paymentMethod) {
        throw new Error('Failed to create payment method');
      }

      await addPaymentMethod(user.id, paymentMethod.id);
      
      toast.success('Payment method added successfully');
      onSuccess();
    } catch (err) {
      console.error('Error adding payment method:', err);
      setError(err instanceof Error ? err.message : 'Failed to add payment method');
      toast.error(err instanceof Error ? err.message : 'Failed to add payment method');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: '16px',
        color: isDark ? '#fff' : '#000',
        '::placeholder': {
          color: isDark ? '#71717a' : '#a1a1aa',
        },
        iconColor: isDark ? '#fff' : '#000',
      },
      invalid: {
        color: '#ef4444',
        iconColor: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm text-zinc-500 mb-2">Card Details</label>
        <div className={`p-3 rounded-lg ${
          isDark
            ? 'bg-zinc-800 border-zinc-700'
            : 'bg-white border-zinc-300'
        } border focus-within:ring-2 focus-within:ring-blue-500`}>
          <CardElement options={cardStyle} />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isDark
              ? 'bg-zinc-800 hover:bg-zinc-700'
              : 'bg-zinc-100 hover:bg-zinc-200'
          }`}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !stripe}
          className={`px-4 py-2 rounded-lg ${
            isDark
              ? 'bg-white text-black hover:bg-zinc-200'
              : 'bg-black text-white hover:bg-zinc-800'
          } transition-colors ${loading || !stripe ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Adding card...</span>
            </div>
          ) : (
            'Add Card'
          )}
        </button>
      </div>
    </form>
  );
};

const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`w-full max-w-md ${isDark ? 'bg-zinc-900' : 'bg-white'} rounded-xl p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Add Payment Method</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Elements stripe={stripePromise} options={{ appearance }}>
          <CardForm onClose={onClose} onSuccess={onSuccess} />
        </Elements>
      </div>
    </div>
  );
};

export default AddPaymentMethodModal;