import '../../../global.css';
import { View, Text } from 'react-native';
import InputField from '@/components/InputField';
import { Link, useRouter } from 'expo-router';
import Button from '@/components/Button';
import Shape from '@/components/svgs/Shape';
import { useState } from 'react';
import { login } from '@/services/api';
import { Mail, Lock } from 'lucide-react-native';

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
<<<<<<< HEAD
      router.replace('/menu');
    } catch {
      alert('Erro ao fazer login. Verifique suas credenciais e tente novamente.');
=======

      router.replace('/menu');
    } catch (error: any) {
      alert(error.message || 'Erro ao fazer login.');
>>>>>>> f9cdd4bc7b0d470971608a28929d07e1b01ce047
    } finally {
      setIsLoading(false);
    }
  };

  const iconColor = '#283B7D';

  return (
<<<<<<< HEAD
    <View style={{ flex: 1, backgroundColor: '#F2F3FB' }}>
      <Shape height={220} width="100%" />
=======
    <SafeAreaView className="flex-1 items-center bg-[#F2F3FB]">
      <Shape height={240} width="100%">
        <Text>teste</Text>
      </Shape>
      <View className="w-96 items-center">
        <Text className="p-8 text-5xl font-bold">Login</Text>
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
      </View>
      <View className="w-96 items-end">
        <Link href="/recover-password">
          <Text className="text-lg font-semibold underline">Esqueceu a senha?</Text>
        </Link>
      </View>
      <View className="p-16">
        <Button
          title={isLoading ? 'Entrando...' : 'Entrar'}
          className="mt-4 w-96"
          noUnderline={true}
          onPress={handleLogin}
          disabled={isLoading}></Button>
>>>>>>> f9cdd4bc7b0d470971608a28929d07e1b01ce047

      {/* alinhar conteúdo ao topo para evitar deslocamento para baixo em telas pequenas */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 16, paddingTop: 20 }}>
        <Text style={{ padding: 8, fontSize: 34, fontWeight: '700' }}>Login</Text>
        <View style={{ width: '100%', maxWidth: 520 }}>
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

          <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
            <Link href="/recover-password">
              <Text className="text-lg font-semibold underline">Esqueceu a senha?</Text>
            </Link>
          </View>

          <Button
            title={isLoading ? 'Entrando...' : 'Entrar'}
            className="mt-4 w-full"
            noUnderline={true}
            onPress={handleLogin}
            disabled={isLoading}
          />

          <Button
            title="Cadastrar-se"
            className="mt-4 w-full border-2 bg-[#FFFFFF]"
            textClassName="text-[#131E46]"
            noUnderline={true}
            disabled={isLoading}
            onPress={() => router.push('/register')}
          />
        </View>
      </View>
    </View>
  );
}