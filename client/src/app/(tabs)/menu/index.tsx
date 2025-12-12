import '../../../../global.css';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EventModal from '@/components/EventModal';
import { getUpcomingMeetings, getExpenses } from '@/services/api';
import {
  User,
  Bell,
  Car,
  CalendarDays,
  Calendar,
  HandCoins,
  UserStar,
  MessageCircleQuestionMark,
  Star,
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

type ExpenseType = {
  id: string;
  name: string;
  amount: number;
  status: string;
  dueDate: string;
};

export default function Menu() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [events, setEvents] = useState<EventType[]>([]);
  const [expenses, setExpenses] = useState<ExpenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [openModal, setOpenModal] = useState(false);

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

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true);
        const meetingsData = await getUpcomingMeetings();

        const formattedEvents: EventType[] = meetingsData.map((meeting: any) => ({
          id: meeting.id,
          title: meeting.title,
          date: meeting.meetingDate,
          time: meeting.meetingTime,
          shortDate: meeting.meetingDate ? meeting.meetingDate.split('-').slice(1).join('/') : '',
          location: meeting.location || 'Condomínio',
          createdBy: meeting.createdBy || 'Admin',
          description: meeting.description || '',
          fullDate: meeting.meetingDate || '',
        }));

        setEvents(formattedEvents);

        const today = new Date();
        const currentMonth = String(today.getMonth() + 1).padStart(2, '0');
        const currentYear = String(today.getFullYear());
        
        const expensesData = await getExpenses(currentMonth, currentYear);
        const formattedExpenses: ExpenseType[] = expensesData
          .filter((expense: any) => expense.status !== 'PAID')
          .map((expense: any) => ({
            id: expense.idExpense,
            name: expense.name,
            amount: expense.amount,
            status: expense.status,
            dueDate: expense.expenseDate,
          }))
          .slice(0, 3);

        setExpenses(formattedExpenses);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setEvents([]);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

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
          {!loading && events.length > 0 ? (
            events.slice(0, 3).map((ev) => (
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
            ))
          ) : (
            <Text className="mt-2 text-gray-500">
              {loading ? 'Carregando eventos...' : 'Nenhum evento próximo'}
            </Text>
          )}
        </InfoCard>

        <EventModal visible={openModal} event={selectedEvent} onClose={() => setOpenModal(false)} />

        <InfoCard icon={HandCoins} title="Próximos Gastos Pendentes">
          {!loading && expenses.length > 0 ? (
            expenses.map((exp) => (
              <TouchableOpacity
                key={exp.id}
                onPress={() => router.push('/gastos')}
                className="mt-2 flex-row items-center justify-between">
                <Text className="text-gray-700">
                  {exp.name} - R$ {exp.amount.toFixed(2)}
                </Text>
                <Text className="font-bold text-[#131E46]">{'>'}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="mt-2 text-gray-500">
              {loading ? 'Carregando gastos...' : 'Nenhum gasto pendente'}
            </Text>
          )}
        </InfoCard>
      </ScrollView>
    </View>
  );
}
