package com.smartgate.condominio_api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "`Owner`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Owner {

    @Id
    @Column(name = "id_resident", columnDefinition = "CHAR(36)")
    private String idResident;

    @OneToOne(optional = false)
    @JoinColumn(
            name = "id_resident",
            referencedColumnName = "id_resident",
            insertable = false,
            updatable = false,
            foreignKey = @ForeignKey(name = "fk_owner_resident")
    )
    private Resident resident;

    @Column(name = "acquisition_date")
    private LocalDate acquisitionDate;
}
