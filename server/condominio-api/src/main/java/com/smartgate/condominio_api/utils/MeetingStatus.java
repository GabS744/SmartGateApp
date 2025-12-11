package com.smartgate.condominio_api.utils;

public enum MeetingStatus {
    SCHEDULED("Agendada"),
    COMPLETED("Concluída"),
    CANCELLED("Cancelada");

    private final String description;

    MeetingStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}