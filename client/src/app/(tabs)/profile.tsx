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

        // Se userId for inválido ou "USER", não tenta buscar dados
        if (userId && userId !== 'USER' && userId !== 'default-user-id') {
          const userData = await getUserById(userId);

          // Usa o nome armazenado no AsyncStorage que já tem o nome completo
          setFormData({
            id: userData.id || '',
            name: storedName || userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            cpf: userData.cpf || '',
            rg: userData.rg || '',
            dateOfBirth: userData.dateOfBirth ? formatDate(userData.dateOfBirth) : '',
            gender: userData.gender || '',
            address: userData.address || '',
            city: userData.city || '',
            apartment: userData.apartment || '',
          });
        } else {
          // Se não conseguir carregar do backend, usa dados do AsyncStorage
          setFormData((prev) => ({
            ...prev,
            id: userId || '',
            name: storedName || 'Usuário',
          }));
        }
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        // Não mostra erro se o usuário não existir no backend, apenas usa dados do storage
        const storedName = await AsyncStorage.getItem('userName');
        const userId = await AsyncStorage.getItem('userId');
        setFormData((prev) => ({
          ...prev,
          id: userId || '',
          name: storedName || 'Usuário',
        }));
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    // Assume que vem como YYYY-MM-DD
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const parseDate = (dateString: string): string => {
    if (!dateString) return '';
    // Converte DD/MM/YYYY para YYYY-MM-DD
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleSave = async () => {
    if (!formData.id) {
      Alert.alert('Erro', 'ID do usuário não encontrado.');
      return;
    }

    if (!formData.name || !formData.email) {
      Alert.alert('Erro', 'Nome e email são obrigatórios.');
      return;
    }

    setIsSaving(true);
    try {
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
      await AsyncStorage.setItem('userName', formData.name);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- FUNÇÃO DE LOGOUT ---
  const handleLogout = () => {
    Alert.alert('Sair da Conta', 'Tem certeza que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive', // Deixa o texto vermelho no iOS
        onPress: async () => {
          await logout(); // Limpa o storage
          router.replace('/login'); // Redireciona para login
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
              {formData.apartment || 'Apto não informado'}
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
