import { api } from './config';

export const getPaymentMethods = async (userId: number) => {
  try {
    const response = await api.get(`/api/payment/payment-methods?userId=${userId}`);
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch payment methods');
  }
};

export const addPaymentMethod = async (userId: number, paymentMethodId: string) => {
  try {
    const response = await api.post('/api/payment/payment-methods', {
      userId,
      paymentMethodId
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to add payment method');
  }
};

export const deletePaymentMethod = async (userId: number, paymentMethodId: string) => {
  try {
    const response = await api.delete(`/api/payment/payment-methods/${paymentMethodId}`, {
      data: { userId }
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to delete payment method');
  }
};

export const setDefaultPaymentMethod = async (userId: number, paymentMethodId: string) => {
  try {
    const response = await api.post(`/api/payment/payment-methods/${paymentMethodId}/default`, {
      userId
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to set default payment method');
  }
};

export const subscribeToPlan = async (userId: number, planId: string, isSignup: boolean = false): Promise<{ url: string }> => {
  try {
    const response = await api.post(`/api/subscriptions/subscribe/${planId}`, {
      userId,
      cancelUrl: isSignup ? '/signup/choose-plan' : '/pricing',
      successUrl: isSignup ? '/payment/success' : '/payment/success/upgrade'
    });

    if (!response.data?.url) {
      throw new Error('No payment URL received');
    }

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to process subscription');
  }
};