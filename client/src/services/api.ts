import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://localhost:8080/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  await AsyncStorage.setItem('token', response.data.token);
  return response.data;
};

export const register = async (dados: any) => {

  const [dia, mes, ano] = dados.dateOfBirth.split('/');
  const dataFormatada = `${ano}-${mes}-${dia}`;

  const response = await api.post('/auth/register', {
    ...dados,
    dateOfBirth: dataFormatada
  });
  return response.data;
};

export default api;