package com.smartgate.condominio_api.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class ConfirmationToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String token; // O código UUID que vai no link

    @Column(nullable = false)
    private LocalDateTime createdAt; // Quando foi criado

    @Column(nullable = false)
    private LocalDateTime expiresAt; // Quando expira (ex: 15 min depois)

    private LocalDateTime confirmedAt; // Quando o usuário clicou (se null, não clicou)

    @ManyToOne
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    // Construtor personalizado para facilitar a criação lá no Service
    public ConfirmationToken(String token, LocalDateTime createdAt, LocalDateTime expiresAt, User user) {
        this.token = token;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.user = user;
    }
}
