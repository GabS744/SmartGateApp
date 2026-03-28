import React from 'react';
import { View, Text, Modal } from 'react-native';
import { CheckCircle2, XCircle } from 'lucide-react-native';

interface PopupStatusProps {
  visible: boolean;
  status?: 'success' | 'error';
  title?: string;
  message?: string;
}

export function PopupStatus({ visible, status = 'success', title, message }: PopupStatusProps) {
  const IconComponent = status === 'success' ? CheckCircle2 : XCircle;
  const iconColor = status === 'success' ? '#22C55E' : '#EF4444';

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-72 items-center rounded-2xl bg-[#283B7D] p-6 shadow-lg">
          <View className="mb-4 rounded-full bg-white/20 p-4">
            <IconComponent size={44} color={iconColor} />
          </View>

          {title && (
            <Text className="mb-2 text-center text-lg font-semibold text-white">{title}</Text>
          )}

          {message && <Text className="text-center text-white/90">{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}
