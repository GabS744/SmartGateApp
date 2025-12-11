import '../../../global.css';
import { View, Text, Platform, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Shape from '@/components/svgs/Shape';
import InputField from '@/components/InputField';
import { User, Calendar, Mail, Lock } from 'lucide-react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '@/components/Button';
import { register } from '@/services/api';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!firstName || !lastName || !dateOfBirth || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    setIsLoading(true);
    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        dateOfBirth,
      });

      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'Ir para Login', onPress: () => router.replace('/login') },
      ]);
    } catch (error: any) {
      const mensagemErro = error.message || 'Ocorreu um erro no cadastro.';
      Alert.alert('Erro no Cadastro', mensagemErro);
    } finally {
      setIsLoading(false);
    }
  };

  const iconColor = '#283B7D';

  const toggleDatepicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = ({ type }: any, selectedDate?: Date) => {
    if (type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
      if (Platform.OS === 'android') {
        toggleDatepicker();
      }
      const formattedDate = currentDate.toLocaleDateString('pt-BR');
      setDateOfBirth(formattedDate);
    } else {
      toggleDatepicker();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F2F3FB]">
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={40}
        enableAutomaticScroll={true}>
        <Shape height={120}>
          <Text className="text-2xl font-bold text-white">Criar Conta</Text>
        </Shape>

        <Text className="p-8 text-3xl font-bold text-[#131E46]">Dados da Conta</Text>

        <View className="w-full max-w-md px-8">
          <InputField
            placeholder="Digite seu primeiro nome..."
            value={firstName}
            onChangeText={setFirstName}
            icon={<User color={iconColor} size={25} />}
          />
          <InputField
            placeholder="Digite seu Sobrenome"
            value={lastName}
            onChangeText={setLastName}
            icon={<User color={iconColor} size={25} />}
          />

          <TouchableOpacity onPress={toggleDatepicker}>
            <View pointerEvents="none">
              <InputField
                placeholder="Data de Nascimento"
                value={dateOfBirth}
                icon={<Calendar color={iconColor} size={25} />}
                editable={false}
              />
            </View>
          </TouchableOpacity>

          <InputField
            placeholder="Digite seu E-mail..."
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
          <InputField
            placeholder="Confirme sua senha..."
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            icon={<Lock color={iconColor} size={25} />}
          />

          {showPicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={date}
              onChange={onChange}
              maximumDate={new Date()}
            />
          )}

          <Button
            title={isLoading ? 'Cadastrando...' : 'Cadastrar'}
            className="mt-4 w-full"
            noUnderline={true}
            onPress={handleContinue}
            disabled={isLoading}
          />

          <Button
            title="Já tenho conta"
            className="mt-4 w-full border-2 border-[#131E46] bg-transparent"
            textClassName="text-[#131E46]"
            noUnderline={true}
            onPress={() => router.back()}
            disabled={isLoading}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
