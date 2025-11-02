import '../../global.css';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { StylizedButton } from '@/components';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <Text className="text-xl font-bold text-red-800">Pagina Home!</Text>
      <Link href={"./user"} asChild>
        <StylizedButton bottomIcon='edit' width={'100%'} >
        </StylizedButton>
      </Link>
    </View>
  );
}
