package com.smartgate.condominio_api.request;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseUpdateRequest {

    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String name;

    private String categoryId;

    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal amount;

    private LocalDate expenseDate;

    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    private String description;
}