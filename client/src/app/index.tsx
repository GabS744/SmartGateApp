import '../../global.css';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <Text className="text-xl font-bold text-red-800">Pagina Home!</Text>
      <Link href={"./user"}> Ir para tela de Profile</Link>
    </View>
  );
}
