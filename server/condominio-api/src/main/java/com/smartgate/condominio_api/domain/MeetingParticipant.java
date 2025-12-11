package com.smartgate.condominio_api.domain;

import com.smartgate.condominio_api.utils.InvitationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "MeetingParticipant")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingParticipant {

    @Id
    @Column(name = "id_meeting_participant", columnDefinition = "CHAR(36)")
    private String idMeetingParticipant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_meeting", nullable = false)
    private Meeting meeting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_person", nullable = false)
    private Person person;

    @Enumerated(EnumType.STRING)
    @Column(name = "invitation_status", nullable = false, length = 20)
    private InvitationStatus invitationStatus = InvitationStatus.PENDING;

    @Column(name = "invited_at", nullable = false, updatable = false)
    private LocalDateTime invitedAt;

    @Column(name = "response_at")
    private LocalDateTime responseAt;

    @PrePersist
    protected void onCreate() {
        if (this.idMeetingParticipant == null) {
            this.idMeetingParticipant = UUID.randomUUID().toString();
        }
        if (this.invitedAt == null) {
            this.invitedAt = LocalDateTime.now();
        }
    }

    // Métodos auxiliares
    public void accept() {
        this.invitationStatus = InvitationStatus.ACCEPTED;
        this.responseAt = LocalDateTime.now();
    }

    public void decline() {
        this.invitationStatus = InvitationStatus.DECLINED;
        this.responseAt = LocalDateTime.now();
    }
}
