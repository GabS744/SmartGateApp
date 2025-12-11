package com.smartgate.condominio_api.service;

import com.smartgate.condominio_api.request.ExpenseRequest;
import com.smartgate.condominio_api.request.ExpenseUpdateRequest;
import com.smartgate.condominio_api.response.ExpenseResponse;
import com.smartgate.condominio_api.mapper.ExpenseMapper;
import com.smartgate.condominio_api.domain.*;
import com.smartgate.condominio_api.repository.*;
import com.smartgate.condominio_api.response.FinancialSummaryResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseCategoryRepository categoryRepository;
    private final CommitteeMemberRepository committeeMemberRepository;
    private final CondominiumRepository condominiumRepository;
    private final ExpenseMapper expenseMapper;
    private final ContributionRepository contributionRepository;

    public ExpenseResponse createExpense(ExpenseRequest request) {
        ExpenseCategory category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        CommitteeMember committee = committeeMemberRepository.findById(request.getCommitteeMemberId())
                .orElseThrow(() -> new RuntimeException("Membro da comissão não encontrado"));

        Condominium condominium = condominiumRepository.findById(request.getCondominiumId())
                .orElseThrow(() -> new RuntimeException("Condomínio não encontrado"));

        Expense expense = expenseMapper.toEntity(request);
        expense.setCategory(category);
        expense.setCommitteeMember(committee);
        expense.setCondominium(condominium);

        // CORREÇÃO: Usando a String literal diretamente
        // Se o request não vier com status, definimos como "Pendente"
        if (expense.getStatus() == null || expense.getStatus().isEmpty()) {
            expense.setStatus("Pendente");
        }

        Expense saved = expenseRepository.save(expense);
        return expenseMapper.toResponse(saved);
    }

    public ExpenseResponse updateExpense(String expenseId, ExpenseUpdateRequest request) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Gasto não encontrado"));

        if (request.getCategoryId() != null) {
            ExpenseCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
            expense.setCategory(category);
        }

        // O Mapper copia a String (ex: "Pago") do request para a entidade
        expenseMapper.updateEntityFromRequest(request, expense);

        Expense updated = expenseRepository.save(expense);
        return expenseMapper.toResponse(updated);
    }

    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(String expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Gasto não encontrado"));
        return expenseMapper.toResponse(expense);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses() {
        List<Expense> expenses = expenseRepository.findAll();
        return expenseMapper.toResponseList(expenses);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByCondominium(String condominiumId) {
        List<Expense> expenses = expenseRepository.findByCondominiumIdCondominium(condominiumId);
        return expenseMapper.toResponseList(expenses);
    }

    // Recebe String (ex: "Pendente")
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByStatus(String status) {
        List<Expense> expenses = expenseRepository.findByStatus(status);
        return expenseMapper.toResponseList(expenses);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByCondominiumAndStatus(String condominiumId, String status) {
        List<Expense> expenses = expenseRepository.findByCondominiumAndStatus(condominiumId, status);
        return expenseMapper.toResponseList(expenses);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByMonth(int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());


        return getExpensesByPeriod(startDate, endDate);
    }

    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByPeriod(LocalDate startDate, LocalDate endDate) {
        List<Expense> expenses = expenseRepository.findByExpenseDateBetween(startDate, endDate);
        return expenseMapper.toResponseList(expenses);
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalExpensesByPeriod(String condominiumId, LocalDate startDate, LocalDate endDate) {
        BigDecimal total = expenseRepository.getTotalExpensesByPeriod(condominiumId, startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }

    @Transactional(readOnly = true)
    public BigDecimal getTotalPaidExpenses(String condominiumId) {
        BigDecimal total = expenseRepository.getTotalPaidExpensesByCondominium(condominiumId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public ExpenseResponse markAsPaid(String expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Gasto não encontrado"));

        // CORREÇÃO: Comparando com a String literal "Pago"
        if ("Pago".equals(expense.getStatus())) {
            throw new RuntimeException("Este gasto já está marcado como pago");
        }

        expense.setStatus("Pago");

        // Atualizar o saldo do condomínio
        Condominium condominium = expense.getCondominium();
        condominium.setBalance(condominium.getBalance().subtract(expense.getAmount()));
        condominiumRepository.save(condominium);

        Expense updated = expenseRepository.save(expense);
        return expenseMapper.toResponse(updated);
    }

    public void deleteExpense(String expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new EntityNotFoundException("Gasto não encontrado"));

        if ("Pago".equals(expense.getStatus())) {
            throw new IllegalStateException("Gastos já pagos não podem ser excluídos");
        }

        expenseRepository.delete(expense);
    }

    @Transactional(readOnly = true)
    public FinancialSummaryResponse getFinancialSummary(String condominiumId, int month, int year) {
        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        BigDecimal revenue = contributionRepository.getTotalRevenueByPeriod(condominiumId, startDate, endDate);
        revenue = (revenue != null) ? revenue : BigDecimal.ZERO;

        BigDecimal expenses = expenseRepository.getTotalExpensesByPeriod(condominiumId, startDate, endDate);
        expenses = (expenses != null) ? expenses : BigDecimal.ZERO;

        Condominium condominium = condominiumRepository.findById(condominiumId)
                .orElseThrow(() -> new RuntimeException("Condomínio não encontrado"));
        BigDecimal balance = condominium.getBalance();

        return FinancialSummaryResponse.builder()
                .revenue(revenue)
                .expense(expenses)
                .balance(balance)
                .build();
    }
}