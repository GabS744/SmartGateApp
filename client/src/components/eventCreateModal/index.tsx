import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { X, Check, Plus, Calendar, Clock, MapPin, User } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import InputField from '../InputField';

export type EventFormData = {
  title: string;
  fullDate?: string; // formatted date string (pt-BR)
  time: string;
  location: string;
  createdBy: string;
  description: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: (data: EventFormData) => void;
  initialData?: EventFormData | null;
};

export default function EventCreateModal({ visible, onClose, onSave, initialData }: Props) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [dateText, setDateText] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [description, setDescription] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setTitle(initialData.title || '');
        setTime(initialData.time || '');
        setLocation(initialData.location || '');
        setCreatedBy(initialData.createdBy || '');
        setDescription(initialData.description || '');
        if (initialData.fullDate) {
          const parts = initialData.fullDate.split('/');
          if (parts.length === 3) {
            const d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
            if (!isNaN(d.getTime())) setDate(d);
            setDateText(initialData.fullDate);
          } else {
            setDate(new Date());
            setDateText('');
          }
        } else {
          setDate(null);
          setDateText('');
        }
      } else {
        setTitle('');
        setDate(null);
        setDateText('');
        setTime('');
        setLocation('');
        setCreatedBy('');
        setDescription('');
      }
    }
  }, [visible, initialData]);

  // regex: dd/mm/yyyy (simple, years 1900-2099) and time HH:MM (00-23:00-59)
  const DATE_REGEX = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/;
  const TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  const TITLE_REGEX = /^.{3,}$/;
  const CREATED_BY_REGEX = /^[^\d]+$/; // no digits in name
  const LOCATION_REGEX = /^.{2,}$/;
  const DESCRIPTION_REGEX = /^.{5,}$/;

  const parseDateFromText = (text: string): Date | null => {
    const parts = text.split('/');
    if (parts.length !== 3) return null;
    const day = Number(parts[0]);
    const month = Number(parts[1]);
    const year = Number(parts[2]);
    const d = new Date(year, month - 1, day);
    if (isNaN(d.getTime())) return null;
    // basic sanity: formatted back should match (avoids 31/02 becoming March)
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = String(d.getFullYear());
    return dd === parts[0] && mm === parts[1] && yyyy === parts[2] ? d : null;
  };

  const validate = (): string | null => {
    if (!title.trim()) return 'Título é obrigatório.';
    if (!TITLE_REGEX.test(title.trim())) return 'Título deve ter ao menos 3 caracteres.';
    // allow either a selected date or a valid typed date
    if (!date && !dateText) return 'Data é obrigatória.';
    if (!date && dateText && !DATE_REGEX.test(dateText.trim())) return 'Data deve estar no formato DD/MM/AAAA.';
    if (!time.trim()) return 'Hora é obrigatória.';
    if (!TIME_REGEX.test(time.trim())) return 'Hora deve estar no formato HH:MM (00-23:59).';
    if (!location.trim()) return 'Local é obrigatório.';
    if (!LOCATION_REGEX.test(location.trim())) return 'Local deve ter ao menos 2 caracteres.';
    if (!createdBy.trim()) return 'Responsável é obrigatório.';
    if (!CREATED_BY_REGEX.test(createdBy.trim())) return 'Nome do responsável não pode conter números.';
    if (!description.trim()) return 'Descrição é obrigatória.';
    if (!DESCRIPTION_REGEX.test(description.trim())) return 'Descrição deve ter ao menos 5 caracteres.';

    return null;
  };

  const handleSave = () => {
    const err = validate();
    if (err) {
      Alert.alert('Erro', err);
      return;
    }

    // if user typed a valid date, prefer that
    let finalDate: Date | null = date;
    if (!finalDate && dateText) {
      const parsed = parseDateFromText(dateText.trim());
      if (parsed) finalDate = parsed;
    }
    const fullDate = finalDate ? finalDate.toLocaleDateString('pt-BR') : undefined;

    const data: EventFormData = {
      title: title.trim(),
      fullDate,
      time: time.trim(),
      location: location.trim(),
      createdBy: createdBy.trim(),
      description: description.trim(),
    };

    // Log what will be submitted
    console.log('Event form submit:', data);

    onSave(data);
    onClose();
  };

  // Format time as user types: inserts ':' after 2 digits
  const formatTimeInput = (input: string) => {
    const digits = input.replace(/[^0-9]/g, '');
    let out = digits;
    if (digits.length > 2) {
      out = digits.slice(0, 2) + ':' + digits.slice(2, 4);
    }
    if (out.length > 5) out = out.slice(0, 5);
    setTime(out);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="bg-white w-full rounded-xl p-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="mb-1 text-2xl font-bold text-[#283B7D]">{initialData ? 'Editar Evento' : 'Adicionar Evento'}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={20} color="#131E46" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
            <View className="mb-4">
              <View className="mb-1 flex-row">
                <Text className="font-bold text-[#131E46]">Título</Text>
                <Text className="text-red-500">*</Text>
              </View>
              <InputField bgColor ='white' placeholder="Título do evento" value={title} onChangeText={setTitle} />
            </View>

            <View className="mb-4">
              <View className="mb-1 flex-col justify-between">
                <View className="flex-row items-center">
                  <Text className="ml-2 font-bold text-[#131E46]">Data</Text>
                  <Text className="text-red-500">*</Text>
                </View>
              
                  <TouchableOpacity
                    onPress={() => {
                      const start = date || new Date();
                      setTempDate(start);
                      setTimeout(() => setShowDatePicker(true), 80);
                    }}
                    onPressIn={() => {
                      const start = date || new Date();
                      setTempDate(start);
                      setShowDatePicker(true);
                    }}
                    className="ml-1 mr-1 mt-2 px-2 py-2 border-[#283B7D] border rounded-lg bg-white "
                  >
                    <Calendar size={16} color="#131E46" />
                  </TouchableOpacity>
                </View>
            
            </View>

            <View className="mb-4">
              <View className="mb-1 flex-row">
                <Clock size={16} color="#131E46" />
                <Text className="ml-2 font-bold text-[#131E46]">Hora</Text>
                <Text className="text-red-500">*</Text>
              </View>
              <InputField bgColor ='white' placeholder="__:__" value={time} onChangeText={formatTimeInput} keyboardType="numeric" />
            </View>

            <View className="mb-4">
              <View className="mb-1 flex-row">
                <MapPin size={16} color="#131E46" />
                <Text className="ml-2 font-bold text-[#131E46]">Local</Text>
                <Text className="text-red-500">*</Text>
              </View>
              <InputField bgColor ='white' placeholder="Local do evento" value={location} onChangeText={setLocation} />
            </View>

            <View className="mb-4">
              <View className="mb-1 flex-row">
                <User size={16} color="#131E46" />
                <Text className="ml-2 font-bold text-[#131E46]">Responsável</Text>
                <Text className="text-red-500">*</Text>
              </View>
              <InputField bgColor ='white' placeholder="Nome do responsável" value={createdBy} onChangeText={setCreatedBy} />
            </View>

            <View className="mb-6">
              <Text className="mb-1 font-bold text-[#131E46]">Descrição</Text>
              <InputField bgColor ="white" placeholder="Descrição" value={description} onChangeText={setDescription} multiline numberOfLines={4} />
            </View>

           <TouchableOpacity
                onPress={handleSave}  
                accessibilityRole="button"
                className="w-full flex-row items-center justify-center rounded-lg bg-[#131E46] py-3"
                >
                {initialData ? <Check size={18} color="#FFF" /> : <Plus size={18} color="#FFF" />}
                <Text className="ml-2 text-lg font-bold text-white">
                    {initialData ? 'Salvar' : 'Adicionar'}
                </Text>
            </TouchableOpacity>

          </ScrollView>
        </View>

        {showDatePicker && (
          <Modal visible transparent animationType="fade">
            <View className="flex-1 bg-black/40 justify-center items-center px-6">
              <View className="bg-white w-full rounded-xl p-4">
                <Text className="text-lg font-semibold text-[#131E46] mb-2">Selecione a data</Text>
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={(_, d) => {
                    if (d) setTempDate(d);
                  }}
                />

                <View className="flex-row justify-end mt-4">
                  <TouchableOpacity
                    onPress={() => {
                      setShowDatePicker(false);
                    }}
                    className="px-4 py-2 mr-2 rounded bg-gray-200"
                  >
                    <Text>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setShowDatePicker(false);
                      setDate(tempDate);
                      const dd = String(tempDate.getDate()).padStart(2, '0');
                      const mm = String(tempDate.getMonth() + 1).padStart(2, '0');
                      const yyyy = tempDate.getFullYear();
                      setDateText(`${dd}/${mm}/${yyyy}`);
                    }}
                    className="px-4 py-2 rounded bg-[#131E46]"
                  >
                    <Text className="text-white">Manter</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        )}

      </View>
    </Modal>
  );
}
