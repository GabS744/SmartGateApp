'use client';

import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import VehicleCard from '@/components/VehicleCard';
import { Plus, Check } from 'lucide-react-native';
import InputField from '@/components/InputField';
import SelectModal from '@/components/SelectModal';
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

  const [openAdd, setOpenAdd] = useState(false);
  const [addData, setAddData] = useState({
    type: 'Carro',
    nameVehicle: '',
    year: '',
    placa: '',
    cor: '',
    nameResponsible: '',
    nameApt: '',
  });
  const [showTypeSelect, setShowTypeSelect] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateWithFormData = (data: Record<string, any>) => {
    const errs: Record<string, string> = {};
    const placaVal = String(data.placa || '').toUpperCase();
    const placaRegexOld = /^[A-Z]{3}-\d{4}$/;
    const placaRegexMerc = /^[A-Z]{3}\d[A-Z]\d{2}$/;
    if (!placaVal || !(placaRegexOld.test(placaVal) || placaRegexMerc.test(placaVal))) {
      errs.placa = 'Placa inválida (ex: ABC-1234)';
    }

    const anoVal = Number(data.year);
    const currentYear = new Date().getFullYear();
    if (!data.year || Number.isNaN(anoVal) || anoVal < 1900 || anoVal > currentYear + 1) {
      errs.year = `Ano inválido (entre 1900 e ${currentYear + 1})`;
    }

    const nonDigitRegex = /^[^\d]+$/;
    if (!data.cor || !nonDigitRegex.test(String(data.cor))) {
      errs.cor = 'Cor inválida (não deve conter números)';
    }

    if (!data.nameResponsible || !nonDigitRegex.test(String(data.nameResponsible))) {
      errs.nameResponsible = 'Nome do responsável inválido';
    }

    if (!data.nameVehicle || String(data.nameVehicle).trim().length === 0) {
      errs.nameVehicle = 'Nome do veículo é obrigatório';
    }

    if (!data.nameApt || String(data.nameApt).trim().length === 0) {
      errs.nameApt = 'Apartamento é obrigatório';
    }

    if (!data.type || (data.type !== 'Carro' && data.type !== 'Moto')) {
      errs.type = 'Tipo inválido';
    }

    return errs;
  };

  const handleRegister = () => {
    const validation = validateWithFormData(addData);
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      const first = Object.values(validation)[0];
      Alert.alert('Erro no formulário', first);
      return;
    }

    const newVehicle = {
      id: String(Date.now()),
      nameVehicle: addData.nameVehicle,
      year: Number(addData.year),
      placa: addData.placa.toUpperCase(),
      cor: addData.cor,
      nameResponsible: addData.nameResponsible,
      nameApt: addData.nameApt,
      type: addData.type === 'Carro' ? 'car' : 'moto',
    };

    setVehicles((old) => [newVehicle, ...old]);
    setOpenAdd(false);
    setAddData({
      type: 'Carro',
      nameVehicle: '',
      year: '',
      placa: '',
      cor: '',
      nameResponsible: '',
      nameApt: '',
    });
    setErrors({});
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-2">
      <View className="flex-1 px-4 pt-4">
        <Text className="mb-1 text-3xl font-bold text-[#283B7D]">Veículos</Text>

        <Text className="mb-4 text-blue-400">Total: {vehicles.length}</Text>

        <TouchableOpacity
          className="mb-5 h-[40px] w-[176px] flex-row items-center justify-center self-start rounded-xl bg-[#283B7D]"
          onPress={() => setOpenAdd(true)}>
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

      {/* ADD VEHICLE MODAL */}
      <Modal visible={openAdd} animationType="slide" transparent>
        <View className="flex-1 items-center justify-center bg-black/40 p-4">
          <View className="max-h-[87%] w-full rounded-xl bg-white p-4">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-[#131E46]">Cadastrar Veículo</Text>
              <TouchableOpacity onPress={() => setOpenAdd(false)}>
                <Text className="font-bold text-[#313E4D]">Fechar</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View className="mb-4">
                <Text className="mb-1 text-sm text-gray-600">Tipo de Veículo</Text>
                <TouchableOpacity
                  onPress={() => setShowTypeSelect(true)}
                  className="w-full flex-row items-center justify-between rounded-lg border border-[#283B7D] bg-white p-4">
                  <Text className={addData.type ? 'text-[#131E46]' : 'text-gray-400'}>
                    {addData.type || 'Selecione'}
                  </Text>
                </TouchableOpacity>
                {errors.type && <Text className="mt-1 text-xs text-red-500">{errors.type}</Text>}
              </View>

              <InputField
                label="Nome do Veículo"
                value={addData.nameVehicle}
                onChangeText={(t) => setAddData((old) => ({ ...old, nameVehicle: t }))}
              />
              {errors.nameVehicle && (
                <Text className="text-xs text-red-500">{errors.nameVehicle}</Text>
              )}

              <InputField
                label="Ano"
                type="number"
                value={addData.year}
                onChangeText={(t) => setAddData((old) => ({ ...old, year: t }))}
              />
              {errors.year && <Text className="text-xs text-red-500">{errors.year}</Text>}

              <InputField
                label="Placa"
                value={addData.placa}
                onChangeText={(t) => setAddData((old) => ({ ...old, placa: t }))}
              />
              {errors.placa && <Text className="text-xs text-red-500">{errors.placa}</Text>}

              <InputField
                label="Cor"
                value={addData.cor}
                onChangeText={(t) => setAddData((old) => ({ ...old, cor: t }))}
              />
              {errors.cor && <Text className="text-xs text-red-500">{errors.cor}</Text>}

              <InputField
                label="Nome do responsável"
                value={addData.nameResponsible}
                onChangeText={(t) => setAddData((old) => ({ ...old, nameResponsible: t }))}
              />
              {errors.nameResponsible && (
                <Text className="text-xs text-red-500">{errors.nameResponsible}</Text>
              )}

              <InputField
                label="Apartamento"
                value={addData.nameApt}
                onChangeText={(t) => setAddData((old) => ({ ...old, nameApt: t }))}
              />
              {errors.nameApt && <Text className="text-xs text-red-500">{errors.nameApt}</Text>}

              <View className="mt-6 flex-row justify-between">
                <TouchableOpacity
                  onPress={() => setOpenAdd(false)}
                  className="rounded-lg bg-gray-200 px-4 py-3">
                  <Text>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleRegister}
                  className="flex-row items-center rounded-lg bg-[#283B7D] px-4 py-3">
                  <Check size={18} color="#fff" className="mr-2" />
                  <Text className="font-medium text-white">Registrar Veículo</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Type Select Modal */}
      <SelectModal
        visible={showTypeSelect}
        title="Tipo de Veículo"
        options={[
          { label: 'Carro', value: 'Carro' },
          { label: 'Moto', value: 'Moto' },
        ]}
        selectedValue={addData.type}
        onSelect={(value) => setAddData((old) => ({ ...old, type: value }))}
        onClose={() => setShowTypeSelect(false)}
      />
    </SafeAreaView>
  );
}
