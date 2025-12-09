import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'lucide-react-native';

interface ExpenseCardProps {
  category: string;
  status: 'Pago' | 'Pendente' | 'Futuro';
  title: string;
  date: string;
  value: string;
  onPressDetails?: () => void;
}

export default function ExpenseCard({
  category,
  status,
  title,
  date,
  value,
  onPressDetails,
}: ExpenseCardProps) {
  const getStatusStyle = () => {
    switch (status) {
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
    <View className="mb-4 w-full rounded-xl border border-blue-200 bg-white p-4 shadow-sm">
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-row gap-2">
          <View className="rounded-full border border-gray-400 px-3 py-1">
            <Text className="text-[10px] font-bold text-gray-600">{category}</Text>
          </View>
          <View className={`rounded-full px-3 py-1 ${statusStyle.bg}`}>
            <Text className={`text-[10px] font-bold ${statusStyle.text}`}>{status}</Text>
          </View>
        </View>
        <Text className="text-base font-bold text-red-600">-R$ {value}</Text>
      </View>

      <Text className="mb-2 text-base font-bold text-[#131E46]">{title}</Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Calendar size={14} color="#9CA3AF" />
          <Text className="ml-1 text-xs text-gray-400">{date}</Text>
        </View>
        <TouchableOpacity onPress={onPressDetails}>
          <Text className="text-xs text-blue-400 underline">Ver detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
