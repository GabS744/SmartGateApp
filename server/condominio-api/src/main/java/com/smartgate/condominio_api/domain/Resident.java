package com.smartgate.condominio_api.domain;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "`Resident`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resident {
    @Id
    @Column(name = "id_resident", columnDefinition = "CHAR(36)")
    private String idResident;

    // -----------------------------
    //      RELAÇÃO COM PERSON
    // -----------------------------
    @ManyToOne(optional = false)
    @JoinColumn(
            name = "id_person",
            referencedColumnName = "id_person",
            foreignKey = @ForeignKey(name = "fk_resident_person")
    )
    private Person person;

    // -----------------------------
    //       RELAÇÃO COM HOUSE
    // -----------------------------
    @ManyToOne(optional = false)
    @JoinColumn(
            name = "id_house",
            referencedColumnName = "id_house",
            foreignKey = @ForeignKey(name = "fk_resident_house")
    )
    private House house;

    // -----------------------------
    //     DATA DE ENTRADA
    // -----------------------------
    @Column(name = "date_of_entry", insertable = false, updatable = false)
    private LocalDate dateOfEntry;

    @PrePersist
    public void prePersist() {
        if (idResident == null) {
            idResident = UUID.randomUUID().toString();
        }
    }
}
