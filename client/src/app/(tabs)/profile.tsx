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
import { User, Edit2, Check } from 'lucide-react-native';
import ProfileSection from '@/components/ProfileSection';
import InfoField from '@/components/InfoField';
import { getUserById, updateUser } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    fullName: '',
    cpf: '',
    rg: '',
    birthDate: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  // 🔵 Busca dados REAIS do usuário
  useEffect(() => {
    (async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          Alert.alert('Erro', 'Não foi possível identificar o usuário.');
          return;
        }

        const user = await getUserById(userId);

        // Converte a data vinda do backend (YYYY-MM-DD)
        const formattedBirth =
          user.dateOfBirth
            ? new Date(user.dateOfBirth).toLocaleDateString('pt-BR')
            : '';

        // Aqui você decide como tratar CPF, RG, endereço etc
        // (o backend não retorna isso, então fica opcional ou mantemos vazio)
        setFormData({
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          birthDate: formattedBirth,
          cpf: '',
          rg: '',
          gender: '',
          phone: '',
          address: '',
          city: '',
        });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível carregar seus dados.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🔵 Atualiza usuário real
  const handleSave = async () => {
    setSaving(true);
    try {
      // Converte dd/mm/yyyy → yyyy-mm-dd
      const [day, month, year] = formData.birthDate.split('/');
      const apiDate = `${year}-${month}-${day}`;

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: '12345678', // caso o backend EXIJA senha
        dateOfBirth: apiDate,
      };

      await updateUser(formData.id, payload);

      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível atualizar.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#131E46" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F2F3FB]">
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>

        {/* BOTÃO DE EDITAR / SALVAR */}
        <View className="mt-4 w-full flex-row justify-end px-6">
          <TouchableOpacity
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`flex-row items-center rounded-full px-4 py-2 ${
              isEditing ? 'bg-green-600' : 'bg-[#131E46]'
            }`}
            disabled={saving}>

            {saving ? (
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

        {/* FOTO + NOME */}
        <View className="mb-8 mt-4 w-full items-center">
          <View className="h-36 w-36 items-center justify-center rounded-[72px] bg-white shadow-sm">
            <View className="h-32 w-32 items-center justify-center rounded-[64px] bg-[#131E46]">
              <User size={64} color="#FFFFFF" />
            </View>
          </View>

          {isEditing ? (
            <TextInput
              value={formData.fullName}
              onChangeText={(t) => handleChange('fullName', t)}
              className="mt-4 min-w-[60%] border-b border-[#131E46] text-center text-2xl font-bold text-[#131E46]"
              placeholder="Digite seu nome"
            />
          ) : (
            <Text className="mt-4 text-center text-2xl font-bold text-[#131E46]">
              {formData.fullName}
            </Text>
          )}

          <Text className="text-sm text-gray-500">Apto 104 - Bloco B</Text>
        </View>

        <View className="w-full px-6">
          {/* SEÇÃO: INFOS BÁSICAS */}
          <ProfileSection title="Informações Básicas">
            <InfoField
              label="Nome Completo"
              value={formData.fullName}
              isEditing={isEditing}
              onChangeText={(t) => handleChange('fullName', t)}
            />

            <View className="flex-row gap-4">
              <View className="flex-1">
                <InfoField label="CPF" value={formData.cpf} />
              </View>

              <View className="flex-1">
                <InfoField label="RG" value={formData.rg} />
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-1">
                <InfoField
                  label="Nascimento"
                  value={formData.birthDate}
                  isEditing={isEditing}
                  onChangeText={(t) => handleChange('birthDate', t)}
                />
              </View>

              <View className="flex-1">
                <InfoField label="Sexo" value={formData.gender} />
              </View>
            </View>
          </ProfileSection>

          {/* SEÇÃO: CONTATO */}
          <ProfileSection title="Contato">
            <InfoField
              label="E-mail"
              value={formData.email}
              isEditing={isEditing}
              onChangeText={(t) => handleChange('email', t)}
              keyboardType="email-address"
            />

            <InfoField
              label="Telefone"
              value={formData.phone}
              isEditing={isEditing}
              onChangeText={(t) => handleChange('phone', t)}
              keyboardType="numeric"
            />
          </ProfileSection>

          {/* SEÇÃO: ENDEREÇO */}
          <ProfileSection title="Endereço">
            <InfoField
              label="Logradouro"
              value={formData.address}
              isEditing={isEditing}
              onChangeText={(t) => handleChange('address', t)}
            />

            <InfoField
              label="Cidade/UF"
              value={formData.city}
              isEditing={isEditing}
              onChangeText={(t) => handleChange('city', t)}
            />
          </ProfileSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
