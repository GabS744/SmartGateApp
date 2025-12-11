package com.smartgate.condominio_api.request;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingUpdateRequest {

    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String name;

    @Future(message = "Data deve ser futura")
    private LocalDate meetingDate;

    private LocalTime meetingTime;

    @Size(max = 200, message = "Local deve ter no máximo 200 caracteres")
    private String location;

    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    private String description;
}
