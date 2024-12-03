import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { getPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod } from '../services/api';
import { CreditCard, Plus, Star, StarOff, Trash2, Loader2 } from 'lucide-react';
import AddPaymentMethodModal from './AddPaymentMethodModal';
import toast from 'react-hot-toast';

// Import SVG icons directly
import visaIcon from '/visa-icon.svg';
import mastercardIcon from '/mastercard-icon.svg';
import amexIcon from '/amex-icon.svg';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault: boolean;
}

const PaymentMethods = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await getPaymentMethods(user.id);
      setPaymentMethods(response || []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      toast.error('Failed to load payment methods');
      setPaymentMethods([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [user?.id]);

  const handleDelete = async (paymentMethodId: string) => {
    if (!user?.id || processingId) return;

    try {
      setProcessingId(paymentMethodId);
      await deletePaymentMethod(user.id, paymentMethodId);
      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
      toast.success('Payment method removed successfully');
    } catch (error) {
      console.error('Error deleting payment method:', error);
      toast.error('Failed to remove payment method');
    } finally {
      setProcessingId(null);
    }
  };

  const handleSetDefault = async (paymentMethodId: string) => {
    if (!user?.id || processingId) return;

    try {
      setProcessingId(paymentMethodId);
      await setDefaultPaymentMethod(user.id, paymentMethodId);
      setPaymentMethods(prev => prev.map(pm => ({
        ...pm,
        isDefault: pm.id === paymentMethodId
      })));
      toast.success('Default payment method updated');
    } catch (error) {
      console.error('Error setting default payment method:', error);
      toast.error('Failed to update default payment method');
    } finally {
      setProcessingId(null);
    }
  };

  const getBrandIcon = (brand: string) => {
    const brandLower = brand.toLowerCase();
    
    switch (brandLower) {
      case 'visa':
        return (
          <img 
            src={visaIcon} 
            alt="Visa" 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.currentTarget.src = '';
              e.currentTarget.onerror = null;
              e.currentTarget.className = 'hidden';
            }}
          />
        );
      case 'mastercard':
        return (
          <img 
            src={mastercardIcon} 
            alt="Mastercard" 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.currentTarget.src = '';
              e.currentTarget.onerror = null;
              e.currentTarget.className = 'hidden';
            }}
          />
        );
      case 'amex':
        return (
          <img 
            src={amexIcon} 
            alt="American Express" 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.currentTarget.src = '';
              e.currentTarget.onerror = null;
              e.currentTarget.className = 'hidden';
            }}
          />
        );
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className={`text-lg ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Payment Methods
        </h3>
        <button
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-2 px-4 py-2 ${
            isDark 
              ? 'bg-zinc-800 hover:bg-zinc-700' 
              : 'bg-zinc-100 hover:bg-zinc-200'
          } rounded-lg transition-colors`}
        >
          <Plus className="w-4 h-4" />
          <span>Add Card</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`${
              isDark ? 'bg-zinc-800/50' : 'bg-zinc-50'
            } rounded-xl p-4 relative overflow-hidden group`}
          >
            {/* Card Info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getBrandIcon(method.brand)}
                <div>
                  <p className={`font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    •••• {method.last4}
                  </p>
                  <p className="text-sm text-zinc-500">
                    Expires {method.expMonth.toString().padStart(2, '0')}/{method.expYear}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSetDefault(method.id)}
                  disabled={method.isDefault || !!processingId}
                  className={`p-2 rounded-lg transition-colors ${
                    method.isDefault
                      ? 'text-amber-500'
                      : isDark
                      ? 'text-zinc-400 hover:bg-zinc-700'
                      : 'text-zinc-500 hover:bg-zinc-200'
                  } ${processingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {method.isDefault ? (
                    <Star className="w-5 h-5 fill-current" />
                  ) : (
                    <StarOff className="w-5 h-5" />
                  )}
                </button>
                {!method.isDefault && (
                  <button
                    onClick={() => handleDelete(method.id)}
                    disabled={!!processingId}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark
                        ? 'text-zinc-400 hover:bg-zinc-700 hover:text-red-500'
                        : 'text-zinc-500 hover:bg-zinc-200 hover:text-red-500'
                    } ${processingId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {processingId === method.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Default Badge */}
            {method.isDefault && (
              <div className="absolute top-2 right-2">
                <span className="px-2 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs">
                  Default
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {paymentMethods.length === 0 && (
        <div className={`text-center py-8 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
          <p>No payment methods added yet.</p>
          <p className="text-sm mt-1">Add a card to manage your subscription.</p>
        </div>
      )}

      <AddPaymentMethodModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => {
          setShowAddModal(false);
          fetchPaymentMethods();
        }}
      />
    </div>
  );
};

export default PaymentMethods;