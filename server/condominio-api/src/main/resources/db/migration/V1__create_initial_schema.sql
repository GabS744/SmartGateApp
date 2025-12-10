-- ============================================
-- SCRIPT DE MIGRAÇÃO FLYWAY - MySQL 8.0
-- V1__create_initial_schema.sql
-- ============================================

-- ============================================
-- TABELAS BASE
-- ============================================

CREATE TABLE Condominium (
                             id_condominium CHAR(36) PRIMARY KEY,
                             name           VARCHAR(100) NOT NULL,
                             cnpj           VARCHAR(18) UNIQUE NOT NULL,
                             balance        DECIMAL(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Person (
                        id_person     CHAR(36) PRIMARY KEY,
                        full_name     VARCHAR(100) NOT NULL,
                        cpf           VARCHAR(14) UNIQUE NOT NULL,
                        rg            VARCHAR(20),
                        gender        CHAR(1),
                        date_of_birth DATE,
                        email         VARCHAR(150) UNIQUE,
                        password_hash VARCHAR(200)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE House (
                       id_house       CHAR(36) PRIMARY KEY,
                       house_number   INT NOT NULL,
                       block          VARCHAR(10),
                       id_condominium CHAR(36) NOT NULL,
                       CONSTRAINT fk_house_condominium
                           FOREIGN KEY (id_condominium)
                               REFERENCES Condominium(id_condominium)
                               ON DELETE RESTRICT
                               ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABELAS DEPENDENTES
-- ============================================

CREATE TABLE Resident (
                          id_resident   CHAR(36) PRIMARY KEY,
                          id_person     CHAR(36) NOT NULL,
                          id_house      CHAR(36) NOT NULL,
                          date_of_entry DATE DEFAULT (CURRENT_DATE),
                          CONSTRAINT fk_resident_person
                              FOREIGN KEY (id_person)
                                  REFERENCES Person(id_person)
                                  ON DELETE RESTRICT
                                  ON UPDATE CASCADE,
                          CONSTRAINT fk_resident_house
                              FOREIGN KEY (id_house)
                                  REFERENCES House(id_house)
                                  ON DELETE RESTRICT
                                  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Employee (
                          id_employee  CHAR(36) PRIMARY KEY,
                          id_person    CHAR(36) NOT NULL,
                          department   VARCHAR(50),
                          payment_type VARCHAR(20),
                          salary       DECIMAL(10,2),
                          CONSTRAINT fk_employee_person
                              FOREIGN KEY (id_person)
                                  REFERENCES Person(id_person)
                                  ON DELETE RESTRICT
                                  ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Visitor (
                         id_visitor          CHAR(36) PRIMARY KEY,
                         id_person           CHAR(36) NOT NULL,
                         id_resident_visited CHAR(36) NOT NULL,
                         entry_datetime      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         CONSTRAINT fk_visitor_person
                             FOREIGN KEY (id_person)
                                 REFERENCES Person(id_person)
                                 ON DELETE RESTRICT
                                 ON UPDATE CASCADE,
                         CONSTRAINT fk_visitor_resident
                             FOREIGN KEY (id_resident_visited)
                                 REFERENCES Resident(id_resident)
                                 ON DELETE RESTRICT
                                 ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Owner (
                       id_resident      CHAR(36) PRIMARY KEY,
                       acquisition_date DATE,
                       CONSTRAINT fk_owner_resident
                           FOREIGN KEY (id_resident)
                               REFERENCES Resident(id_resident)
                               ON DELETE CASCADE
                               ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE CommitteeMember (
                                 id_resident CHAR(36) PRIMARY KEY,
                                 position    VARCHAR(50),
                                 start_date  DATE,
                                 end_date    DATE,
                                 CONSTRAINT fk_committee_resident
                                     FOREIGN KEY (id_resident)
                                         REFERENCES Resident(id_resident)
                                         ON DELETE CASCADE
                                         ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Contribution (
                              id_contribution CHAR(36) PRIMARY KEY,
                              id_house        CHAR(36) NOT NULL,
                              id_condominium  CHAR(36) NOT NULL,
                              payment_date    DATE,
                              amount          DECIMAL(10,2) NOT NULL,
                              CONSTRAINT fk_contribution_house
                                  FOREIGN KEY (id_house)
                                      REFERENCES House(id_house)
                                      ON DELETE RESTRICT
                                      ON UPDATE CASCADE,
                              CONSTRAINT fk_contribution_condominium
                                  FOREIGN KEY (id_condominium)
                                      REFERENCES Condominium(id_condominium)
                                      ON DELETE RESTRICT
                                      ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Vehicle (
                         plate     VARCHAR(10) PRIMARY KEY,
                         model     VARCHAR(50),
                         color     VARCHAR(20),
                         id_person CHAR(36) NOT NULL,
                         CONSTRAINT fk_vehicle_owner
                             FOREIGN KEY (id_person)
                                 REFERENCES Person(id_person)
                                 ON DELETE RESTRICT
                                 ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE Users (
                       id            CHAR(36) PRIMARY KEY,
                       full_name     VARCHAR(100) NOT NULL,
                       email         VARCHAR(150) NOT NULL UNIQUE,
                       password_hash VARCHAR(200) NOT NULL,
                       role          VARCHAR(50) NOT NULL,
                       enabled       BOOLEAN NOT NULL DEFAULT TRUE,
                       date_of_birth DATE,
                       created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;