package com.smartgate.condominio_api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "`Employee`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {
    @Id
    @Column(name = "id_employee", columnDefinition = "CHAR(36)")
    private String idEmployee;

    // ---------------------------------------
    // RELAÇÃO COM PERSON
    // ---------------------------------------
    @ManyToOne(optional = false)
    @JoinColumn(
            name = "id_person",
            referencedColumnName = "id_person",
            foreignKey = @ForeignKey(name = "fk_employee_person")
    )
    private Person person;

    @Column(length = 50)
    private String department;

    @Column(name = "payment_type", length = 20)
    private String paymentType;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal salary;

    @PrePersist
    public void prePersist() {
        if (idEmployee == null) {
            idEmployee = UUID.randomUUID().toString();
        }
    }
}
