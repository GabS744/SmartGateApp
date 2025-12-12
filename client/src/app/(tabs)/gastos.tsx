import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronDown, TrendingUp, TrendingDown, Wallet, X, Plus } from 'lucide-react-native';

import ExpenseCard from '@/components/ExpenseCard';
import ExpenseDetailsModal, { ExpenseData } from '@/components/ExpenseDetailsModal';
import ExpenseFormModal from '@/components/ExpenseFormModal';
import {
  getExpenses,
  getFinancialSummary,
  deleteExpense,
  createExpense,
  updateExpense,
  payExpense,
} from '@/services/api';

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const mapStatus = (status: string) => {
  const s = status.toUpperCase();
  if (s === 'PAID') return 'Pago';
  if (s === 'PENDING') return 'Pendente';
  if (s === 'FUTURE') return 'Futuro';
  return status;
};

export default function GastosScreen() {
  const [expensesList, setExpensesList] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalExpense: 0,
    balance: 0,
  });

  const [viewModalData, setViewModalData] = useState<ExpenseData | null>(null);
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseData | null>(null);

  const today = new Date();
  const currentMonthStr = String(today.getMonth() + 1).padStart(2, '0');
  const currentYearStr = String(today.getFullYear());

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthStr);
  const [selectedYear, setSelectedYear] = useState<string>(currentYearStr);
  const [filterModalVisible, setFilterModalVisible] = useState<'month' | 'year' | null>(null);

  const fetchData = useCallback(async () => {
    if (!selectedMonth || !selectedYear) return;

    setLoading(true);
    try {
      const expensesData = await getExpenses(selectedMonth, selectedYear);

      const formattedList: ExpenseData[] = expensesData.map((item: any) => ({
        id: item.idExpense,
        category: item.category ? item.category.name : 'Outros',
        status: mapStatus(item.status),
        title: item.name,
        value: formatCurrency(item.amount),
        date: formatDate(item.expenseDate),
        description: item.description,
        rawValue: item.amount,
        rawDate: item.expenseDate,
      }));
      setExpensesList(formattedList);

      const summaryData = await getFinancialSummary(selectedMonth, selectedYear);
      setSummary({
        totalRevenue: summaryData.totalRevenue || 0,
        totalExpense: summaryData.totalExpense || 0,
        balance: summaryData.balance || 0,
      });
    } catch (_error: any) {
      console.error('Erro ao buscar gastos:', _error);
      // Alert.alert("Erro", "Não foi possível carregar os dados."); // Descomente para debugar
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openAddModal = () => {
    setEditingExpense(null);
    setFormModalVisible(true);
  };

  const openEditModal = (item: ExpenseData) => {
    setViewModalData(null);
    setEditingExpense(item);
    setFormModalVisible(true);
  };

  const handleSaveExpense = async (data: any) => {
    try {
      if (editingExpense) {
        await updateExpense(data.id, data);
        Alert.alert('Sucesso', 'Gasto atualizado!');
      } else {
        await createExpense(data);
        Alert.alert('Sucesso', 'Gasto criado!');
      }
      setFormModalVisible(false);
      fetchData();
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Não foi possível salvar.';
      Alert.alert('Erro', errorMsg);
    }
  };

  const handleDelete = (id: string) => {
    setViewModalData(null);
    Alert.alert('Excluir', 'Tem certeza?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteExpense(id);
            fetchData();
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        },
      },
    ]);
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await payExpense(id);
      Alert.alert('Sucesso', 'Gasto marcado como pago!');
      fetchData();
    } catch {
      Alert.alert('Erro', 'Não foi possível marcar como pago.');
    }
  };

  const months = [
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

  const currentMonthLabel = months.find((m) => m.value === selectedMonth)?.label || 'Selecione';

  return (
    <SafeAreaView className="flex-1 bg-[#F2F3FB]">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        <Text className="mb-6 text-3xl font-bold text-[#283B7D]">Gastos do Condomínio</Text>

        <View className="mb-6 flex-row gap-4">
          <TouchableOpacity
            onPress={() => setFilterModalVisible('month')}
            className="flex-1 flex-row items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm border border-[#283B7D]">
            <Text className="font-bold text-[#131E46]" numberOfLines={1}>
              {currentMonthLabel}
            </Text>
            <ChevronDown size={20} color="#131E46" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFilterModalVisible('year')}
            className="w-28 flex-row items-center justify-between rounded-lg bg-white px-4 py-3 shadow-sm border border-[#283B7D]">
            <Text className="font-bold text-[#131E46]">{selectedYear}</Text>
            <ChevronDown size={20} color="#131E46" />
          </TouchableOpacity>
        </View>

        <View className="mb-6 flex-row justify-between">
          <View className="h-20 w-[30%] justify-center rounded-lg border border-[#283B7D] bg-white p-2">
            <View className="mb-1 flex-row items-center">
              <TrendingUp size={14} color="#10B981" />
              <Text className="ml-1 text-[10px] font-bold text-[#283B7D]">Receitas</Text>
            </View>
            <Text className="text-lg font-bold text-[#131E46]">
              R$ {formatCurrency(summary.totalRevenue)}
            </Text>
          </View>
          <View className="h-20 w-[30%] justify-center rounded-lg border border-[#283B7D] bg-white p-2">
            <View className="mb-1 flex-row items-center">
              <TrendingDown size={14} color="#EF4444" />
              <Text className="ml-1 text-[10px] font-bold text-[#283B7D]">Despesas</Text>
            </View>
            <Text className="text-lg font-bold text-[#131E46]">
              R$ {formatCurrency(summary.totalExpense)}
            </Text>
          </View>
          <View className="h-20 w-[30%] justify-center rounded-lg border border-[#283B7D] bg-white p-2">
            <View className="mb-1 flex-row items-center">
              <Wallet size={14} color="#3B82F6" />
              <Text className="ml-1 text-[10px] font-bold text-[#283B7D]">Saldo</Text>
            </View>
            <Text className="text-lg font-bold text-[#131E46]">
              R$ {formatCurrency(summary.balance)}
            </Text>
          </View>
        </View>

        <View className="mb-6 h-[2px] w-full bg-[#283B7D]/30" />

        <View>
          {loading ? (
            <ActivityIndicator size="large" color="#131E46" />
          ) : expensesList.length > 0 ? (
            expensesList.map((item) => (
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
        onMarkAsPaid={handleMarkAsPaid}
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
              keyExtractor={(item: any) => (typeof item === 'string' ? item : item.value)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }: { item: any }) => {
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
