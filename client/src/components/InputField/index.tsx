import React from 'react';

import { View, Text, TextInput, type TextInputProps } from 'react-native';

type InputFieldType = 'text' | 'email' | 'password' | 'number';

interface InputFieldProps extends TextInputProps {
  label?: string;
  type?: InputFieldType;
}

const InputField = ({ label, type = 'text', ...props }: InputFieldProps) => {
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
    case 'text':
    default:
      nativeProps.keyboardType = 'default';
      break;
  }

  return (
    <View className="mb-4 w-full p-1">
      {label && (
        <Text className="mb-2 text-base font-semibold text-[#131E46] dark:text-gray-300">
          {label}
        </Text>
      )}

      <TextInput
        className="
          w-full rounded-lg border-2 border-[#283B7D] bg-white p-4 
          text-base text-black 
          focus:border-[#283B7D] dark:border-gray-600 dark:bg-gray-800
          
          dark:text-white
          
        "
        placeholderTextColor="#6B84A1"
        {...nativeProps}
        {...props}
      />
    </View>
  );
};

export default InputField;
