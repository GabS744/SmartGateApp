package com.smartgate.condominio_api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "`Condominium`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Condominium {
    @Id
    @Column(name = "id_condominium", columnDefinition = "CHAR(36)")
    private String idCondominium;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 18)
    private String cnpj;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal balance;

    @PrePersist
    public void prePersist() {
        // Gera UUID se não informado
        if (idCondominium == null) {
            idCondominium = UUID.randomUUID().toString();
        }

        // Garante balance padrão 0.00 caso o valor seja omitido
        if (balance == null) {
            balance = BigDecimal.ZERO;
        }
    }
}