import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { type LucideIcon, ChevronRight } from 'lucide-react-native';

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  route: string;
  children?: React.ReactNode;
}

const InfoCard = ({ icon: Icon, title, route, children }: InfoCardProps) => {
  const router = useRouter();

  return (
    <View className="mb-6 h-48 w-96 rounded-lg bg-white p-4">
      <View className="mb-2 w-full flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Icon color="#283B7D" size={24} />
          <Text className="text-lg font-semibold text-[#283B7D]">{title}</Text>
        </View>

        <TouchableOpacity onPress={() => router.push(route as any)}>
          <ChevronRight color="#283B7D" size={24} />
        </TouchableOpacity>
      </View>

      <View className="flex-1">{children}</View>
    </View>
  );
};

export default InfoCard;
