import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { TriangleAlert, X } from 'lucide-react-native';

interface PopupConfirmProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function PopupConfirm({ visible, onClose, onConfirm, title, message }: PopupConfirmProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <View className="w-72 items-center rounded-2xl bg-[#131E46] p-6 shadow-lg">
          <View className="mb-4 rounded-full bg-white/10 p-4">
            <TriangleAlert size={42} color="#FFFFFF" />
          </View>

          {title && (
            <Text className="mb-2 text-center text-lg font-semibold text-white">{title}</Text>
          )}

          {message && <Text className="mb-6 text-center text-white/90">{message}</Text>}

          <View className="w-full flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 items-center rounded-xl bg-gray-300 py-2.5">
              <Text className="font-semibold text-[#131E46]">Não</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 items-center rounded-xl bg-[#283B7D] py-2.5">
              <Text className="font-semibold text-white">Sim</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} className="absolute right-3 top-3 p-1">
            <X size={20} color="#FFFFFF99" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
