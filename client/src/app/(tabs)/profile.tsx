import '../../../global.css';
import React, { useState } from 'react';
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
import { updateUser } from '@/services/api';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: 1,
    fullName: 'Jefferson Gomes da Silva Filho',
    cpf: 'XXX.XXX.XXX-XX',
    rg: 'XXX.XXX.XXX-X',
    birthDate: '01/01/1990',
    gender: 'MASCULINO',
    email: 'jefferson@email.com.br',
    phone: '(11) 99999-9999',
    address: 'Rua Exemplo, 123',
    city: 'São Paulo - SP',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateUser(formData.id, formData);
      setIsEditing(false);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F2F3FB]">
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}>
        <View className="mt-4 w-full flex-row justify-end px-6">
          <TouchableOpacity
            onPress={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`flex-row items-center rounded-full px-4 py-2 ${isEditing ? 'bg-green-600' : 'bg-[#131E46]'}`}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <>
                {isEditing ? <Check size={16} color="#FFF" /> : <Edit2 size={16} color="#FFF" />}
                <Text className="ml-2 font-bold text-white">{isEditing ? 'Salvar' : 'Editar'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

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
