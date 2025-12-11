package com.smartgate.condominio_api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "`Visitor`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visitor {
    @Id
    @Column(name = "id_visitor", columnDefinition = "CHAR(36)")
    private String idVisitor;

    // -----------------------------
    //   RELACIONAMENTO COM PERSON
    // -----------------------------
    @ManyToOne(optional = false)
    @JoinColumn(
            name = "id_person",
            referencedColumnName = "id_person",
            foreignKey = @ForeignKey(name = "fk_visitor_person")
    )
    private Person person;

    // --------------------------------------
    //   RELACIONAMENTO COM RESIDENT VISITADO
    // --------------------------------------
    @ManyToOne(optional = false)
    @JoinColumn(
            name = "id_resident_visited",
            referencedColumnName = "id_resident",
            foreignKey = @ForeignKey(name = "fk_visitor_resident")
    )
    private Resident residentVisited;

    // -----------------------------
    //     ENTRY DATETIME
    // -----------------------------
    @Column(name = "entry_datetime", insertable = false, updatable = false)
    private LocalDateTime entryDatetime;

    @PrePersist
    public void prePersist() {
        if (idVisitor == null) {
            idVisitor = UUID.randomUUID().toString();
        }
    }
}
