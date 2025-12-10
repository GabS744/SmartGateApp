package com.smartgate.condominio_api.response;

import com.smartgate.condominio_api.utils.MeetingStatus;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingResponse {
    private String idMeeting;
    private String name;
    private LocalDate meetingDate;
    private LocalTime meetingTime;
    private String location;
    private String description;
    private PersonSummaryResponse publisher;
    private String condominiumId;
    private MeetingStatus status;
    private List<MeetingParticipantResponse> participants;
    private Long totalAccepted;
    private Long totalPending;
    private Long totalDeclined;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}