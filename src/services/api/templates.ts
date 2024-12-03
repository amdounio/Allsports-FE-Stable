import { api } from './config';

export interface Template {
  id: number;
  name: string;
  premium: boolean;
  image: string;
  content: string;
}

export const getTemplates = async (): Promise<Template[]> => {
  try {
    const response = await api.get('/api/templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
};