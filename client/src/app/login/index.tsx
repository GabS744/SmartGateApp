import '../../../global.css';
import { View, Text } from 'react-native';
import InputField from '@/components/InputField';
import { Link, useRouter } from 'expo-router';
import Button from '@/components/Button';
import Shape from '@/components/svgs/Shape';
import { useState } from 'react';
import { login } from '@/services/api';
import { Mail, Lock, ShieldCheck } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      router.replace('/menu');
    } catch (error: any) {
      alert(error.message || 'Erro ao fazer login.');
    } finally {
      setIsLoading(false);
    }
  };

  const iconColor = '#283B7D';

  return (
    <SafeAreaView className="flex-1 bg-[#F2F3FB]">
      <KeyboardAwareScrollView
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}
        enableOnAndroid={true}
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="relative w-full items-center justify-start">
          <Shape height={280} width="100%" />
          <View className="absolute top-10 items-center">
            <View className="mb-2 h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-white/20">
              <ShieldCheck size={48} color="#FFFFFF" />
            </View>
            <Text className="text-3xl font-bold tracking-widest text-white">SmartGate</Text>
            <Text className="text-[10px] uppercase tracking-[4px] text-gray-200 opacity-80">
              Condomínio Seguro
            </Text>
          </View>
        </View>

        <View className="-mt-12 w-full items-center px-8">
          <View className="z-10 -mb-6 rounded-full border-4 border-white bg-[#F2F3FB] px-6 py-2 shadow-sm">
            <Text className="text-2xl font-bold text-[#283B7D]">Acesso</Text>
          </View>

          <View className="h-8" />

          <InputField
            placeholder="Digite seu e-mail..."
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            icon={<Mail color={iconColor} size={25} />}
          />

          <InputField
            placeholder="Digite sua senha..."
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            icon={<Lock color={iconColor} size={25} />}
          />

          <View className="mb-6 w-full items-end">
            <Link href="/recover-password">
              <Text className="text-lg font-semibold text-[#283B7D] underline">
                Esqueceu a senha?
              </Text>
            </Link>
          </View>

          <Button
            title="Entrar"
            className="mb-4 w-full"
            noUnderline={true}
            onPress={handleLogin}
            isLoading={isLoading}
          />

          <Button
            title="Cadastrar-se"
            className="w-full border-2 border-[#283B7D] bg-[#FFFFFF]"
            textClassName="text-[#283B7D]"
            noUnderline={true}
            disabled={isLoading}
            onPress={() => router.push('/register')}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
