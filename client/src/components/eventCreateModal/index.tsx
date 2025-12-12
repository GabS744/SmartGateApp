import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { X, Check, Plus, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from '../InputField';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type EventFormData = {
  name: string;
  meetingDate: string; 
  meetingTime: string;
  location: string;
  description: string;
  participantIds: string[];
  publisherId: string;
  condominiumId: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => void;
  initialData?: any | null;
};

export default function EventCreateModal({ visible, onClose, onSave, initialData }: Props) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [time, setTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [location, setLocation] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createdBy, setCreatedBy] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!visible) return;

    if (initialData) {
      setTitle(initialData.title || '');
      setLocation(initialData.location || '');
      setCreatedBy(initialData.createdBy || '');
      setDescription(initialData.description || '');
      
      if (initialData.time) {
        const [hours, minutes] = initialData.time.split(':').map(Number);
        const timeDate = new Date();
        timeDate.setHours(hours, minutes, 0, 0);
        setTime(timeDate);
      } else {
        setTime(null);
      }

      if (initialData.fullDate) {
        const [year, month, day] = initialData.fullDate.split('-').map(Number);
        setDate(new Date(year, month - 1, day));
      }
    } else {
      setTitle('');
      setDate(null);
      setTime(null);
      setLocation('');
      setCreatedBy('');
      setDescription('');
    }
  }, [visible, initialData]);

  const validate = () => {
    if (!title.trim()) return "Título é obrigatório.";
    if (!date) return "Data é obrigatória.";
    if (!time) return "Hora é obrigatória.";
    if (!location.trim()) return "Local é obrigatório.";
    if (!description.trim()) return "Descrição é obrigatória.";

    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      Alert.alert("Erro", err);
      return;
    }

    let publisherId = await AsyncStorage.getItem('idPerson');
    let condominiumId = await AsyncStorage.getItem('idCondominium');
    const token = await AsyncStorage.getItem('token');

    console.log('=== DEBUG CREATE MEETING ===');
    console.log('publisherId:', publisherId);
    console.log('condominiumId:', condominiumId);
    console.log('token exists:', !!token);

    // Fallback: use default condominium ID if not found
    if (!condominiumId) {
      condominiumId = 'e2071683-1463-42a0-9343-41d655474305';
      console.log('Using fallback condominiumId');
    }

    // Check if publisherId exists
    if (!publisherId) {
      Alert.alert("Erro", "ID do usuário não encontrado. Por favor, faça login novamente.");
      return;
    }

    const yyyy = date!.getFullYear();
    const mm = String(date!.getMonth() + 1).padStart(2, "0");
    const dd = String(date!.getDate()).padStart(2, "0");

    const hours = String(time!.getHours()).padStart(2, "0");
    const minutes = String(time!.getMinutes()).padStart(2, "0");

    const data: EventFormData = {
      publisherId,
      condominiumId,
      name: title.trim(),
      meetingDate: `${yyyy}-${mm}-${dd}`,
      meetingTime: `${hours}:${minutes}`,
      location: location.trim(),
      description: description.trim(),
      participantIds: [],
    };

    console.log('Data being sent:', JSON.stringify(data, null, 2));

    onSave(data);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="bg-white w-full rounded-xl p-5">

          {/* HEADER */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="mb-1 text-2xl font-bold text-[#283B7D]">
              {initialData ? "Editar Evento" : "Adicionar Evento"}
            </Text>

            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#131E46" />
            </TouchableOpacity>
          </View>

          {/* FORM */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>

            {/* Title */}
            <View className="mb-4">
              <Text className="font-bold text-[#131E46] mb-1">Título *</Text>
              <InputField
                bgColor="white"
                placeholder="Título do evento"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            {/* Date */}
            <View className="mb-4">
              <Text className="font-bold text-[#131E46] mb-1">Data *</Text>

              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="px-3 py-3 border border-[#283B7D] rounded-lg flex-row items-center gap-2 bg-white"
              >
                <Calendar size={16} color="#131E46" />
                <Text style={{ color: date ? '#131E46' : '#9CA3AF' }}>
                  {date ? date.toLocaleDateString("pt-BR") : "Selecionar data"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={(event, selected) => {
                    setShowDatePicker(false);
                    if (selected) setDate(selected);
                  }}
                />
              )}
            </View>

            {/* Time */}
            <View className="mb-4">
              <Text className="font-bold text-[#131E46] mb-1">Hora *</Text>

              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                className="px-3 py-3 border border-[#283B7D] rounded-lg flex-row items-center gap-2 bg-white"
              >
                <Text style={{ color: time ? '#131E46' : '#9CA3AF' }}>
                  {time 
                    ? `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`
                    : "__:__"}
                </Text>
              </TouchableOpacity>

              {showTimePicker && (
                <DateTimePicker
                  value={time || new Date()}
                  mode="time"
                  is24Hour={true}
                  display="spinner"
                  onChange={(event, selected) => {
                    setShowTimePicker(false);
                    if (selected) setTime(selected);
                  }}
                />
              )}
            </View>

            {/* Location */}
            <View className="mb-4">
              <Text className="font-bold text-[#131E46] mb-1">Local *</Text>
              <InputField
                bgColor="white"
                placeholder="Local do evento"
                value={location}
                onChangeText={setLocation}
              />
            </View>

            {/* Description */}
            <View className="mb-4">
              <Text className="font-bold text-[#131E46] mb-1">Descrição *</Text>
              <InputField
                bgColor="white"
                placeholder="Descrição"
                value={description}
                multiline
                numberOfLines={4}
                onChangeText={setDescription}
              />
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              className="w-full flex-row items-center justify-center rounded-lg bg-[#131E46] py-3"
            >
              {initialData ? (
                <Check size={18} color="#FFF" />
              ) : (
                <Plus size={18} color="#FFF" />
              )}
              <Text className="ml-2 text-lg font-bold text-white">
                {initialData ? "Salvar" : "Adicionar"}
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
