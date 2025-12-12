import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { X, Check } from 'lucide-react-native';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectModalProps {
  visible: boolean;
  title: string;
  options: SelectOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}

export default function SelectModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
}: SelectModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-black/50">
        <View className="flex-1 justify-end">
          <View className="h-[60%] w-full rounded-t-3xl bg-[#F2F3FB] p-6">
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-[#131E46]">{title}</Text>
              <TouchableOpacity
                onPress={onClose}
                className="rounded-full bg-white p-2"
              >
                <X size={24} color="#131E46" />
              </TouchableOpacity>
            </View>

            {/* Options */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    onSelect(option.value);
                    onClose();
                  }}
                  className="mb-3 flex-row items-center justify-between rounded-lg border-2 bg-white p-4"
                  style={{
                    borderColor:
                      selectedValue === option.value ? '#283B7D' : '#E5E7EB',
                  }}
                >
                  <View className="flex-1">
                    <Text
                      className={`text-lg font-semibold ${
                        selectedValue === option.value
                          ? 'text-[#283B7D]'
                          : 'text-[#131E46]'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </View>

                  {selectedValue === option.value && (
                    <View className="ml-3 rounded-full bg-[#283B7D] p-2">
                      <Check size={20} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
