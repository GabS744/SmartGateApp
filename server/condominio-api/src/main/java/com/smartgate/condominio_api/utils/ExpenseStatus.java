package com.smartgate.condominio_api.utils;

public enum ExpenseStatus {
    PENDING("Pendente"),
    APPROVED("Aprovado"),
    REJECTED("Rejeitado"),
    PAID("Pago");

    private final String description;

    ExpenseStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
