import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { type LucideIcon } from 'lucide-react-native';

interface RoundIconBtnProps {
  icon: LucideIcon; 
  label: string;    
  onPress?: () => void; 
}

const RoundIconBtn = ({ icon: Icon, label, onPress }: RoundIconBtnProps) => {
  return (
    <TouchableOpacity 
      className="items-center" 
      onPress={onPress}
      activeOpacity={0.7}
    >

      <View className="h-[65px] w-[65px] items-center justify-center rounded-full bg-white">
 
        <Icon color="#283B7D" size={32} />
      </View>
      
      <Text className="text-[#283B7D] font-semibold text-xs mt-2">
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default RoundIconBtn;