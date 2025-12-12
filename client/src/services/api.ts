import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://smartgateapp-production.up.railway.app/v1';

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

  // Salva o token
  await AsyncStorage.setItem('token', response.data.token);
  await AsyncStorage.setItem("userId", response.data.user.id)

  // Salva o nome e a role se existirem na resposta
  if (response.data.name) {
    await AsyncStorage.setItem('userName', response.data.name);
  }
  if (response.data.role) {
    await AsyncStorage.setItem('userRole', response.data.role);
  }

  return response.data;
};

export const register = async (dados: any) => {
  const [dia, mes, ano] = dados.dateOfBirth.split('/');
  const dataFormatada = `${ano}-${mes}-${dia}`;

  const response = await api.post('/auth/register', {
    ...dados,
    dateOfBirth: dataFormatada,
  });
  return response.data;
};

export const getUserById = async (id: string) => {
  const response = await api.get(`/user/${id}`);
  return response.data;
};

export const updateUser = async (id: string, data: any) => {
  const response = await api.put(`/user/${id}`, data);
  return response.data;
};


export default api;
