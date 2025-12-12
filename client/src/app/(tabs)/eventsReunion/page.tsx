import { useState, useRef, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react-native';
import EventModal from "@/components/EventModal";
import CalendarPicker from 'react-native-calendar-picker';
import EventCreateModal, { EventFormData } from '@/components/eventCreateModal';
import { getAllMeetings, createMeeting } from '@/services/api';

type EventType = {
  id: number | string;
  title: string;
  time: string;
  fullDate: string;
  location: string;
  createdBy: string;
  description: string;
};


export default function EventsPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const calendarRef = useRef<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [eventsByDay, setEventsByDay] = useState<Record<string, EventType[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        setLoading(true);
        const meetingsData = await getAllMeetings();
        const grouped: Record<string, EventType[]> = {};
        
        meetingsData.forEach((meeting: any) => {
          const dateKey = meeting.meetingDate || new Date().toISOString().split('T')[0];
          if (!grouped[dateKey]) {
            grouped[dateKey] = [];
          }
          grouped[dateKey].push({
            id: meeting.id,
            title: meeting.title,
            time: meeting.meetingTime || '00:00',
            fullDate: meeting.meetingDate || '',
            location: meeting.location || 'Condomínio',
            createdBy: meeting.createdBy || 'Admin',
            description: meeting.description || '',
          });
        });
        
        setEventsByDay(grouped);
      } catch (error) {
        console.log('Erro ao carregar eventos:', error);
        setEventsByDay({});
      } finally {
        setLoading(false);
      }
    };
    
    loadMeetings();
  }, []);

  const dateKey = selectedDate.toISOString().split("T")[0];
  const events = eventsByDay[dateKey] || [];

  const eventDateStrings = Object.keys(eventsByDay);

  const customDatesStyles = eventDateStrings.map((dateStr) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);

    const isSelected = dateKey === dateStr;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = date.toDateString() === today.toDateString();

    const circleSize = 32;
    const circleStyle = {
      width: circleSize,
      height: circleSize,
      borderRadius: circleSize / 2,
      alignItems: 'center',
      justifyContent: 'center',
    } as any;

    if (isSelected) {
      return {
        date,
        containerStyle: {
          ...circleStyle,
          backgroundColor: '#131E46',
        },
        textStyle: { color: '#ffffff', fontWeight: '700' },
      };
    }

    if (isToday) {
      return {
        date,
        containerStyle: {
          ...circleStyle,
          backgroundColor: '#E5E7EB',
        },
        textStyle: { color: '#131E46', fontWeight: '700' },
      };
    }

    return {
      date,
      containerStyle: {
        ...circleStyle,
        backgroundColor: '#283B7D',
      },
      textStyle: { color: '#fff', fontWeight: '600' },
    };
  });

  const handleCreateSave = async (data: EventFormData) => {
    try {
      const [d, m, y] = (data.fullDate || '').split('/').map(Number);
      const dateKey = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

      await createMeeting({
        title: data.title,
        meetingDate: dateKey,
        meetingTime: data.time,
        location: data.location,
        description: data.description,
      });

      const updatedMeetings = await getAllMeetings();
      const grouped: Record<string, EventType[]> = {};
      
      updatedMeetings.forEach((meeting: any) => {
        const key = meeting.meetingDate || new Date().toISOString().split('T')[0];
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push({
          id: meeting.id,
          title: meeting.title,
          time: meeting.meetingTime || '00:00',
          fullDate: meeting.meetingDate || '',
          location: meeting.location || 'Condomínio',
          createdBy: meeting.createdBy || 'Admin',
          description: meeting.description || '',
        });
      });
      
      setEventsByDay(grouped);
      setShowCreateModal(false);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao criar evento');
      console.log('Erro ao criar evento:', error);
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-2" contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Header */}
        <View className="mb-2 w-full flex-row items-center justify-between">
          <View className="flex-row items-center justify-between w-full px-4">
            <View className="items-center">
              <TouchableOpacity
                onPress={() => router.push('/')}
                className="p-2 ml-1"
            >
              {/* Aqui você pode colocar um ícone de voltar */}
            </TouchableOpacity>
            <Text className="mb-1 text-3xl font-bold text-[#283B7D]">Reuniões</Text>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => calendarRef.current?.handleOnPressNext()}
              className="p-2 mr-1"
            >
              {/* Ícone de próximo */}
            </TouchableOpacity>
            <View style={{ width: 8 }} />
            <TouchableOpacity
              onPress={() => setShowCreateModal(true)}
              className="h-10 w-10 rounded-full bg-[#131E46] items-center justify-center"
              activeOpacity={0.8}
            >
              <Plus color="#fff" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Calendar */}
      <View className="mx-4 mt-4 bg-white rounded-xl p-3 shadow">
        <CalendarPicker
          ref={calendarRef}
          selectedStartDate={selectedDate}
          onDateChange={(date: any) => setSelectedDate(date)}
          onMonthChange={(date: any) => setSelectedDate(date)}
          selectedDayColor="#131E46"
          selectedDayTextColor="#ffffff"
          todayBackgroundColor="#E5E7EB"
          customDatesStyles={customDatesStyles}
          scaleFactor={375}
          width={Dimensions.get('window').width - 32}
          previousComponent={<ChevronLeft size={16} color="#283B7D" />}
          nextComponent={<ChevronRight size={16} color="#283B7D" />}
          weekdays={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']}
          months={[
            'Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
          ]}
        />
      </View>

      {/* Agenda do dia */}
      <View className="px-6 mt-6">
        <Text className="text-lg font-bold mb-4">
          {loading ? "Carregando eventos..." : selectedDate ? selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Nenhum evento"}
        </Text>

        {!loading && events.length > 0 ? (
          events.map((ev: EventType) => (
            <TouchableOpacity
              key={ev.id}
              onPress={() => {
                setSelectedEvent(ev);
                setOpenModal(true);
              }}
              className="bg-white p-4 rounded-xl mb-3 shadow border border-[#283B7D]"
            >
              <View className="flex-row justify-between items-center mb-1">
                <Text className="font-bold text-[#131E46]">{ev.title}</Text>
                <Text className="bg-[#E5E7EB] px-2 py-1 rounded-full text-xs text-[#131E46]">
                  {ev.time}
                </Text>
              </View>

              <Text className="text-gray-600 text-sm mb-1">{ev.location}</Text>
              <Text className="text-gray-600 text-xs">{ev.description}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text className="mt-2 text-center text-gray-500">
            {loading ? "Carregando..." : "Nenhum evento para este dia"}
          </Text>
        )}
      </View>

        <EventModal
          visible={openModal}
          event={selectedEvent}
          onClose={() => setOpenModal(false)}
        />
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
