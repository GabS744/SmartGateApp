import '../../global.css';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { Link, useRouter } from 'expo-router'; 

export default function Home() {
  const router = useRouter(); 


  const handleLoginPress = () => {

    router.push('/login');
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-[#CBD0F2]">
      <View className="items-center pt-16">
        <Text className="font-regular p-1 text-xl">Bem vindo(a) ao</Text>
        <Text className="text-5xl font-bold">Smart Gate</Text>
      </View>
      <Image
        source={require('../../assets/pictureHome.png')}
        className="mb-4 h-3/5 w-full"
        resizeMode="contain"
      />
      <View className="items-center">
        <Button className="mt-4 w-96" title="Entrar" onPress={handleLoginPress} />

        <View className="flex-row p-4">
          <Text className="text-lg font-semibold">Não tem cadastro? </Text>
          <Link href="/register">
            <Text className="text-lg font-semibold underline">Clique aqui</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
