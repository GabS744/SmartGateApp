import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Se estiveres a testar no telemóvel via WiFi, usa o teu IP local (ex: http://192.168.1.15:8080/v1)
// Se for no emulador, podes usar o do Railway ou localhost
const BASE_URL = 'https://smartgateapp-production.up.railway.app/v1';

// Função para decodificar JWT e extrair o userID
const decodeJWT = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
};

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
    if (error.response?.status === 401) {
      console.log('Authentication error - clearing storage');
      AsyncStorage.multiRemove([
        'token',
        'userName',
        'userRole',
        'userId',
        'condominiumId',
        'idPerson',
        'idCondominium',
      ]).catch(console.error);
    }
    // Não limpa storage em 403, pois pode ser erro de validação ou permissão específica
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    console.log('Login response:', response.data);

    await AsyncStorage.setItem('token', response.data.token);

    // O backend retorna o userId real na resposta
    if (response.data.id) {
      await AsyncStorage.setItem('userId', response.data.id);
      console.log('Saved userId:', response.data.id);
    }

    // Armazena nome completo (tenta combinar firstName + lastName ou usa name)
    const fullName =
      response.data.firstName && response.data.lastName
        ? `${response.data.firstName} ${response.data.lastName}`
        : response.data.name || 'Usuário';

    await AsyncStorage.setItem('userName', fullName);
    if (response.data.role) await AsyncStorage.setItem('userRole', response.data.role);
    if (response.data.condominiumId)
      await AsyncStorage.setItem('condominiumId', response.data.condominiumId);

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

// Cache de categorias para evitar múltiplas requisições
let categoriesCache: any[] | null = null;

export const getExpenseCategories = async () => {
  if (categoriesCache) return categoriesCache;

  // Categorias padrão do sistema
  const defaultCategories = [
    { idCategory: 'manutenção', name: 'Manutenção' },
    { idCategory: 'limpeza', name: 'Limpeza' },
    { idCategory: 'segurança', name: 'Segurança' },
    { idCategory: 'interno', name: 'Interno' },
  ];

  try {
    // Tenta buscar do backend, mas usa padrão se falhar
    const response = await api.get('/expenses/categories');
    categoriesCache = response.data;
    return response.data;
  } catch {
    // Se falhar (403, 404, etc), usa categorias padrão
    console.log('Usando categorias padrão');
    categoriesCache = defaultCategories;
    return defaultCategories;
  }
};

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
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('Você foi deslogado. Por favor, faça login novamente.');
  }

  let condoId = await AsyncStorage.getItem('condominiumId');
  if (!condoId) {
    condoId = 'e2071683-1463-42a0-9343-41d655474305';
  }

  // Log para debug
  console.log('Creating expense with:', {
    name: data.name,
    categoryId: data.categoryId,
    amount: data.amount,
    status: data.status,
    condominiumId: condoId,
    hasToken: !!token,
  });

  let userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('Usuário não identificado. Por favor, faça login novamente.');
  }

  const expenseData = {
    name: data.name,
    categoryId: data.categoryId,
    description: data.description,
    amount: data.amount,
    status: data.status,
    expenseDate: data.expenseDate,
    condominiumId: condoId,
    committeeMemberId: userId,
  };

  try {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  } catch (error: any) {
    const errorDetails = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      sentData: expenseData,
    };
    console.error('Erro ao criar despesa:', errorDetails);
    throw error;
  }
};

export const updateExpense = async (id: string, data: any) => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    throw new Error('Você foi deslogado. Por favor, faça login novamente.');
  }

  let condoId = await AsyncStorage.getItem('condominiumId');
  if (!condoId) {
    condoId = 'e2071683-1463-42a0-9343-41d655474305';
  }

  let userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    throw new Error('Usuário não identificado. Por favor, faça login novamente.');
  }

  const expenseData = {
    name: data.name,
    categoryId: data.categoryId,
    description: data.description,
    amount: data.amount,
    status: data.status,
    expenseDate: data.expenseDate,
    condominiumId: condoId,
    committeeMemberId: userId,
  };

  try {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  } catch (error: any) {
    console.error('Update expense error:', error.response?.status, error.response?.data);
    throw error;
  }
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
  const response = await api.get('/meetings');
  return response.data;
};

export const createMeeting = async (data: {
  name: string;
  meetingDate: string;
  meetingTime: string;
  location: string;
  description: string;
  publisherId?: string;
  condominiumId?: string;
  participantIds?: string[];
}) => {
  let condoId = await AsyncStorage.getItem('condominiumId');
  if (!condoId) {
    condoId = 'e2071683-1463-42a0-9343-41d655474305';
  }

  let userId = await AsyncStorage.getItem('userId');
  if (!userId) {
    userId = 'default-user-id';
  }

  const meetingData = {
    ...data,
    publisherId: data.publisherId || userId,
    condominiumId: data.condominiumId || condoId,
    participantIds: data.participantIds || [],
  };

  const response = await api.post('/meetings', meetingData);
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
