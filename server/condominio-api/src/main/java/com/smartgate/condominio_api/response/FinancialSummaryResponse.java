package com.smartgate.condominio_api.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancialSummaryResponse {
    private BigDecimal revenue;  // Receita (Entradas do mês)
    private BigDecimal expense;  // Despesas (Saídas do mês)
    private BigDecimal balance;  // Saldo Atual (Caixa do condomínio)
}