import { View, Text, Modal, TouchableOpacity } from "react-native";
import { Calendar, Clock, MapPin, User } from "lucide-react-native";

type EventType = {
  id: number | string;
  title: string;
  fullDate?: string;
  time: string;
  location: string;
  createdBy: string;
  description: string;
};

export default function EventModal({ visible, onClose, event }: { visible: boolean; onClose: () => void; event?: EventType | null }) {
  if (!event) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <View className="bg-white w-full rounded-xl p-5">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold">{event.title}</Text>

            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500 text-xl">×</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-2 mb-2">
            <Calendar size={18} color="#131E46" />
            <Text className="text-gray-700">
              {event.fullDate
                ? event.fullDate.split("-").reverse().join("/")
                : ""}
            </Text>
          </View>

          <View className="flex-row items-center gap-2 mb-2">
            <Clock size={18} color="#131E46" />
            <Text className="text-gray-700">{event.time}</Text>
          </View>

          <View className="flex-row items-center gap-2 mb-2">
            <MapPin size={18} color="#131E46" />
            <Text className="text-gray-700">{event.location}</Text>
          </View>

          <View className="flex-row items-center gap-2 mb-3">
            <User size={18} color="#131E46" />
            <Text className="text-gray-700">{event.createdBy}</Text>
          </View>

          <Text className="font-semibold mt-2">Descrição</Text>
          <Text className="text-gray-600 mt-1">{event.description}</Text>
        </View>
      </View>
    </Modal>
  );
}
