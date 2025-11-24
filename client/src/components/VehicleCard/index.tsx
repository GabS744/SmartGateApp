import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Car, Motorbike, Pencil, Trash2, X } from "lucide-react-native";

type EditKeys =
  | "type"
  | "marca"
  | "modelo"
  | "placa"
  | "ano"
  | "cor"
  | "proprietario"
  | "apt";

interface VehicleCardProps {
  nameVehicle: string;
  year: number;
  placa: string;
  cor: string;
  nameResponsible: string;
  nameApt: string;
  type?: "car" | "moto";
  onConfirmDelete?: () => void;
  onSaveEdit?: (data: any) => void;
}

export default function VehicleCard({
  nameVehicle,
  year,
  placa,
  cor,
  nameResponsible,
  nameApt,
  type = "car",
  onConfirmDelete,
  onSaveEdit,
}: VehicleCardProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [editData, setEditData] = useState<Record<EditKeys, string>>({
    type: type === "car" ? "Carro" : "Moto",
    marca: nameVehicle.split(" ")[0],
    modelo: nameVehicle.split(" ")[1] || "",
    placa,
    ano: String(year),
    cor,
    proprietario: nameResponsible,
    apt: nameApt,
  });

  return (
    <>
      {/* CARD */}
      <View className="w-full bg-white rounded-xl p-4 mb-3 border border-gray-100 shadow-sm">
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center">
            <View className="h-10 w-10 rounded-lg bg-blue-100 items-center justify-center mr-2">
              {type === "car" ? (
                <Car size={22} color="#283B7D" />
              ) : (
                <Motorbike size={22} color="#283B7D" />
              )}
            </View>

            <View>
              <Text className="text-[#131E46] font-bold text-base">
                {nameVehicle}
              </Text>
              <Text className="text-gray-500 text-xs">{year}</Text>
            </View>
          </View>

          <View className="flex-row space-x-3">
            <TouchableOpacity onPress={() => setOpenEdit(true)} className="p-1">
              <Pencil size={18} color="#283B7D" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setOpenDelete(true)} className="p-1 bg-red-50 rounded-lg">
              <Trash2 size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row mt-3 space-x-2">
          <View className="bg-gray-100 px-3 py-1 rounded-full">
            <Text className="text-gray-700 text-xs font-medium">{placa}</Text>
          </View>

          <View className="bg-gray-100 px-3 py-1 rounded-full">
            <Text className="text-gray-700 text-xs font-medium">{cor}</Text>
          </View>
        </View>

        <Text className="text-gray-600 text-xs mt-3">👤 {nameResponsible}</Text>
        <Text className="text-gray-600 text-xs mt-1">📍 {nameApt}</Text>
      </View>




      {/* MODAL DE EDIÇÃO */}
      <Modal visible={openEdit} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center p-4">
          <View className="bg-white w-full rounded-xl max-h-[87%] p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-[#131E46]">
                Editar Veículo
              </Text>
              <TouchableOpacity onPress={() => setOpenEdit(false)}>
                <X size={22} color="#131E46" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* SELECT DE TIPO */}
              <View className="mb-4">
                <Text className="text-gray-600 text-sm mb-1">
                  Tipo de Veículo
                </Text>

                <View className="border border-gray-300 rounded-lg">
                  <Picker
                    selectedValue={editData.type}
                    onValueChange={(value) =>
                      setEditData((old) => ({ ...old, type: value as EditKeys }))
                    }
                  >
                    <Picker.Item label="Carro" value="Carro" />
                    <Picker.Item label="Moto" value="Moto" />
                  </Picker>
                </View>
              </View>

              {/* OUTROS CAMPOS */}
              {(
                [
                  { label: "Marca", key: "marca" },
                  { label: "Modelo", key: "modelo" },
                  { label: "Placa", key: "placa" },
                  { label: "Ano", key: "ano" },
                  { label: "Cor", key: "cor" },
                  { label: "Proprietário", key: "proprietario" },
                  { label: "Apartamento", key: "apt" },
                ] as { label: string; key: EditKeys }[]
              ).map((item) => (
                <View key={item.key} className="mb-3">
                  <Text className="text-gray-600 text-sm">{item.label}</Text>
                  <TextInput
                    value={editData[item.key]}
                    onChangeText={(t) =>
                      setEditData((old) => ({ ...old, [item.key]: t }))
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  />
                </View>
              ))}

              <View className="flex-row justify-between mt-6">
                <TouchableOpacity
                  onPress={() => setOpenEdit(false)}
                  className="px-4 py-3 rounded-lg bg-gray-200"
                >
                  <Text>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    onSaveEdit && onSaveEdit(editData);
                    setOpenEdit(false);
                  }}
                  className="px-4 py-3 rounded-lg bg-[#283B7D]"
                >
                  <Text className="text-white font-medium">
                    Salvar Alterações
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>




      {/* MODAL DE EXCLUSÃO */}
      <Modal visible={openDelete} transparent animationType="fade">
        <View className="flex-1 bg-black/40 justify-center items-center p-4">
          <View className="bg-white w-full rounded-xl p-5">
            <Text className="text-lg font-bold text-[#131E46] mb-2">
              Confirmar Exclusão
            </Text>

            <Text className="text-gray-700 mb-5">
              Tem certeza que deseja excluir{" "}
              <Text className="font-bold">{nameVehicle}</Text> (placa:{" "}
              <Text className="font-bold">{placa}</Text>)? Esta ação não pode ser
              desfeita.
            </Text>

            <View className="flex-row justify-between mt-3">
              <TouchableOpacity
                onPress={() => setOpenDelete(false)}
                className="px-4 py-3 rounded-lg bg-gray-200"
              >
                <Text>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  onConfirmDelete && onConfirmDelete();
                  setOpenDelete(false);
                }}
                className="px-4 py-3 rounded-lg bg-red-600"
              >
                <Text className="text-white font-medium">Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
