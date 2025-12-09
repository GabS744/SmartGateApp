import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Calendar, Edit, Trash2 } from 'lucide-react-native';

export interface ExpenseData {
  id: string;
  category: string;
  status: 'Pago' | 'Pendente' | 'Futuro';
  title: string;
  date: string;
  value: string;
  description: string;
}

interface ExpenseDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  data: ExpenseData | null;
  onEdit: (item: ExpenseData) => void;
  onDelete: (id: string) => void;
}

export default function ExpenseDetailsModal({
  visible,
  onClose,
  data,
  onEdit,
  onDelete,
}: ExpenseDetailsModalProps) {
  if (!data) return null;

  const getStatusStyle = () => {
    switch (data.status) {
      case 'Pago':
        return { bg: 'bg-green-200', text: 'text-green-800' };
      case 'Pendente':
        return { bg: 'bg-orange-200', text: 'text-orange-800' };
      case 'Futuro':
        return { bg: 'bg-purple-200', text: 'text-purple-800' };
      default:
        return { bg: 'bg-gray-200', text: 'text-gray-800' };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/50 px-4">
        <View className="w-full rounded-2xl bg-white p-6 shadow-lg">
          <View className="mb-2 flex-row items-start justify-between">
            <View className="w-6" />
            <Text className="text-xl font-bold text-[#283B7D]">Detalhes do Gasto</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#131E46" />
            </TouchableOpacity>
          </View>

          <View className="mb-6 h-[2px] w-full bg-[#131E46] opacity-20" />

          <View className="mb-6 flex-row gap-4">
            <View className="rounded-full border border-gray-400 px-4 py-1">
              <Text className="text-xs font-bold text-[#131E46]">{data.category}</Text>
            </View>
            <View className={`rounded-full px-4 py-1 ${statusStyle.bg}`}>
              <Text className={`text-xs font-bold ${statusStyle.text}`}>{data.status}</Text>
            </View>
          </View>

          <View className="mb-4 flex-row items-start justify-between">
            <Text className="text-base font-bold text-[#131E46]">Nome</Text>
            <Text className="ml-4 flex-1 text-right text-base font-bold text-[#131E46]">
              {data.title}
            </Text>
          </View>

          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-base font-bold text-[#131E46]">Valor</Text>
            <Text className="text-lg font-bold text-red-600">-R$ {data.value}</Text>
          </View>

          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-base font-bold text-[#131E46]">Data</Text>
            <View className="flex-row items-center">
              <Calendar size={16} color="#131E46" />
              <Text className="ml-2 text-base font-bold text-[#131E46]">{data.date}</Text>
            </View>
          </View>

          <Text className="mb-2 text-base font-bold text-[#131E46]">Descrição</Text>
          <View className="mb-6 h-28 w-full rounded-lg border border-[#131E46] p-3">
            <ScrollView showsVerticalScrollIndicator={true}>
              <Text className="text-sm leading-5 text-gray-500">
                {data.description || 'Sem descrição.'}
              </Text>
            </ScrollView>
          </View>

          <View className="w-full flex-row gap-4">
            <TouchableOpacity
              onPress={() => onEdit(data)}
              className="flex-1 flex-row items-center justify-center rounded-lg bg-[#131E46] py-3">
              <Edit size={18} color="white" />
              <Text className="ml-2 font-bold text-white">Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onDelete(data.id)}
              className="flex-1 flex-row items-center justify-center rounded-lg bg-[#EF4444] py-3">
              <Trash2 size={18} color="white" />
              <Text className="ml-2 font-bold text-white">Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
