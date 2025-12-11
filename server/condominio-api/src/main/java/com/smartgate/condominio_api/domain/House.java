package com.smartgate.condominio_api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "`House`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class House {
    @Id
    @Column(name = "id_house", columnDefinition = "CHAR(36)")
    private String idHouse;

    @Column(name = "house_number", nullable = false)
    private Integer houseNumber;

    @Column(length = 10)
    private String block;

    // -------------------------------------
    //     RELACIONAMENTO COM CONDOMINIUM
    // -------------------------------------
    @ManyToOne(optional = false)
    @JoinColumn(
            name = "id_condominium",
            referencedColumnName = "id_condominium",
            foreignKey = @ForeignKey(name = "fk_house_condominium")
    )
    private Condominium condominium;

    @PrePersist
    public void prePersist() {
        if (idHouse == null) {
            idHouse = UUID.randomUUID().toString();
        }
    }
}
