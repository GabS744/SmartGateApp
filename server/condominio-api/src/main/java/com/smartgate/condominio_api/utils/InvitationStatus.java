package com.smartgate.condominio_api.utils;

public enum InvitationStatus {
    PENDING("Pendente"),
    ACCEPTED("Aceito"),
    DECLINED("Recusado");

    private final String description;

    InvitationStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
