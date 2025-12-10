-- ============================================
-- V2__create_expense_and_meeting_tables.sql
-- Criar em: src/main/resources/db/migration/
-- ============================================

-- Tabela de Categorias de Gastos
CREATE TABLE ExpenseCategory (
                                 id_category CHAR(36) PRIMARY KEY,
                                 name        VARCHAR(50) NOT NULL UNIQUE,
                                 description VARCHAR(200),
                                 created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Gastos
CREATE TABLE Expense (
                         id_expense         CHAR(36) PRIMARY KEY,
                         name               VARCHAR(100) NOT NULL,
                         id_category        CHAR(36) NOT NULL,
                         amount             DECIMAL(10,2) NOT NULL,
                         expense_date       DATE NOT NULL,
                         status             VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                         description        TEXT,
                         id_committee_member CHAR(36) NOT NULL,
                         id_condominium     CHAR(36) NOT NULL,
                         created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                         CONSTRAINT fk_expense_category
                             FOREIGN KEY (id_category)
                                 REFERENCES ExpenseCategory(id_category)
                                 ON DELETE RESTRICT
                                 ON UPDATE CASCADE,

                         CONSTRAINT fk_expense_committee
                             FOREIGN KEY (id_committee_member)
                                 REFERENCES CommitteeMember(id_resident)
                                 ON DELETE RESTRICT
                                 ON UPDATE CASCADE,

                         CONSTRAINT fk_expense_condominium
                             FOREIGN KEY (id_condominium)
                                 REFERENCES Condominium(id_condominium)
                                 ON DELETE CASCADE
                                 ON UPDATE CASCADE,

                         CONSTRAINT chk_expense_status
                             CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'PAID'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Reuniões
CREATE TABLE Meeting (
                         id_meeting      CHAR(36) PRIMARY KEY,
                         name            VARCHAR(100) NOT NULL,
                         meeting_date    DATE NOT NULL,
                         meeting_time    TIME NOT NULL,
                         location        VARCHAR(200) NOT NULL,
                         description     TEXT,
                         id_publisher    CHAR(36) NOT NULL,
                         id_condominium  CHAR(36) NOT NULL,
                         status          VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
                         created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

                         CONSTRAINT fk_meeting_publisher
                             FOREIGN KEY (id_publisher)
                                 REFERENCES Person(id_person)
                                 ON DELETE RESTRICT
                                 ON UPDATE CASCADE,

                         CONSTRAINT fk_meeting_condominium
                             FOREIGN KEY (id_condominium)
                                 REFERENCES Condominium(id_condominium)
                                 ON DELETE CASCADE
                                 ON UPDATE CASCADE,

                         CONSTRAINT chk_meeting_status
                             CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Participantes da Reunião (Many-to-Many)
CREATE TABLE MeetingParticipant (
                                    id_meeting_participant CHAR(36) PRIMARY KEY,
                                    id_meeting             CHAR(36) NOT NULL,
                                    id_person              CHAR(36) NOT NULL,
                                    invitation_status      VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                                    invited_at             TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                    response_at            TIMESTAMP NULL,

                                    CONSTRAINT fk_participant_meeting
                                        FOREIGN KEY (id_meeting)
                                            REFERENCES Meeting(id_meeting)
                                            ON DELETE CASCADE
                                            ON UPDATE CASCADE,

                                    CONSTRAINT fk_participant_person
                                        FOREIGN KEY (id_person)
                                            REFERENCES Person(id_person)
                                            ON DELETE CASCADE
                                            ON UPDATE CASCADE,

                                    CONSTRAINT chk_invitation_status
                                        CHECK (invitation_status IN ('PENDING', 'ACCEPTED', 'DECLINED')),

                                    CONSTRAINT uk_meeting_person
                                        UNIQUE (id_meeting, id_person)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Índices para melhor performance
CREATE INDEX idx_expense_date ON Expense(expense_date);
CREATE INDEX idx_expense_status ON Expense(status);
CREATE INDEX idx_expense_committee ON Expense(id_committee_member);
CREATE INDEX idx_expense_condominium ON Expense(id_condominium);

CREATE INDEX idx_meeting_date ON Meeting(meeting_date);
CREATE INDEX idx_meeting_status ON Meeting(status);
CREATE INDEX idx_meeting_publisher ON Meeting(id_publisher);
CREATE INDEX idx_meeting_condominium ON Meeting(id_condominium);

CREATE INDEX idx_participant_meeting ON MeetingParticipant(id_meeting);
CREATE INDEX idx_participant_person ON MeetingParticipant(id_person);
CREATE INDEX idx_participant_status ON MeetingParticipant(invitation_status);