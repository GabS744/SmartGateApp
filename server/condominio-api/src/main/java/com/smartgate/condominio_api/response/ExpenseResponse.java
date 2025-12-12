package com.smartgate.condominio_api.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseResponse {
    private String idExpense;
    private String name;
    private ExpenseCategoryResponse category;
    private BigDecimal amount;
    private LocalDate expenseDate;
    private String status;
    private String description;
    private CommitteeMemberSummaryResponse committeeMember;
    private String condominiumId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}