import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserPlus, Users, History, QrCode } from 'lucide-react-native'; // Ícones novos

import RoundIconBtn from '@/components/RoundIconBtn';
import GuestCard from '@/components/GuestCard';

export default function ConvidadosScreen() {
  return (
    <SafeAreaView>
      <View className="justify-center px-6 pt-8">
        <Text className="text-2xl font-bold text-[#283B7D]">Meus Convidados</Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        className="px-6 pt-6">
        <Text className="mb-4 text-lg font-bold text-[#283B7D]">Ações Rápidas</Text>

        <View className="h-28">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 15 }}>
            <RoundIconBtn
              icon={UserPlus}
              label="Novo"
              onPress={() => console.log('Novo Convite')}
            />

            <RoundIconBtn icon={Users} label="Grupos" />

            <RoundIconBtn icon={History} label="Histórico" />
          </ScrollView>
        </View>

        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-[#283B7D]">Visitantes Ativos</Text>
          <Text className="text-sm font-semibold text-blue-600">Ver todos</Text>
        </View>

        <GuestCard
          name="Mariana Costa"
          type="Visita Social"
          date="Hoje, 19:00 - 23:00"
          onDelete={() => alert('Remover?')}
        />

        <GuestCard
          name="Rafael Técnico (Net)"
          type="Prestador de Serviço"
          date="Amanhã, 08:00 - 12:00"
          onDelete={() => alert('Remover?')}
        />

        <GuestCard
          name="Bruno Silva"
          type="Visita Recorrente"
          date="Sempre liberado"
          status="active"
          onDelete={() => alert('Remover?')}
        />

        <GuestCard
          name="Entregador iFood"
          type="Delivery"
          date="Expirou há 10min"
          status="expired"
          onDelete={() => alert('Remover?')}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
