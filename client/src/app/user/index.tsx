import { Text, View, Button } from 'react-native';
import { useState } from 'react'; // Importar o hook useState
import { PopupConfirm } from '@/components/PopConfirm';
import { PopupStatus } from '@/components/PopStatus';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function User() {
  // --- Estados para controlar a visibilidade ---
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isStatusVisible, setIsStatusVisible] = useState(false);

  // --- Estados para configurar o PopupStatus ---
  const [popupStatus, setPopupStatus] = useState<'success' | 'error'>('success');
  const [statusTitle, setStatusTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // --- Funções para o PopupConfirm ---

  // Função chamada ao confirmar a ação
  const handleConfirm = () => {
    // 1. Fecha o modal de confirmação
    setIsConfirmVisible(false);

    // 2. Configura e exibe o modal de status (sucesso)
    setPopupStatus('success');
    setStatusTitle('Ação Confirmada!');
    setStatusMessage('Sua operação foi realizada com sucesso.');
    setIsStatusVisible(true);

    // 3. Fecha o modal de status automaticamente após 2s
    // (Já que o PopupStatus não tem botão de fechar)
    setTimeout(() => {
      setIsStatusVisible(false);
    }, 2000);
  };

  // Função chamada ao fechar o PopupConfirm (botão "Não" ou 'X')
  const handleCloseConfirm = () => {
    setIsConfirmVisible(false);
  };

  // --- Função extra para demonstrar o status de erro ---
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
      <View className="flex-1 items-center justify-center bg-white gap-y-4">
        <Text className="text-xl font-bold text-blue-500">Pagina de perfil!</Text>

        {/* Botões para disparar os modais */}
        <Button
          title="Mostrar Confirmação (Sucesso)"
          onPress={() => setIsConfirmVisible(true)} // Abre o PopConfirm
        />
        <Button
          title="Mostrar Status (Erro)"
          onPress={handleShowError} // Abre o PopStatus de erro
          color="#EF4444"
        />

        {/* --- Renderização dos Modais --- */}

        {/* Modal de Confirmação */}
        <PopupConfirm
          visible={isConfirmVisible}
          onClose={handleCloseConfirm}
          onConfirm={handleConfirm}
          title="Você tem certeza?"
          message="Esta ação é irreversível. Deseja continuar?"
        />

        {/* Modal de Status (Sucesso ou Erro) */}
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