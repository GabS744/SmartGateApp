import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Se estiveres a testar no telemóvel via WiFi, usa o teu IP local (ex: http://192.168.1.15:8080/v1)
// Se for no emulador, podes usar o do Railway ou localhost
const BASE_URL = 'https://smartgateapp-production.up.railway.app/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Request with token:', config.url);
  } else {
    console.log('Request WITHOUT token:', config.url);
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error.response?.status, error.response?.data);
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Authentication/Authorization error - clearing storage');
      AsyncStorage.multiRemove(['token', 'userName', 'userRole', 'userId', 'condominiumId', 'idPerson', 'idCondominium']).catch(console.error);
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    await AsyncStorage.setItem('token', response.data.token);

    // Armazena nome completo (tenta combinar firstName + lastName ou usa name)
    const fullName = response.data.firstName && response.data.lastName 
      ? `${response.data.firstName} ${response.data.lastName}`
      : response.data.name || 'Usuário';
    
    await AsyncStorage.setItem('userName', fullName);
    if (response.data.role) await AsyncStorage.setItem('userRole', response.data.role);
    if (response.data.id) await AsyncStorage.setItem('userId', response.data.id);
    if (response.data.condominiumId) await AsyncStorage.setItem('condominiumId', response.data.condominiumId);

    // TEMPORARY: Store test IDs for meeting creation until backend provides them
    // TODO: Remove this once backend returns userId and condominiumId in login response
    await AsyncStorage.setItem('idPerson', 'a7c4e8b9-3d2f-4a1b-8c5e-9f6d3a2b1c0e'); // Replace with actual user ID
    await AsyncStorage.setItem('idCondominium', 'e2071683-1463-42a0-9343-41d655474305');

    return response.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      throw new Error('Email ou senha inválidos.');
    }
    throw error;
  }
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

// --- FUNÇÃO DE LOGOUT ---
export const logout = async () => {
  try {
    await AsyncStorage.multiRemove(['token', 'userName', 'userRole', 'userId', 'condominiumId']);
  } catch (error) {
    console.error('Erro ao fazer logout', error);
  }
};

// --- FUNÇÕES DE GASTOS ---

export const getExpenses = async (month: string, year: string) => {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  const response = await api.get('/expenses/period', { params: { month: m, year: y } });
  return response.data;
};

export const getFinancialSummary = async (month: string, year: string) => {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);

  // Tenta obter o ID do storage, ou usa um fixo para testes
  let condoId = await AsyncStorage.getItem('condominiumId');
  if (!condoId) {
    // SUBSTITUA PELO ID DO SEU CONDOMÍNIO NA BASE DE DADOS SE NECESSÁRIO
    condoId = 'e2071683-1463-42a0-9343-41d655474305';
  }

  const response = await api.get(`/expenses/condominium/${condoId}/summary`, {
    params: { month: m, year: y },
  });
  return response.data;
};

export const createExpense = async (data: any) => {
  let condoId = await AsyncStorage.getItem('condominiumId');
  if (!condoId) {
    condoId = 'e2071683-1463-42a0-9343-41d655474305';
  }

  let userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    userId = 'default-user-id';
  }

  const expenseData = {
    ...data,
    condominiumId: condoId,
    committeeMemberId: userId,
  };

  try {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar despesa:', error.response?.data || error.message);
    throw error;
  }
};

export const updateExpense = async (id: string, data: any) => {
  let condoId = await AsyncStorage.getItem('condominiumId');
  if (!condoId) {
    condoId = 'e2071683-1463-42a0-9343-41d655474305';
  }

  let userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    userId = 'default-user-id';
  }

  const expenseData = {
    ...data,
    condominiumId: condoId,
    committeeMemberId: userId,
  };

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

export const getUpcomingMeetings = async () => {
  let condoId = await AsyncStorage.getItem('condominiumId');
  if (!condoId) {
    condoId = 'e2071683-1463-42a0-9343-41d655474305';
  }

  const response = await api.get(`/meetings/upcoming/${condoId}`);
  return response.data;
};

export const getAllMeetings = async () => {
  const response = await api.get("/meetings");
  return response.data;
};

export const createMeeting = async (data: {
  name: string;
  meetingDate: string;
  meetingTime: string;
  location: string;
  description: string;
  publisherId: string;
  condominiumId: string;
  participantIds: string[];
}) => {
  const response = await api.post("/meetings", data);
  return response.data;
};

export const updateMeeting = async (id: string, data: any) => {
  const response = await api.put(`/meetings/${id}`, data);
  return response.data;
};

export const deleteMeeting = async (id: string) => {
  await api.delete(`/meetings/${id}`);
};

export const getMeetingById = async (id: string) => {
  const response = await api.get(`/meetings/${id}`);
  return response.data;
};

// --- FUNÇÕES DE USUÁRIO ---

export const getUserById = async (id: string) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error.response?.data || error.message);
    throw error;
  }
};

export const updateUser = async (id: string, data: any) => {
  try {
    const response = await api.put(`/user/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao atualizar usuário:', error.response?.data || error.message);
    throw error;
  }
};

export default api;
