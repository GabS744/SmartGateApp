import { Text, View, Button } from 'react-native';
import { useState } from 'react'; // Importar o hook useState
import { PopupConfirm } from '@/components/PopConfirm';
import { PopupStatus } from '@/components/PopStatus';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function User() {
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isStatusVisible, setIsStatusVisible] = useState(false);

  const [popupStatus, setPopupStatus] = useState<'success' | 'error'>('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleConfirm = () => {
    setIsConfirmVisible(false);
    setPopupStatus('success');
    setStatusTitle('Ação Confirmada!');
    setStatusMessage('Sua operação foi realizada com sucesso.');
    setIsStatusVisible(true);

    setTimeout(() => {
      setIsStatusVisible(false);
    }, 2000);
  };

  const handleCloseConfirm = () => {
    setIsConfirmVisible(false);
  };

  const handleShowError = () => {
    setPopupStatus('error');
    setStatusTitle('Ocorreu um Erro!');
    setStatusMessage('Não foi possível completar sua solicitação.');
    setIsStatusVisible(true);

    setTimeout(() => {
      setIsStatusVisible(false);
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-[#CBD0F2]">
      <View className="flex-1 items-center justify-center gap-y-4 bg-white">
        <Text className="text-xl font-bold text-blue-500">Pagina de perfil!</Text>

        <Button title="Mostrar Confirmação (Sucesso)" onPress={() => setIsConfirmVisible(true)} />
        <Button title="Mostrar Status (Erro)" onPress={handleShowError} color="#EF4444" />

        <PopupConfirm
          visible={isConfirmVisible}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirm}
          title="Você tem certeza?"
          message="Esta ação é irreversível. Deseja continuar?"
        />

        <PopupStatus
          visible={isStatusVisible}
          status={popupStatus}
          title={statusTitle}
          message={statusMessage}
        />
      </View>
    </SafeAreaView>
  );
}
