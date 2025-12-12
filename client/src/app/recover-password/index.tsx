import '../../../global.css';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecoverPassword() {
  return (
    <SafeAreaView className="flex-1 items-center bg-[#F2F3FB]">
      <View className="items-center pt-16">
        <Text>Tela de Recuperação de senha</Text>
      </View>
    </SafeAreaView>
  );
}
