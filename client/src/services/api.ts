import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://smartgateapp-production.up.railway.app/v1';

// --- CONSTANTE NECESSÁRIA PARA O MENU ---
const CONDOMINIUM_ID = 'e2071683-1463-42a0-9343-41d655474305';

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
  if (response.data.id) await AsyncStorage.setItem('userId', response.data.id);
  if (response.data.name) await AsyncStorage.setItem('userName', response.data.name);
  if (response.data.role) await AsyncStorage.setItem('userRole', response.data.role);
  return response.data;
};

// --- ADICIONE ESTA FUNÇÃO DE LOGOUT AQUI ---
export const logout = async () => {
  // Limpa todos os dados salvos no dispositivo
  await AsyncStorage.clear();
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

// --- GASTOS ---
export const getExpenses = async (month: string, year: string) => {
  const response = await api.get('/expenses/period', { params: { month, year } });
  return response.data;
};

export const getFinancialSummary = async (condominiumId: string, month: string, year: string) => {
  const response = await api.get(`/expenses/condominium/${condominiumId}/summary`, {
    params: { month, year },
  });
  return response.data;
};

export const createExpense = async (expenseData: any) => {
  const response = await api.post('/expenses', expenseData);
  return response.data;
};

export const updateExpense = async (id: string, expenseData: any) => {
  const response = await api.put(`/expenses/${id}`, expenseData);
  return response.data;
};

export const deleteExpense = async (id: string) => {
  await api.delete(`/expenses/${id}`);
};

export const payExpense = async (id: string) => {
  const response = await api.patch(`/expenses/${id}/pay`);
  return response.data;
};

// --- REUNIÕES ---

export const getMeetingsByCondominium = async (condominiumId: string) => {
  const response = await api.get(`/meetings/condominium/${condominiumId}`);
  return response.data;
};

export const getUpcomingMeetings = async () => {
  const response = await api.get(`/meetings/condominium/${CONDOMINIUM_ID}`);
  return response.data;
};

export const createMeeting = async (meetingData: any) => {
  const response = await api.post('/meetings', meetingData);
  return response.data;
};

export const deleteMeeting = async (id: string) => {
  await api.delete(`/meetings/${id}`);
};

export default api;
