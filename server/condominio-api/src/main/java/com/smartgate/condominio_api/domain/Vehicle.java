package com.smartgate.condominio_api.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "`Vehicle`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @Column(name = "plate", length = 10, nullable = false)
    private String plate;

    @Column(name = "model", length = 50)
    private String model;

    @Column(name = "color", length = 20)
    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "id_person",
            referencedColumnName = "id_person",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_vehicle_owner")
    )
    private Person person;
}
