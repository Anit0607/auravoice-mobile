import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this to your backend API URL
const API_BASE_URL = 'https://3000-iew2nonry4mg1wq9yzyd5-94df1c56.sg1.manus.computer';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadRecording = async (base64Audio: string) => {
  const response = await apiClient.post('/api/trpc/aura.uploadRecording', {
    json: base64Audio,
  });
  return response.data.result.data;
};

export const analyzeRecording = async (recordingId: number) => {
  const response = await apiClient.post('/api/trpc/aura.analyzeRecording', {
    json: { recordingId },
  });
  return response.data.result.data;
};

export const getLatestScore = async () => {
  const response = await apiClient.post('/api/trpc/aura.getLatestScore');
  return response.data.result.data;
};

export const getScoreHistory = async () => {
  const response = await apiClient.post('/api/trpc/aura.getScoreHistory');
  return response.data.result.data;
};

export const getSubscription = async () => {
  const response = await apiClient.post('/api/trpc/aura.getSubscription');
  return response.data.result.data;
};

export const getMe = async () => {
  const response = await apiClient.post('/api/trpc/auth.me');
  return response.data.result.data;
};

export const logout = async () => {
  await apiClient.post('/api/trpc/auth.logout');
  await AsyncStorage.removeItem('authToken');
};

export default apiClient;
