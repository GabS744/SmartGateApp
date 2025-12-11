package com.smartgate.condominio_api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "`Contribution`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contribution {

    @Id
    @Column(name = "id_contribution", columnDefinition = "CHAR(36)")
    private String idContribution;

    // -----------------------------------------------------
    // RELAÇÃO COM HOUSE
    // -----------------------------------------------------
    @ManyToOne(optional = false)
    @JoinColumn(
            name = "id_house",
            referencedColumnName = "id_house",
            foreignKey = @ForeignKey(name = "fk_contribution_house")
    )
    private House house;

    // -----------------------------------------------------
    // RELAÇÃO COM CONDOMINIUM
    // -----------------------------------------------------
    @ManyToOne(optional = false)
    @JoinColumn(
            name = "id_condominium",
            referencedColumnName = "id_condominium",
            foreignKey = @ForeignKey(name = "fk_contribution_condominium")
    )
    private Condominium condominium;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @PrePersist
    public void prePersist() {
        if (idContribution == null) {
            idContribution = UUID.randomUUID().toString();
        }
    }
}
