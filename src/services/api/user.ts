import { api } from './config';
import { UserInfo } from '../../types/api';

interface GeneratedImagesResponse {
  userId: number;
  generatedImagesCount: number;
  status: string;
}

interface UserSubscription {
  currentPlan: string;
  status: string;
}

export const updateUserInfo = async (data: FormData | any): Promise<{ message: string; user: UserInfo; status: string }> => {
  try {
    const headers = data instanceof FormData 
      ? { 'Content-Type': 'multipart/form-data' }
      : { 'Content-Type': 'application/json' };

    const response = await api.put('/api/edit-info', data, { headers });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to update user information');
  }
};

export const getUserGeneratedImagesCount = async (userId: number): Promise<GeneratedImagesResponse> => {
  try {
    const response = await api.post(`/api/users/${userId}/generated-images-count`, { userId });
    return {
      userId: response.data.userId,
      generatedImagesCount: response.data.generatedImagesCount,
      status: response.data.status
    };
  } catch (error) {
    console.error('Error fetching generated images count:', error);
    return {
      userId,
      generatedImagesCount: 0,
      status: 'error'
    };
  }
};

export const getUserSubscription = async (userId: number): Promise<UserSubscription> => {
  try {
    const response = await api.get(`/api/users/${userId}/subscription`);
    return {
      currentPlan: response.data.currentPlan || 'Free',
      status: response.data.status || 'success'
    };
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return {
      currentPlan: 'Free',
      status: 'error'
    };
  }
};