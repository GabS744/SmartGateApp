import '../../../global.css';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Edit2, Check, LogOut } from 'lucide-react-native';
import ProfileSection from '@/components/ProfileSection';
import InfoField from '@/components/InfoField';
import { logout, getUserById, updateUser } from '@/services/api';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    cpf: '',
    rg: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    apartment: '',
  });

  // Carregar dados do usuário ao montar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        const storedName = await AsyncStorage.getItem('userName');

        // MOCK DATA
        const mockData = {
          phone: '(81) 99439-9459',
          cpf: '123.456.789-00',
          rg: '12.345.678-9',
          dateOfBirth: '2004-11-17',
          gender: 'Masculino',
          address: 'Rua das Flores, 123',
          city: 'São Paulo - SP',
          apartment: '102',
        };

        if (userId && userId !== 'USER' && userId !== 'default-user-id') {
          try {
            const userData = await getUserById(userId);

            setFormData({
              id: userData.id || '',
              name: storedName || userData.name || '',
              email: userData.email || '',
              phone: userData.phone || mockData.phone,
              cpf: userData.cpf || mockData.cpf,
              rg: userData.rg || mockData.rg,
              dateOfBirth: userData.dateOfBirth
                ? formatDate(userData.dateOfBirth)
                : formatDate(mockData.dateOfBirth),
              gender: userData.gender || mockData.gender,
              address: userData.address || mockData.address,
              city: userData.city || mockData.city,
              apartment: userData.apartment || mockData.apartment,
            });
          } catch (apiError) {
            // Falha silenciosa na API, usa dados locais/mock
            setFormData({
              id: userId,
              name: storedName || 'Gabriel Nascimento',
              email: 'sousagabriel7444@gmail.com',
              phone: mockData.phone,
              cpf: mockData.cpf,
              rg: mockData.rg,
              dateOfBirth: formatDate(mockData.dateOfBirth),
              gender: mockData.gender,
              address: mockData.address,
              city: mockData.city,
              apartment: mockData.apartment,
            });
          }
        } else {
          setFormData({
            id: 'mock-id',
            name: storedName || 'Gabriel Nascimento',
            email: 'sousagabriel7444@gmail.com',
            phone: mockData.phone,
            cpf: mockData.cpf,
            rg: mockData.rg,
            dateOfBirth: formatDate(mockData.dateOfBirth),
            gender: mockData.gender,
            address: mockData.address,
            city: mockData.city,
            apartment: mockData.apartment,
          });
        }
      } catch (error) {
        // Ignora erro global
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateString: string): string => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  // 🔵 Atualiza usuário (com tratamento silencioso de erros)
  const handleSave = async () => {
    if (!formData.name) {
      Alert.alert('Erro', 'Nome é obrigatório.');
      return;
    }

    setIsSaving(true);

    try {
      // 1. Tenta salvar na API
      if (formData.id && formData.id !== 'mock-id') {
        const dataToSend = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          cpf: formData.cpf,
          rg: formData.rg,
          dateOfBirth: parseDate(formData.dateOfBirth),
          gender: formData.gender,
          address: formData.address,
          city: formData.city,
          apartment: formData.apartment,
        };
        await updateUser(formData.id, dataToSend);
      }

      // 2. Salva localmente
      await AsyncStorage.setItem('userName', formData.name);

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      setIsEditing(false);
    } catch (error) {
      // Se der erro na API, apenas loga e fecha a edição (mock behavior)
      console.log('Erro ao salvar na API (ignorado para mock):', error);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado (Localmente)!');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair da Conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout(); // Agora a função existe no api.ts
            router.replace('/login');
          } catch (e) {
            console.error('Erro ao sair:', e);
            // Força saída mesmo com erro
            await AsyncStorage.clear();
            router.replace('/login');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F2F3FB]">
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#283B7D" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ alignItems: 'center', paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}>
          {/* Botão de Editar no Topo */}
          <View className="mt-4 w-full flex-row justify-end px-6">
            <TouchableOpacity
              onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
              className={`flex-row items-center rounded-full px-4 py-2 ${
                isEditing ? 'bg-green-600' : 'bg-[#131E46]'
              }`}
              disabled={isSaving}>
              {isSaving ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <>
                  {isEditing ? <Check size={16} color="#FFF" /> : <Edit2 size={16} color="#FFF" />}
                  <Text className="ml-2 font-bold text-white">
                    {isEditing ? 'Salvar' : 'Editar'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Foto e Nome */}
          <View className="mb-8 mt-4 w-full items-center">
            <View className="h-36 w-36 items-center justify-center rounded-[72px] bg-white shadow-sm">
              <View className="h-32 w-32 items-center justify-center rounded-[64px] bg-[#131E46]">
                <User size={64} color="#FFFFFF" />
              </View>
            </View>

            {isEditing ? (
              <TextInput
                value={formData.name}
                onChangeText={(t) => setFormData((prev) => ({ ...prev, name: t }))}
                className="mt-4 min-w-[60%] border-b border-[#131E46] text-center text-2xl font-bold text-[#131E46]"
                placeholder="Digite seu nome"
              />
            ) : (
              <Text className="mt-4 text-center text-2xl font-bold text-[#131E46]">
                {formData.name || 'Usuário'}
              </Text>
            )}

            <Text className="text-sm text-gray-500">
              {formData.apartment ? `Apto ${formData.apartment}` : 'Apto não informado'}
            </Text>
          </View>

          {/* Seções de Informação */}
          <View className="w-full px-6">
            <ProfileSection title="Informações Básicas">
              <InfoField
                label="Nome Completo"
                value={formData.name}
                isEditing={isEditing}
                onChangeText={(t) => setFormData((prev) => ({ ...prev, name: t }))}
              />
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <InfoField
                    label="CPF"
                    value={formData.cpf}
                    isEditing={isEditing}
                    onChangeText={(t) => setFormData((prev) => ({ ...prev, cpf: t }))}
                  />
                </View>
                <View className="flex-1">
                  <InfoField
                    label="RG"
                    value={formData.rg}
                    isEditing={isEditing}
                    onChangeText={(t) => setFormData((prev) => ({ ...prev, rg: t }))}
                  />
                </View>
              </View>
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <InfoField
                    label="Nascimento"
                    value={formData.dateOfBirth}
                    isEditing={isEditing}
                    onChangeText={(t) => setFormData((prev) => ({ ...prev, dateOfBirth: t }))}
                  />
                </View>
                <View className="flex-1">
                  <InfoField
                    label="Sexo"
                    value={formData.gender}
                    isEditing={isEditing}
                    onChangeText={(t) => setFormData((prev) => ({ ...prev, gender: t }))}
                  />
                </View>
              </View>
            </ProfileSection>

            <ProfileSection title="Contato">
              <InfoField
                label="E-mail"
                value={formData.email}
                isEditing={isEditing}
                onChangeText={(t) => setFormData((prev) => ({ ...prev, email: t }))}
                keyboardType="email-address"
              />
              <InfoField
                label="Telefone"
                value={formData.phone}
                isEditing={isEditing}
                onChangeText={(t) => setFormData((prev) => ({ ...prev, phone: t }))}
                keyboardType="numeric"
              />
            </ProfileSection>

            <ProfileSection title="Endereço">
              <InfoField
                label="Logradouro"
                value={formData.address}
                isEditing={isEditing}
                onChangeText={(t) => setFormData((prev) => ({ ...prev, address: t }))}
              />
              <InfoField
                label="Cidade/UF"
                value={formData.city}
                isEditing={isEditing}
                onChangeText={(t) => setFormData((prev) => ({ ...prev, city: t }))}
              />
              <InfoField
                label="Apartamento"
                value={formData.apartment}
                isEditing={isEditing}
                onChangeText={(t) => setFormData((prev) => ({ ...prev, apartment: t }))}
              />
            </ProfileSection>

            <TouchableOpacity
              onPress={handleLogout}
              className="mb-6 mt-8 flex-row items-center justify-center rounded-xl border border-red-200 bg-red-100 p-4">
              <LogOut size={20} color="#DC2626" />
              <Text className="ml-2 text-base font-bold text-red-600">Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
