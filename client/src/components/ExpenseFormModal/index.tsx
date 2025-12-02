import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { X, Calendar, ChevronDown, DollarSign, Check, Plus } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ExpenseData } from '../ExpenseDetailsModal';
import InputField from '../InputField';

interface ExpenseFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: ExpenseData | null;
}

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

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setName(initialData.title);
        setCategory(initialData.category);
        setDescription(initialData.description);
        setValue(initialData.value);
        setStatus(initialData.status);
        const [day, month, year] = initialData.date.split('/');
        const dateObject = new Date(Number(year), Number(month) - 1, Number(day));
        if (!isNaN(dateObject.getTime())) setDate(dateObject);
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

  const handleSave = () => {
    if (!name || !category || !value || !status) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios (*)');
      return;
    }

    const newData = {
      id: initialData?.id || Math.random().toString(),
      title: name,
      category,
      description,
      value,
      status,
      date: date.toLocaleDateString('pt-BR'),
    };

    onSave(newData);
    onClose();
  };

  const pickCategory = () => {
    Alert.alert('Categoria', '', [
      { text: 'Manutenção', onPress: () => setCategory('Manutenção') },
      { text: 'Limpeza', onPress: () => setCategory('Limpeza') },
      { text: 'Segurança', onPress: () => setCategory('Segurança') },
      { text: 'Interno', onPress: () => setCategory('Interno') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const pickStatus = () => {
    Alert.alert('Status', '', [
      { text: 'Pago', onPress: () => setStatus('Pago') },
      { text: 'Pendente', onPress: () => setStatus('Pendente') },
      { text: 'Futuro', onPress: () => setStatus('Futuro') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
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
            <View className="mb-4">
              <View className="mb-1 flex-row">
                <Text className="font-bold text-[#131E46]">Nome</Text>
                <Text className="text-red-500">*</Text>
              </View>
              <InputField placeholder="Nome do gasto" value={name} onChangeText={setName} />
            </View>

            <View className="mb-4">
              <View className="mb-1 flex-row">
                <Text className="font-bold text-[#131E46]">Categoria</Text>
                <Text className="text-red-500">*</Text>
              </View>
              <TouchableOpacity
                onPress={pickCategory}
                className="w-full flex-row items-center justify-between rounded-lg border border-gray-400 bg-white p-4">
                <Text className={category ? 'text-[#131E46]' : 'text-gray-400'}>
                  {category || 'Selecione'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

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

            <View className="mb-4">
              <View className="mb-1 flex-row">
                <Text className="font-bold text-[#131E46]">Status</Text>
                <Text className="text-red-500">*</Text>
              </View>
              <TouchableOpacity
                onPress={pickStatus}
                className="w-full flex-row items-center justify-between rounded-lg border border-gray-400 bg-white p-4">
                <Text className={status ? 'text-[#131E46]' : 'text-gray-400'}>
                  {status || 'Selecione'}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

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
      </View>
    </Modal>
  );
}
