import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import { TriangleAlert , X } from 'lucide-react-native';

interface PopupConfirmProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function PopupConfirm({
  visible,
  onClose,
  onConfirm,
  title,
  message,
}: PopupConfirmProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View className="flex-1 bg-black/40 items-center justify-center px-6">
        <View className="bg-[#131E46] w-72 rounded-2xl p-6 items-center shadow-lg">
          <View className="bg-white/10 p-4 rounded-full mb-4">
            <TriangleAlert size={42} color="#FFFFFF" />
          </View>


          {title && (
            <Text className="text-white text-lg font-semibold text-center mb-2">
              {title}
            </Text>
          )}

          {message && (
            <Text className="text-white/90 text-center mb-6">
              {message}
            </Text>
          )}


          <View className="flex-row gap-3 w-full">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-[#6A7FDB] py-2.5 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">Não</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="flex-1 bg-[#313E4D] py-2.5 rounded-xl items-center"
            >
              <Text className="text-white font-semibold">Sim</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onClose}
            className="absolute top-3 right-3 p-1"
          >
            <X size={20} color="#FFFFFF99" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}