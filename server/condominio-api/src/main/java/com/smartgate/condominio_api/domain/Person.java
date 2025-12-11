package com.smartgate.condominio_api.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "`Person`")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Person {

    @Id
    @Column(name = "id_person", columnDefinition = "CHAR(36)")
    private String idPerson;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, unique = true, length = 14)
    private String cpf;

    @Column(length = 20)
    private String rg;

    @Column(length = 1)
    private String gender;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", length = 200)
    private String passwordHash;

    @PrePersist
    public void prePersist() {
        if (idPerson == null) {
            idPerson = UUID.randomUUID().toString();
        }
    }
}
