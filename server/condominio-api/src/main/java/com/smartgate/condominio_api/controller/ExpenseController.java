package com.smartgate.condominio_api.controller;

import com.smartgate.condominio_api.request.ExpenseRequest;
import com.smartgate.condominio_api.request.ExpenseUpdateRequest;
import com.smartgate.condominio_api.response.ExpenseResponse;
import com.smartgate.condominio_api.response.FinancialSummaryResponse; // Importe o DTO novo
import com.smartgate.condominio_api.service.ExpenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    // --- 1. BOTÃO "ADICIONAR GASTO" (ADMIN) ---
    @PostMapping
    public ResponseEntity<ExpenseResponse> createExpense(@RequestBody @Valid ExpenseRequest request) {
        ExpenseResponse response = expenseService.createExpense(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // --- 2. LISTAGEM DE GASTOS (GRID PRINCIPAL) --- testado
    @GetMapping("/period")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByMonth(
            @RequestParam("month") int month,
            @RequestParam("year") int year) {
        return ResponseEntity.ok(expenseService.getExpensesByMonth(month, year));
    }

    // --- 3. CARDS DE RESUMO (RECEITA / DESPESA / SALDO) --- testado
    @GetMapping("/condominium/{condominiumId}/summary")
    public ResponseEntity<FinancialSummaryResponse> getFinancialSummary(
            @PathVariable String condominiumId,
            @RequestParam("month") int month,
            @RequestParam("year") int year) {
        return ResponseEntity.ok(expenseService.getFinancialSummary(condominiumId, month, year));
    }


    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpenseById(@PathVariable String id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> updateExpense(
            @PathVariable String id,
            @RequestBody @Valid ExpenseUpdateRequest request) { // Ele vai receber o JSON com os 6 campos
        return ResponseEntity.ok(expenseService.updateExpense(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable String id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/pay") // testado
    public ResponseEntity<ExpenseResponse> payExpense(@PathVariable String id) {
        return ResponseEntity.ok(expenseService.markAsPaid(id));
    }

}