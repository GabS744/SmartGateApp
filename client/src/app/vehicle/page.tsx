"use client";

import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import VehicleCard from "@/components/VehicleCard";
import { Plus } from "lucide-react-native";
import { useState } from "react";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([
    {
      id: "1",
      nameVehicle: "Toyota Corolla",
      year: 2022,
      placa: "ABC-1234",
      cor: "Prata",
      nameResponsible: "João Silva",
      nameApt: "Bloco B - 302",
      type: "car",
    },
    {
      id: "2",
      nameVehicle: "Honda Titan",
      year: 2020,
      placa: "XYZ-9876",
      cor: "Preta",
      nameResponsible: "Lucas Almeida",
      nameApt: "Bloco C - 105",
      type: "moto",
    },
  ]);

  return (
    <View className="flex-1 bg-white px-4 pt-10">
      <Text className="text-2xl text-[#131E46] font-bold mb-1">
        Veículos
      </Text>

      <Text className="text-gray-500 mb-4">
        Total: {vehicles.length}
      </Text>

      <TouchableOpacity
        className="flex-row items-center bg-[#283B7D] px-4 py-3 rounded-xl mb-5"
      >
        <Plus size={18} color="#fff" className="mr-2" />
        <Text className="text-white font-medium">Adicionar veículo</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} className="pb-20">
        {vehicles.map((v) => (
          <VehicleCard
            key={v.id}
            {...v}
            type={v.type as "car" | "moto"} // 🔥 garante que o tipo está correto

            onConfirmDelete={() =>
              setVehicles((old) => old.filter((i) => i.id !== v.id))
            }

            onSaveEdit={(data) => {
              setVehicles((old) =>
                old.map((i) =>
                  i.id === v.id
                    ? {
                        ...i,
                        nameVehicle: `${data.marca} ${data.modelo}`,
                        year: Number(data.ano),
                        placa: data.placa,
                        cor: data.cor,
                        nameResponsible: data.proprietario,
                        nameApt: data.apt,
                        // 🔥 CONVERSÃO FINAL PARA O TYPE CERTO
                        type: data.type === "Carro" ? "car" : "moto",
                      }
                    : i
                )
              );
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
