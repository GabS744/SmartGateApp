import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ProfileSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function ProfileSection({ title, children }: ProfileSectionProps) {

  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View className="mb-4 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

      <TouchableOpacity
        className="flex-row items-center justify-between p-4"
        onPress={toggleOpen}
        activeOpacity={0.7}>
        <Text className="text-lg font-bold text-[#131E46]">{title}</Text>


        {isOpen ? (
          <ChevronUp size={20} color="#131E46" />
        ) : (
          <ChevronDown size={20} color="#131E46" />
        )}
      </TouchableOpacity>


      {isOpen && (

        <View className="border-t border-gray-100 px-4 pb-4 pt-2">{children}</View>
      )}
    </View>
  );
}
