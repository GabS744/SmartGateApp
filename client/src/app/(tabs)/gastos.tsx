import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Gastos() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#F2F3FB]">
      <Text className="text-2xl font-bold text-[#131E46]">Tela de Gastos</Text>
    </SafeAreaView>
  );
}
