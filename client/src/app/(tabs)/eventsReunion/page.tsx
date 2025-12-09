import { useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import EventModal from "@/components/EventModal";
import CalendarPicker from 'react-native-calendar-picker';

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

  function parseLocalDate(dateString: string) {
    const [y, m, d] = dateString.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const calendarRef = useRef<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const eventsByDay: Record<string, EventType[]> = {
    "2025-12-01": [
      {
        id: 1,
        title: "Multas",
        time: "15:00",
        fullDate: "Segunda-feira, 01 de dezembro de 2025",
        location: "Salão de Festas - Bloco A",
        createdBy: "Síndico João Silva",
        description: "Reunião para discussão sobre novas regras de multas do condomínio.",
      },
    ],
    "2025-12-02": [
      {
        id: 2,
        title: "Assembleia Geral",
        time: "19:30",
        fullDate: "Terça-feira, 02 de dezembro de 2025",
        location: "Auditório",
        createdBy: "Síndico João Silva",
        description: "Discussão sobre orçamento anual.",
      },
    ],
  };

  const dateKey = selectedDate ? selectedDate.toISOString().split("T")[0] : "";
  const events = dateKey ? eventsByDay[dateKey] || [] : [];

  const eventDateStrings = Object.keys(eventsByDay);

  const customDatesStyles = eventDateStrings.map((d) => {
  const date = parseLocalDate(d);

  const isSelected =
    selectedDate &&
    date.toDateString() === selectedDate.toDateString();

  const isToday = new Date().toDateString() === date.toDateString();

  if (isSelected) {
    // mantém azul do calendarPicker
    return {
      date,
      containerStyle: {},
      textStyle: {},
    };
  }

  if (isToday) {
    // dia de hoje: deixa o círculo branco mas texto escuro
    return {
      date,
      containerStyle: {
        backgroundColor: "#FFFFFF",
      },
      textStyle: {
        color: "#1E3070",
        fontWeight: "600",
      },
    };
  }

  // dias com evento → roxo
  return {
    date,
    containerStyle: {
      backgroundColor: "#7C3AED",
      borderRadius: 20, // garante que seja círculo perfeito
      padding: 5,       // mantém o padding interno
    },
    textStyle: {
      color: "#fff",
      fontWeight: "600",
    },
  };
});


  return (
    <ScrollView className="flex-1 p-2 bg-white" contentContainerStyle={{ paddingBottom: 140 }}>
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
          selectedDayColor="#1E3070"           // azul do dia selecionado
          selectedDayTextColor="#ffffff"
          todayBackgroundColor="#FFFFFF"
          customDatesStyles={customDatesStyles} // círculos roxos nos dias com evento
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
          {selectedDate && events.length > 0 ? events[0].fullDate : "Nenhum evento para este dia"}
        </Text>

        {events.map((ev: EventType) => (
          <TouchableOpacity
            key={ev.id}
            onPress={() => {
              setSelectedEvent(ev);
              setOpenModal(true);
            }}
            className="bg-white p-4 rounded-xl mb-3 shadow"
          >
            <View className="flex-row justify-between items-center mb-1">
              <Text className="font-bold text-[#131E46]">{ev.title}</Text>
              <Text className="bg-[#E7D0FF] px-2 py-1 rounded-full text-xs text-[#341347]">
                {ev.time}
              </Text>
            </View>

            <Text className="text-gray-600">{ev.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <EventModal
        visible={openModal}
        event={selectedEvent}
        onClose={() => setOpenModal(false)}
      />
    </ScrollView>
  );
}
