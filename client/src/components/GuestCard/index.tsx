import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User, Trash2, Clock } from 'lucide-react-native';

interface GuestCardProps {
  name: string;
  type: string; // Ex: "Visita Social" ou "Prestador"
  date: string; // Ex: "Hoje, 14:00"
  status?: 'active' | 'expired';
  onDelete: () => void;
}

export default function GuestCard({ name, type, date, status = 'active', onDelete }: GuestCardProps) {
  return (
    <View className="w-full bg-white rounded-xl p-4 mb-3 flex-row items-center justify-between border border-gray-100 shadow-sm">
      
      {/* LADO ESQUERDO: Ícone e Informações */}
      <View className="flex-row items-center flex-1">
        
        {/* Avatar do Convidado */}
        <View className={`h-12 w-12 rounded-full items-center justify-center mr-3 ${status === 'active' ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <User size={24} color={status === 'active' ? '#283B7D' : '#9CA3AF'} />
        </View>

        <View>
          <Text className="text-[#131E46] font-bold text-base">{name}</Text>
          <Text className="text-gray-500 text-xs">{type}</Text>
          
          {/* Data com ícone pequeno */}
          <View className="flex-row items-center mt-1">
            <Clock size={10} color="#283B7D" />
            <Text className="text-[#283B7D] text-[10px] ml-1 font-medium">{date}</Text>
          </View>
        </View>
      </View>

      {/* LADO DIREITO: Botão de Excluir */}
      <TouchableOpacity onPress={onDelete} className="p-2 bg-red-50 rounded-lg">
        <Trash2 size={20} color="#EF4444" />
      </TouchableOpacity>

    </View>
  );
}