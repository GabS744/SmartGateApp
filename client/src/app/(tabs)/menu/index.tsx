import '../../../../global.css';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  User,
  Bell,
  Car,
  CalendarDays,
  Calendar,
  HandCoins,
  UserStar,
  MessageCircleQuestionMark,
} from 'lucide-react-native';

import RoundIconBtn from '@/components/RoundIconBtn';
import InfoCard from '@/components/InfoCard';

export default function Menu() {
  const { name } = useLocalSearchParams();
  const router = useRouter();
  return (
    <View className="flex-1 bg-[#EFF0FB]">
      <View className="h-1/5 w-full bg-[#131E46]">
        <SafeAreaView className="flex-1 justify-center">
          <View className="flex-row items-center justify-between px-6">
            <View className="flex-row items-center">
              <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-[#1E3070]">
                <User color="#FFFFFF" size={24} />
              </View>
              <View className="ml-4">
                <Text className="text-xl font-bold text-white">Olá {name || 'Usuario'}</Text>
                <Text className="text-xs text-gray-300">Apto 102</Text>
              </View>
            </View>
            <View>
              <Bell color="#FFFFFF" size={24} />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingTop: 40, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <View className="mb-4 h-28 w-full">
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={true}
            contentContainerStyle={{ paddingHorizontal: 24, gap: 20 }}>
            <RoundIconBtn
              icon={UserStar}
              label="Visitante"
              onPress={() => router.push('convidados')}
            />
            <RoundIconBtn 
              icon={Car} 
              label="Veículos" 
              onPress={() =>  router.push('/vehicle/page')} />
            <RoundIconBtn icon={CalendarDays} label="Eventos" />
            <RoundIconBtn icon={MessageCircleQuestionMark} label="Suporte" />
          </ScrollView>
        </View>
        <InfoCard icon={Calendar} title="Eventos Próximos" route="/events">
          <Text className="mt-2 text-gray-500">Nenhum evento hoje.</Text>
        </InfoCard>

        <InfoCard icon={HandCoins} title="Gastos do Condomínio" route="/expenses">
          <Text className="mt-2 text-gray-500">Fatura atual: R$ 450,00</Text>
        </InfoCard>
      </ScrollView>
    </View>
  );
}
