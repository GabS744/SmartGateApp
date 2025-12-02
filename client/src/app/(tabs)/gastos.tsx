import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, TrendingUp, TrendingDown, Wallet, X, Plus } from 'lucide-react-native';

import ExpenseCard from '@/components/ExpenseCard';
import ExpenseDetailsModal, { ExpenseData } from '@/components/ExpenseDetailsModal';
import ExpenseFormModal from '@/components/ExpenseFormModal';

export default function GastosScreen() {
  const [expensesList, setExpensesList] = useState<ExpenseData[]>([
    {
      id: '1',
      category: 'Limpeza',
      status: 'Pago',
      title: 'Serviço de limpeza mensal',
      value: '1000,00',
      date: '01/01/2026',
      description: 'Limpeza geral das áreas comuns.',
    },
    {
      id: '2',
      category: 'Manutenção',
      status: 'Pendente',
      title: 'Reparo poste de luz',
      value: '1000,00',
      date: '15/02/2026',
      description: 'Orçamento aprovado para troca de fiação.',
    },
  ]);

  const [viewModalData, setViewModalData] = useState<ExpenseData | null>(null);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseData | null>(null);

  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [filterModalVisible, setFilterModalVisible] = useState<'month' | 'year' | null>(null);

  const openAddModal = () => {
    setEditingExpense(null);
    setFormModalVisible(true);
  };

  const openEditModal = (item: ExpenseData) => {
    setViewModalData(null);
    setEditingExpense(item);
    setFormModalVisible(true);
  };

  const handleSaveExpense = (data: any) => {
    if (editingExpense) {
      setExpensesList((prev) => prev.map((item) => (item.id === data.id ? data : item)));
      Alert.alert('Sucesso', 'Gasto atualizado!');
    } else {
      setExpensesList((prev) => [data, ...prev]);
      Alert.alert('Sucesso', 'Gasto criado!');
    }
  };

  const handleDelete = (id: string) => {
    setViewModalData(null);
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          setExpensesList((prev) => prev.filter((item) => item.id !== id));
        },
      },
    ]);
  };

  const months = [
    { label: 'Todos os meses', value: '' },
    { label: 'Janeiro', value: '01' },
    { label: 'Fevereiro', value: '02' },
    { label: 'Março', value: '03' },
    { label: 'Abril', value: '04' },
    { label: 'Maio', value: '05' },
    { label: 'Junho', value: '06' },
    { label: 'Julho', value: '07' },
    { label: 'Agosto', value: '08' },
    { label: 'Setembro', value: '09' },
    { label: 'Outubro', value: '10' },
    { label: 'Novembro', value: '11' },
    { label: 'Dezembro', value: '12' },
  ];
  const years = ['2024', '2025', '2026'];

  const filteredExpenses = useMemo(() => {
    return expensesList.filter((item) => {
      const [day, month, year] = item.date.split('/');
      const monthMatch = selectedMonth === '' || month === selectedMonth;
      const yearMatch = year === selectedYear;
      return monthMatch && yearMatch;
    });
  }, [selectedMonth, selectedYear, expensesList]);

  const currentMonthLabel = months.find((m) => m.value === selectedMonth)?.label || 'Filtrar (mês)';

  const calculateTotal = (type: 'receita' | 'despesa' | 'saldo') => {
    if (type === 'receita') return '0,00';
    if (type === 'saldo') return '0,00';
    const total = filteredExpenses.reduce(
      (acc, item) => acc + parseFloat(item.value.replace(',', '.')),
      0
    );
    return total.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F2F3FB]">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <Text className="mb-6 text-3xl font-bold text-[#283B7D]">Gastos do Condomínio</Text>

        <View className="mb-6 flex-row gap-4">
          <TouchableOpacity
            onPress={() => setFilterModalVisible('month')}
            className="flex-1 flex-row items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
            <Text className="font-bold text-[#131E46]" numberOfLines={1}>
              {currentMonthLabel}
            </Text>
            <ChevronDown size={20} color="#131E46" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterModalVisible('year')}
            className="w-28 flex-row items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm">
            <Text className="font-bold text-blue-600">{selectedYear}</Text>
            <ChevronDown size={20} color="#131E46" />
          </TouchableOpacity>
        </View>

        <View className="mb-6 flex-row justify-between">
          <View className="h-20 w-[30%] justify-center rounded-lg border border-blue-200 bg-white p-2">
            <View className="mb-1 flex-row items-center">
              <TrendingUp size={14} color="#22C55E" />
              <Text className="ml-1 text-[10px] font-bold text-blue-400">Receitas</Text>
            </View>
            <Text className="text-lg font-bold text-[#131E46]">R$ 0,00</Text>
          </View>
          <View className="h-20 w-[30%] justify-center rounded-lg border border-blue-200 bg-white p-2">
            <View className="mb-1 flex-row items-center">
              <TrendingDown size={14} color="#EF4444" />
              <Text className="ml-1 text-[10px] font-bold text-blue-400">Despesas</Text>
            </View>
            <Text className="text-lg font-bold text-[#131E46]">R$ {calculateTotal('despesa')}</Text>
          </View>
          <View className="h-20 w-[30%] justify-center rounded-lg border border-blue-200 bg-white p-2">
            <View className="mb-1 flex-row items-center">
              <Wallet size={14} color="#3B82F6" />
              <Text className="ml-1 text-[10px] font-bold text-blue-400">Saldo</Text>
            </View>
            <Text className="text-lg font-bold text-[#131E46]">R$ 0,00</Text>
          </View>
        </View>

        <View className="mb-6 h-[2px] w-full bg-blue-200/50" />

        <View>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((item) => (
              <ExpenseCard key={item.id} {...item} onPressDetails={() => setViewModalData(item)} />
            ))
          ) : (
            <Text className="mt-4 text-center text-gray-400">Nenhum gasto encontrado.</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={openAddModal}
          className="mt-6 w-full flex-row items-center justify-center rounded-lg bg-[#131E46] py-4 shadow-sm">
          <Plus size={20} color="#FFF" />
          <Text className="ml-2 font-bold text-white">Adicionar novo gasto</Text>
        </TouchableOpacity>
      </ScrollView>

      <ExpenseDetailsModal
        visible={viewModalData !== null}
        data={viewModalData}
        onClose={() => setViewModalData(null)}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      <ExpenseFormModal
        visible={formModalVisible}
        onClose={() => setFormModalVisible(false)}
        onSave={handleSaveExpense}
        initialData={editingExpense}
      />

      <Modal
        visible={filterModalVisible !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(null)}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setFilterModalVisible(null)}
          className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="max-h-[50%] w-full rounded-xl bg-white p-4 shadow-lg">
            <View className="mb-4 flex-row items-center justify-between border-b border-gray-100 pb-2">
              <Text className="text-lg font-bold text-[#131E46]">
                Selecione {filterModalVisible === 'month' ? 'o Mês' : 'o Ano'}
              </Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(null)}>
                <X size={24} color="#131E46" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filterModalVisible === 'month' ? months : years}
              keyExtractor={(item) => (typeof item === 'string' ? item : item.value)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const label = typeof item === 'string' ? item : item.label;
                const value = typeof item === 'string' ? item : item.value;
                const isSelected =
                  filterModalVisible === 'month' ? value === selectedMonth : value === selectedYear;
                return (
                  <TouchableOpacity
                    className={`mb-2 rounded-lg p-3 ${isSelected ? 'bg-blue-100' : 'bg-gray-50'}`}
                    onPress={() => {
                      if (filterModalVisible === 'month') setSelectedMonth(value);
                      else setSelectedYear(value);
                      setFilterModalVisible(null);
                    }}>
                    <Text
                      className={`font-semibold ${isSelected ? 'text-[#131E46]' : 'text-gray-600'}`}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
