import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { X, Calendar, Clock, MapPin, AlignLeft, Check } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export interface EventFormData {
  title: string;
  fullDate: string;
  time: string;
  location: string;
  description: string;
}

interface EventCreateModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => void;
  initialData?: any;
}

export default function EventCreateModal({
  visible,
  onClose,
  onSave,
  initialData,
}: EventCreateModalProps) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const [dateObj, setDateObj] = useState<Date>(new Date());
  const [timeObj, setTimeObj] = useState<Date>(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title || '');
        setLocation(initialData.location || '');
        setDescription(initialData.description || '');
        setDateObj(new Date());
        setTimeObj(new Date());
      } else {
        setTitle('');
        setLocation('');
        setDescription('');
        setDateObj(new Date());
        setTimeObj(new Date());
      }
    }
  }, [visible, initialData]);

  const handleSave = () => {
    if (!title.trim() || !location.trim()) {
      Alert.alert('Erro', 'Por favor preencha o Título e o Local.');
      return;
    }

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    const hours = String(timeObj.getHours()).padStart(2, '0');
    const minutes = String(timeObj.getMinutes()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    onSave({
      title,
      fullDate: formattedDate,
      time: formattedTime,
      location,
      description,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="h-[85%] w-full rounded-t-3xl bg-[#F2F3FB]">
          <View className="flex-row items-center justify-between rounded-t-3xl border-b border-gray-200 bg-white p-6">
            <Text className="text-xl font-bold text-[#283B7D]">Nova Reunião</Text>
            <TouchableOpacity onPress={onClose} className="rounded-full bg-gray-100 p-2">
              <X size={20} color="#131E46" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
            <View className="mb-4">
              <Text className="mb-2 ml-1 font-bold text-[#131E46]">Título da Reunião</Text>
              <TextInput
                className="rounded-xl border border-gray-200 bg-white p-4 text-[#131E46]"
                placeholder="Ex: Assembleia Geral"
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View className="mb-4 flex-row gap-4">
              <View className="flex-1">
                <Text className="mb-2 ml-1 font-bold text-[#131E46]">Data</Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="flex-row items-center gap-2 rounded-xl border border-gray-200 bg-white p-4">
                  <Calendar size={20} color="#283B7D" />
                  <Text className="text-[#131E46]">{dateObj.toLocaleDateString('pt-BR')}</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-1">
                <Text className="mb-2 ml-1 font-bold text-[#131E46]">Horário</Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  className="flex-row items-center gap-2 rounded-xl border border-gray-200 bg-white p-4">
                  <Clock size={20} color="#283B7D" />
                  <Text className="text-[#131E46]">
                    {`${String(timeObj.getHours()).padStart(2, '0')}:${String(timeObj.getMinutes()).padStart(2, '0')}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={dateObj}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) setDateObj(selectedDate);
                }}
              />
            )}

            {showTimePicker && (
              <DateTimePicker
                value={timeObj}
                mode="time"
                is24Hour={true}
                display="spinner"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) setTimeObj(selectedTime);
                }}
              />
            )}

            <View className="mb-4">
              <Text className="mb-2 ml-1 font-bold text-[#131E46]">Local</Text>
              <View className="flex-row items-center rounded-xl border border-gray-200 bg-white px-4">
                <MapPin size={20} color="#9CA3AF" />
                <TextInput
                  className="flex-1 p-4 text-[#131E46]"
                  placeholder="Ex: Salão de Festas"
                  placeholderTextColor="#9CA3AF"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            <View className="mb-6">
              <Text className="mb-2 ml-1 font-bold text-[#131E46]">Descrição / Pauta</Text>
              <View className="flex-row items-start rounded-xl border border-gray-200 bg-white px-4 py-2">
                <AlignLeft size={20} color="#9CA3AF" style={{ marginTop: 12 }} />
                <TextInput
                  className="h-24 flex-1 p-2 text-[#131E46]"
                  placeholder="Detalhes da reunião..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSave}
              className="mb-10 w-full flex-row items-center justify-center rounded-xl bg-[#283B7D] py-4 shadow-sm">
              <Check size={20} color="#FFF" />
              <Text className="ml-2 text-lg font-bold text-white">Agendar Reunião</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
