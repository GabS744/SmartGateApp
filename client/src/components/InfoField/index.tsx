import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface InfoFieldProps {
  label: string;
  value: string;
  isEditing?: boolean; 
  onChangeText?: (text: string) => void; 
  keyboardType?: 'default' | 'numeric' | 'email-address'; 
}

export default function InfoField({
  label,
  value,
  isEditing = false,
  onChangeText,
  keyboardType = 'default',
}: InfoFieldProps) {
  return (
    <View className="mb-3 w-full">
      <Text className="mb-1 text-xs font-bold text-gray-500">{label}</Text>

      <View
        className={`rounded-lg border p-3 ${isEditing ? 'border-[#131E46] bg-white' : 'border-gray-200 bg-gray-100'}`}>
        {isEditing ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            className="p-0 text-base font-medium text-[#131E46]"
            keyboardType={keyboardType}
          />
        ) : (
          <Text className="text-base font-medium text-[#131E46]">{value}</Text>
        )}
      </View>
    </View>
  );
}
