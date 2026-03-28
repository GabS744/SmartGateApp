import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import { X, Calendar, ChevronDown, DollarSign, Check, Plus, Tag } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ExpenseData } from '../ExpenseDetailsModal';
import InputField from '../InputField';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ExpenseFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: ExpenseData | null;
}

// Mapa para converter os nomes das categorias nos IDs do banco de dados
const CATEGORY_MAP: Record<string, string> = {
  Manutenção: '550e8400-e29b-41d4-a716-446655440001',
  Limpeza: '550e8400-e29b-41d4-a716-446655440002',
  Segurança: '550e8400-e29b-41d4-a716-446655440003',
  Interno: '550e8400-e29b-41d4-a716-446655440004',
};

const CATEGORIES_LIST = Object.keys(CATEGORY_MAP);

const CONDOMINIUM_ID = 'e2071683-1463-42a0-9343-41d655474305';
const FALLBACK_MEMBER_ID = 'b2c3d4e5-f6g7-48h9-i0j1-k2l3m4n5o6p7';

export default function ExpenseFormModal({
  visible,
  onClose,
  onSave,
  initialData,
}: ExpenseFormModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false); // Novo estado para o modal de categoria

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setName(initialData.title);
        setCategory(initialData.category);
        setDescription(initialData.description);
        setValue(String(initialData.value).replace('R$', '').trim()); // Limpa formatação se houver
        setStatus(initialData.status);
        try {
          if (initialData.date.includes('/')) {
            const [day, month, year] = initialData.date.split('/');
            const dateObject = new Date(Number(year), Number(month) - 1, Number(day));
            if (!isNaN(dateObject.getTime())) setDate(dateObject);
          } else {
            setDate(new Date(initialData.date));
          }
        } catch (e) {
          setDate(new Date());
        }
      } else {
        setName('');
        setCategory('');
        setDescription('');
        setValue('');
        setStatus('');
        setDate(new Date());
      }
    }
  }, [visible, initialData]);

  const handleSave = async () => {
    if (!name || !category || !value) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (*)');
      return;
    }

    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const memberId = FALLBACK_MEMBER_ID;

      // Limpeza do valor monetário (troca vírgula por ponto, remove R$, etc)
      const cleanValue = value.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();

      const payload = {
        name: name,
        amount: parseFloat(cleanValue),
        expenseDate: date.toISOString().split('T')[0],
        categoryId: CATEGORY_MAP[category] || CATEGORY_MAP['Interno'],
        condominiumId: CONDOMINIUM_ID,
        committeeMemberId: memberId,
        description: description,
        id: initialData?.id, // Passa o ID se for edição
      };

      onSave(payload);
      onClose();
    } catch (error) {
      console.error('Erro ao preparar dados:', error);
      Alert.alert('Erro', 'Falha ao preparar os dados da despesa.');
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View className="h-[85%] w-full rounded-t-3xl bg-[#F2F3FB] p-6">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-[#283B7D]">
              {initialData ? 'Editar Gasto' : 'Adicionar Gasto'}
            </Text>
            <TouchableOpacity onPress={onClose} className="rounded-full bg-white p-2">
              <X size={24} color="#131E46" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}>
            {/* Campo Nome */}
            <View className="mb-4">
              <View className="mb-1 flex-row">
                <Text className="font-bold text-[#131E46]">Nome</Text>
                <Text className="text-red-500">*</Text>
              </View>
              <InputField placeholder="Nome do gasto" value={name} onChangeText={setName} />
            </View>

            {/* Campo Categoria (Abre o novo Modal) */}
            <View className="mb-4">
              <View className="mb-1 flex-row">
                <Text className="font-bold text-[#131E46]">Categoria</Text>
                <Text className="text-red-500">*</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCategoryModal(true)}
                className="w-full flex-row items-center justify-between rounded-lg border border-gray-400 bg-white p-4">
                <View className="flex-row items-center">
                  <Tag size={20} color="#6B7280" className="mr-2" />
                  <Text className={category ? 'ml-2 text-[#131E46]' : 'ml-2 text-gray-400'}>
                    {category || 'Selecione uma categoria'}
                  </Text>
                </View>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Campo Valor */}
            <View className="mb-4">
              <View className="mb-1 flex-row">
                <Text className="font-bold text-[#131E46]">Valor (R$)</Text>
                <Text className="text-red-500">*</Text>
              </View>
              <View className="w-full flex-row items-center rounded-lg border border-gray-400 bg-white px-4">
                <DollarSign size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 p-4 text-[#131E46]"
                  placeholder="0,00"
                  placeholderTextColor="#9CA3AF"
                  value={value}
                  onChangeText={setValue}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Campo Data */}
            <View className="mb-4">
              <View className="mb-1 flex-row">
                <Text className="font-bold text-[#131E46]">Data</Text>
                <Text className="text-red-500">*</Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="w-full flex-row items-center rounded-lg border border-gray-400 bg-white p-4">
                <Calendar size={20} color="#9CA3AF" />
                <Text className="ml-2 text-[#131E46]">{date.toLocaleDateString('pt-BR')}</Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(e, d) => {
                  setShowDatePicker(false);
                  if (d) setDate(d);
                }}
              />
            )}

            {/* Campo Descrição */}
            <View className="mb-6">
              <Text className="mb-1 font-bold text-[#131E46]">Descrição</Text>
              <TextInput
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                className="h-24 w-full rounded-lg border border-gray-400 bg-white p-4 text-[#131E46]"
                placeholder="Detalhes..."
                placeholderTextColor="#9CA3AF"
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <TouchableOpacity
              onPress={handleSave}
              className="w-full flex-row items-center justify-center rounded-lg bg-[#131E46] py-4 shadow-md">
              {initialData ? <Check size={20} color="#FFF" /> : <Plus size={20} color="#FFF" />}
              <Text className="ml-2 text-lg font-bold text-white">
                {initialData ? 'Salvar Alterações' : 'Adicionar Gasto'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* --- MODAL BONITINHO PARA SELEÇÃO DE CATEGORIA --- */}
        <Modal
          transparent={true}
          visible={showCategoryModal}
          animationType="fade"
          onRequestClose={() => setShowCategoryModal(false)}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowCategoryModal(false)}
            className="flex-1 items-center justify-center bg-black/50 px-6">
            <View className="w-full rounded-xl bg-white p-4 shadow-lg">
              <View className="mb-4 flex-row items-center justify-between border-b border-gray-100 pb-2">
                <Text className="text-lg font-bold text-[#283B7D]">Escolha a Categoria</Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                  <X size={24} color="#131E46" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={CATEGORIES_LIST}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`mb-2 flex-row items-center rounded-lg p-4 ${category === item ? 'border border-blue-100 bg-blue-50' : 'bg-gray-50'}`}
                    onPress={() => {
                      setCategory(item);
                      setShowCategoryModal(false);
                    }}>
                    <Tag size={18} color={category === item ? '#283B7D' : '#6B7280'} />
                    <Text
                      className={`ml-3 font-semibold ${category === item ? 'text-[#283B7D]' : 'text-gray-600'}`}>
                      {item}
                    </Text>
                    {category === item && (
                      <Check size={18} color="#283B7D" style={{ marginLeft: 'auto' }} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </Modal>
  );
}
