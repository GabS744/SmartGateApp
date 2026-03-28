import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Plus, RefreshCw } from 'lucide-react-native';
import EventModal from '@/components/EventModal';
import CalendarPicker from 'react-native-calendar-picker';
import EventCreateModal, { EventFormData } from '@/components/eventCreateModal';
import { getMeetingsByCondominium, createMeeting } from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const CONDOMINIUM_ID = 'e2071683-1463-42a0-9343-41d655474305';
const FALLBACK_PUBLISHER_ID = '00306416-005a-4089-bf74-445acd252dac';

type EventType = {
  id: string;
  title: string;
  time: string;
  fullDate: string;
  rawDate: string;
  location: string;
  createdBy: string;
  description: string;
};

export default function EventsPage() {
  const router = useRouter();
  const calendarRef = useRef<any>(null);

  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [eventsByDay, setEventsByDay] = useState<Record<string, EventType[]>>({});

  const isAdmin = true;

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMeetingsByCondominium(CONDOMINIUM_ID);
      const newEventsMap: Record<string, EventType[]> = {};

      data.forEach((meeting: any) => {
        const dateKey = meeting.meetingDate;
        const [y, m, d] = dateKey.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        const fullDateStr = dateObj.toLocaleDateString('pt-BR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        const timeStr = meeting.meetingTime ? meeting.meetingTime.slice(0, 5) : '00:00';

        const eventObj: EventType = {
          id: meeting.idMeeting,
          title: meeting.name,
          time: timeStr,
          fullDate: fullDateStr,
          rawDate: dateKey,
          location: meeting.location,
          createdBy: meeting.publisherName || 'Administração',
          description: meeting.description || '',
        };

        if (!newEventsMap[dateKey]) {
          newEventsMap[dateKey] = [];
        }
        newEventsMap[dateKey].push(eventObj);
      });

      setEventsByDay(newEventsMap);
    } catch (error) {
      console.error('Erro ao buscar reuniões:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const customDatesStyles = (date: any) => {
    const d = new Date(date);
    const dateKey = d.toISOString().split('T')[0];

    const isSelected = selectedDate && d.toDateString() === selectedDate.toDateString();
    const isToday = d.toDateString() === new Date().toDateString();
    const hasEvent = !!eventsByDay[dateKey];

    const circleSize = 32;

    const baseContainer = {
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
    };

    if (isSelected) {
      return {
        containerStyle: { ...baseContainer, backgroundColor: '#1E3070' },
        textStyle: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
      };
    }

    if (isToday) {
      return {
        containerStyle: { ...baseContainer, borderWidth: 1, borderColor: '#1E3070' },
        textStyle: { color: '#1E3070', fontWeight: 'bold', fontSize: 16 },
      };
    }

    if (hasEvent) {
      return {
        containerStyle: { ...baseContainer, backgroundColor: '#F3E8FF' },
        textStyle: { color: '#7C3AED', fontWeight: 'bold', fontSize: 16 },
      };
    }

    return {
      containerStyle: { ...baseContainer },
      textStyle: { fontSize: 16 },
    };
  };

  const handleCreateSave = async (data: EventFormData) => {
    try {
      const storedUserId = await AsyncStorage.getItem('userId');
      const publisherId = FALLBACK_PUBLISHER_ID;

      let formattedDate = '';
      if (data.fullDate) {
        const [day, month, year] = data.fullDate.split('/');
        formattedDate = `${year}-${month}-${day}`;
      } else {
        formattedDate = new Date().toISOString().split('T')[0];
      }

      const formattedTime = data.time.length === 5 ? `${data.time}:00` : data.time;

      const payload = {
        name: data.title,
        meetingDate: formattedDate,
        meetingTime: formattedTime,
        location: data.location,
        description: data.description,
        publisherId: publisherId,
        condominiumId: CONDOMINIUM_ID,
        participantIds: [],
      };

      await createMeeting(payload);
      Alert.alert('Sucesso', 'Reunião agendada!');
      setShowCreateModal(false);
      fetchMeetings();
    } catch (error: any) {
      console.error('Erro ao criar reunião:', error.response?.data || error);
      Alert.alert('Erro', 'Não foi possível criar a reunião.');
    }
  };

  const dateKey = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const events = dateKey ? eventsByDay[dateKey] || [] : [];

  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-2" contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Header */}
        <View className="mb-2 w-full flex-row items-center justify-between">
          <View className="w-full flex-row items-center justify-between px-4">
            <View className="items-center">
              <TouchableOpacity
                onPress={() => router.push('/')}
                className="ml-1 p-2"></TouchableOpacity>
              <Text className="mb-1 text-3xl font-bold text-[#283B7D]">Reuniões</Text>
            </View>

            <View className="flex-row items-center gap-2">
              <TouchableOpacity onPress={fetchMeetings} className="p-2">
                <RefreshCw size={20} color="#283B7D" />
              </TouchableOpacity>
              <View style={{ width: 8 }} />
              {isAdmin && (
                <TouchableOpacity
                  onPress={() => setShowCreateModal(true)}
                  className="h-10 w-10 items-center justify-center rounded-full bg-[#1E3070]"
                  activeOpacity={0.8}>
                  <Plus color="#fff" size={18} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Calendar */}
        <View className="mx-4 mt-4 rounded-xl bg-white px-2 py-2 shadow">
          {loading && <ActivityIndicator size="small" color="#1E3070" className="mb-2" />}

          <CalendarPicker
            ref={calendarRef}
            onDateChange={(date: any) => setSelectedDate(new Date(date))}
            onMonthChange={(date: any) => setSelectedDate(new Date(date))}
            selectedDayColor="transparent"
            selectedDayTextColor="#000000"
            todayBackgroundColor="transparent"
            customDatesStyles={customDatesStyles}
            width={screenWidth - 156}
            previousComponent={<ChevronLeft size={24} color="#283B7D" />}
            nextComponent={<ChevronRight size={24} color="#283B7D" />}
            weekdays={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']}
            months={[
              'Janeiro',
              'Fevereiro',
              'Março',
              'Abril',
              'Maio',
              'Junho',
              'Julho',
              'Agosto',
              'Setembro',
              'Outubro',
              'Novembro',
              'Dezembro',
            ]}
            textStyle={{
              fontFamily: 'System',
              color: '#131E46',
              fontSize: 16,
            }}
            dayLabelsWrapper={{
              borderTopWidth: 0,
              borderBottomWidth: 0,
              paddingHorizontal: 0,
            }}
            headerWrapperStyle={{
              paddingHorizontal: 0,
            }}
            monthTitleStyle={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#283B7D',
            }}
            yearTitleStyle={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#283B7D',
            }}
            dayOfWeekStyles={{
              0: { color: '#131E46', fontSize: 14, fontWeight: '600' }, // Dom
              1: { color: '#131E46', fontSize: 14, fontWeight: '600' }, // Seg
              2: { color: '#131E46', fontSize: 14, fontWeight: '600' }, // Ter
              3: { color: '#131E46', fontSize: 14, fontWeight: '600' }, // Qua
              4: { color: '#131E46', fontSize: 14, fontWeight: '600' }, // Qui
              5: { color: '#131E46', fontSize: 14, fontWeight: '600' }, // Sex
              6: { color: '#131E46', fontSize: 14, fontWeight: '600' }, // Sab
            }}
            minDate={null}
            maxDate={null}
            initialDate={selectedDate || new Date()}
            startFromMonday={false}
          />

          {/* Legenda */}
          <View className="mt-4 flex-row justify-center gap-4">
            <View className="flex-row items-center">
              <View className="mr-2 h-3 w-3 rounded-full bg-[#1E3070]" />
              <Text className="text-xs text-gray-500">Selecionado</Text>
            </View>
            <View className="flex-row items-center">
              <View className="mr-2 h-3 w-3 rounded-full bg-[#7C3AED]" />
              <Text className="text-xs text-gray-500">Com Reunião</Text>
            </View>
          </View>
        </View>

        {/* Agenda do dia */}
        <View className="mt-6 px-6">
          <Text className="mb-4 text-lg font-bold text-[#131E46]">
            {selectedDate
              ? selectedDate.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                })
              : 'Selecione um dia'}
          </Text>

          {events.length === 0 ? (
            <Text className="italic text-gray-400">Nenhuma reunião agendada para este dia.</Text>
          ) : (
            events.map((ev: EventType) => (
              <TouchableOpacity
                key={ev.id}
                onPress={() => {
                  setSelectedEvent(ev);
                  setOpenModal(true);
                }}
                className="mb-3 rounded-xl border-l-4 border-[#7C3AED] bg-white p-4 shadow">
                <View className="mb-1 flex-row items-center justify-between">
                  <Text className="mr-2 flex-1 text-lg font-bold text-[#131E46]">{ev.title}</Text>
                  <Text className="rounded-full bg-[#E7D0FF] px-3 py-1 text-xs font-bold text-[#341347]">
                    {ev.time}
                  </Text>
                </View>

                <Text className="mb-1 text-gray-600" numberOfLines={2}>
                  {ev.description}
                </Text>
                <Text className="text-xs text-gray-400">📍 {ev.location}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        <EventModal visible={openModal} event={selectedEvent} onClose={() => setOpenModal(false)} />

        <EventCreateModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateSave}
          initialData={null}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
