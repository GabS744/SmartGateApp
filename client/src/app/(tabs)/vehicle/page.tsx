'use client';

import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import VehicleCard from '@/components/VehicleCard';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([
    {
      id: '1',
      nameVehicle: 'Toyota Corolla',
      year: 2022,
      placa: 'ABC-1234',
      cor: 'Prata',
      nameResponsible: 'João Silva',
      nameApt: 'Bloco B - 302',
      type: 'car',
    },
    {
      id: '2',
      nameVehicle: 'Honda Titan',
      year: 2020,
      placa: 'XYZ-9876',
      cor: 'Preta',
      nameResponsible: 'Lucas Almeida',
      nameApt: 'Bloco C - 105',
      type: 'moto',
    },
  ]);

  return (
    <SafeAreaView className="flex-1 p-2 bg-white">

      <View className="flex-1 px-4 pt-4">
        <Text className="mb-1 text-3xl font-bold text-[#283B7D]">Veículos</Text>

        <Text className="mb-4 text-blue-400">Total: {vehicles.length}</Text>

        <TouchableOpacity className="mb-5 h-[32px] w-[152px] flex-row items-center justify-center self-start rounded-xl bg-[#283B7D]">
          <Plus size={18} color="#fff" className="ml-2 mr-2" />
          <Text className="font-medium text-white"> Adicionar veículo</Text>
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}

          contentContainerStyle={{ paddingBottom: 80 }}>
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              {...v}
              type={v.type as 'car' | 'moto'}
              onConfirmDelete={() => setVehicles((old) => old.filter((i) => i.id !== v.id))}
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
                          type: data.type === 'Carro' ? 'car' : 'moto',
                        }
                      : i
                  )
                );
              }}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
