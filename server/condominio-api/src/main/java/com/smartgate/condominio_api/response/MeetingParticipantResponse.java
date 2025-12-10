package com.smartgate.condominio_api.response;

import com.smartgate.condominio_api.utils.InvitationStatus;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingParticipantResponse {
    private String idMeetingParticipant;
    private PersonSummaryResponse person;
    private InvitationStatus invitationStatus;
    private LocalDateTime invitedAt;
    private LocalDateTime responseAt;
}
