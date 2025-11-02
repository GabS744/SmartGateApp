import '../../global.css';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">Pagina Home!</Text>
      <Link href={"user/index"}> Ir para tela de Profile</Link>
    </View>
  );
}
