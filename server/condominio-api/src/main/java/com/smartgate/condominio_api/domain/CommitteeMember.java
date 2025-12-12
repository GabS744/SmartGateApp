package com.smartgate.condominio_api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "`CommitteeMember`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommitteeMember {

    @Id
    @Column(name = "id_resident", columnDefinition = "CHAR(36)")
    private String idResident;

    @OneToOne(optional = false)
    @JoinColumn(
            name = "id_resident",
            referencedColumnName = "id_resident",
            insertable = false,
            updatable = false,
            foreignKey = @ForeignKey(name = "fk_committee_resident")
    )
    private Resident resident;

    @Column(length = 50)
    private String position;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}
