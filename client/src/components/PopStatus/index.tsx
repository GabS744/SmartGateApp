import React from 'react';
import { View, Text, Modal } from 'react-native';
import { CheckCircle2, XCircle } from 'lucide-react-native';

interface PopupStatusProps {
  visible: boolean;
  status?: 'success' | 'error';
  title?: string;
  message?: string;
}

export function PopupStatus({
  visible,
  status = 'success',
  title,
  message,
}: PopupStatusProps) {
  const IconComponent = status === 'success' ? CheckCircle2 : XCircle;
  const iconColor = status === 'success' ? '#22C55E' : '#EF4444';

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/40 items-center justify-center px-6">
        <View className="bg-[#9BA7E7] w-72 rounded-2xl p-6 items-center shadow-lg">

          <View className="bg-white/20 p-4 rounded-full mb-4">
            <IconComponent size={44} color={iconColor} />
          </View>


          {title && (
            <Text className="text-white text-lg font-semibold text-center mb-2">
              {title}
            </Text>
          )}

          {message && (
            <Text className="text-white/90 text-center">
              {message}
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
