import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { X, Check, Plus, Calendar } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from '../InputField';

export type EventFormData = {
  name: string;
  meetingDate: string; 
  meetingTime: string;
  location: string;
  description: string;
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
  const [time, setTime] = useState('');
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
      setTime(initialData.time || '');

      if (initialData.fullDate) {
        const [year, month, day] = initialData.fullDate.split('-').map(Number);
        setDate(new Date(year, month - 1, day));
      }
    } else {
      setTitle('');
      setDate(null);
      setTime('');
      setLocation('');
      setCreatedBy('');
      setDescription('');
    }
  }, [visible, initialData]);

  const validate = () => {
    if (!title.trim()) return "Título é obrigatório.";
    if (!date) return "Data é obrigatória.";
    if (!time.trim()) return "Hora é obrigatória.";
    if (!location.trim()) return "Local é obrigatório.";
    if (!description.trim()) return "Descrição é obrigatória.";

    return null;
  };

  const handleSave = () => {
    const err = validate();
    if (err) {
      Alert.alert("Erro", err);
      return;
    }

    const yyyy = date!.getFullYear();
    const mm = String(date!.getMonth() + 1).padStart(2, "0");
    const dd = String(date!.getDate()).padStart(2, "0");

    const data: EventFormData = {
      name: title.trim(),
      meetingDate: `${yyyy}-${mm}-${dd}`,
      meetingTime: time.trim(),
      location: location.trim(),
      description: description.trim(),
    };

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
                <Text>
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
              <InputField
                bgColor="white"
                placeholder="__:__"
                value={time}
                onChangeText={setTime}
                keyboardType="numeric"
              />
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
