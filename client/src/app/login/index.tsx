import '../../../global.css';
import { View, Text, ScrollView } from 'react-native'; // Adicionei ScrollView para telas pequenas
import InputField from '@/components/InputField';
import { Link, useRouter } from 'expo-router';
import Button from '@/components/Button';
import Shape from '@/components/svgs/Shape';
import { useState } from 'react';
import { login } from '@/services/api';
import { Mail, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
      <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center' }}>
        {/* Cabeçalho com Shape */}
        <Shape height={240} width="100%">
          {/* Você pode colocar algo dentro do Shape se necessário, ou deixar vazio */}
        </Shape>

        <View className="-mt-10 w-full items-center px-8">
          <Text className="pb-8 text-5xl font-bold text-[#283B7D]">Login</Text>

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
            title={isLoading ? 'Entrando...' : 'Entrar'}
            className="mb-4 w-full"
            noUnderline={true}
            onPress={handleLogin}
            disabled={isLoading}
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
      </ScrollView>
    </SafeAreaView>
  );
}
