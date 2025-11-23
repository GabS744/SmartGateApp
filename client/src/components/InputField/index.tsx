import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, type TextInputProps } from 'react-native';

type InputFieldType = 'text' | 'email' | 'password' | 'number' | 'date';

interface InputFieldProps extends TextInputProps {
  label?: string;
  type?: InputFieldType;
  icon?: React.ReactNode;
  onPress?: () => void; 
}

const InputField = ({ label, type = 'text', icon, onPress, ...props }: InputFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const nativeProps: TextInputProps = {};

  switch (type) {
    case 'email':
      nativeProps.keyboardType = 'email-address';
      nativeProps.autoCapitalize = 'none';
      break;
    case 'password':
      nativeProps.secureTextEntry = true;
      nativeProps.autoCapitalize = 'none';
      break;
    case 'number':
      nativeProps.keyboardType = 'numeric';
      break;
    case 'date':
     
      nativeProps.showSoftInputOnFocus = false; 
      nativeProps.editable = false; 
      break;
    case 'text':
    default:
      nativeProps.keyboardType = 'default';
      break;
  }

  const renderInput = () => (
    <View
      className={`
        w-full flex-row items-center rounded-lg border-2 bg-white
        dark:bg-gray-800
        ${isFocused ? 'border-[#283B7D]' : 'border-[#283B7D]'} 
      `}>
      {icon && <View className="pl-4">{icon}</View>}

      <TextInput
        className="flex-1 p-4 text-base text-black dark:text-white"
        placeholderTextColor="#6B84A1"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...nativeProps}
        {...props}
      />
    </View>
  );

  return (
    <View className="mb-4 w-full p-1">
      {label && (
        <Text className="mb-2 text-base font-semibold text-[#131E46] dark:text-gray-300">
          {label}
        </Text>
      )}

      {type === 'date' ? (
        <Pressable onPress={onPress}>

          <View pointerEvents="none">{renderInput()}</View>
        </Pressable>
      ) : (
        renderInput()
      )}
    </View>
  );
};

export default InputField;
