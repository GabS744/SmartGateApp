import '../../../../global.css';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react'; // Adicionado useEffect
import AsyncStorage from '@react-native-async-storage/async-storage'; // Adicionado import
import EventModal from '@/components/EventModal';
import {
  User,
  Bell,
  Car,
  CalendarDays,
  Calendar,
  HandCoins,
  UserStar,
  MessageCircleQuestionMark,
  Star, // Adicionado ícone Star
} from 'lucide-react-native';

import RoundIconBtn from '@/components/RoundIconBtn';
import InfoCard from '@/components/InfoCard';

type EventType = {
  id: number | string;
  title: string;
  date: string;
  time: string;
  shortDate?: string;
  location: string;
  createdBy: string;
  description: string;
  fullDate?: string;
};

export default function Menu() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  // Estados para armazenar dados do usuário
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');

  // Carregar dados do usuário ao iniciar
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedName = await AsyncStorage.getItem('userName');
        const storedRole = await AsyncStorage.getItem('userRole');

        if (storedName) setUserName(storedName);
        if (storedRole) setUserRole(storedRole);
      } catch (e) {
        console.error('Erro ao carregar dados do usuário', e);
      }
    };
    loadUserData();
  }, []);

  const fakeEvents = [
    {
      id: 1,
      title: 'Multas',
      date: '2025-12-01',
      time: '15:00',
      shortDate: '01/12',
      location: 'Salão de Festas - Bloco A',
      createdBy: 'Síndico João Silva',
      description:
        'Reunião para discussão sobre novas regras de multas do condomínio e revisão das penalidades existentes.',
      fullDate: 'segunda-feira, 01 de dezembro de 2025',
    },
    {
      id: 2,
      title: 'Assembleia Geral',
      date: '2025-12-02',
      time: '19:30',
      shortDate: '02/12',
      location: 'Auditório',
      createdBy: 'Síndico João Silva',
      description: 'Assembleia para discutir melhorias e orçamento do próximo ano.',
      fullDate: 'terça-feira, 02 de dezembro de 2025',
    },
    {
      id: 3,
      title: 'Manutenção Piscina',
      date: '2025-12-03',
      time: '10:00',
      shortDate: '03/12',
      location: 'Piscina',
      createdBy: 'Equipe de Manutenção',
      description: 'Limpeza completa e análise de PH da piscina.',
      fullDate: 'quarta-feira, 03 de dezembro de 2025',
    },
  ];

  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [openModal, setOpenModal] = useState(false);

  return (
    <View className="flex-1 bg-[#EFF0FB]">
      <View className="h-1/5 w-full bg-[#131E46]">
        <SafeAreaView className="flex-1 justify-center">
          <View className="flex-row items-center justify-between px-6">
            <View className="flex-row items-center">
              <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#1E3070]">
                <User color="#FFFFFF" size={24} />
              </View>
              <View className="ml-4">
                {/* Alterado para exibir Nome e Estrela se for Admin */}
                <View className="flex-row items-center">
                  <Text className="text-xl font-bold text-white">
                    Olá {userName || name || 'Usuario'}
                  </Text>
                  {userRole === 'ADMIN' && (
                    <View className="ml-2">
                      <Star color="#FFD700" fill="#FFD700" size={20} />
                    </View>
                  )}
                </View>
                <Text className="text-xs text-gray-300">Apto 102</Text>
              </View>
            </View>
            <View>
              <Bell color="#FFFFFF" size={24} />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingTop: 40, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <View className="mb-4 h-28 w-full">
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={true}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 20 }}>
            <RoundIconBtn
              icon={UserStar}
              label="Visitante"
              onPress={() => router.push('convidados')}
            />
            <RoundIconBtn
              icon={Car}
              label="Veículos"
              onPress={() => router.push('/vehicle/page')}
            />
            <RoundIconBtn
              icon={CalendarDays}
              label="Eventos"
              onPress={() => router.push('/eventsReunion/page')}
            />
            <RoundIconBtn icon={MessageCircleQuestionMark} label="Suporte" />
          </ScrollView>
        </View>

        <InfoCard icon={Calendar} title="Eventos Próximos">
          {fakeEvents.slice(0, 3).map((ev) => (
            <TouchableOpacity
              key={ev.id}
              onPress={() => {
                setSelectedEvent(ev);
                setOpenModal(true);
              }}
              className="mt-2 flex-row items-center justify-between">
              <Text className="text-gray-700">
                ({ev.shortDate}) - {ev.time} - {ev.title}
              </Text>

              <Text className="font-bold text-[#131E46]">{'>'}</Text>
            </TouchableOpacity>
          ))}
        </InfoCard>

        <EventModal visible={openModal} event={selectedEvent} onClose={() => setOpenModal(false)} />

        <InfoCard icon={HandCoins} title="Gastos do Condomínio" route="/expenses">
          <Text className="mt-2 text-gray-500">Fatura atual: R$ 450,00</Text>
        </InfoCard>
      </ScrollView>
    </View>
  );
}
