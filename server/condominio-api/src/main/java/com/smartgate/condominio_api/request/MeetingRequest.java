package com.smartgate.condominio_api.request;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
    private String name;

    @NotNull(message = "Data é obrigatória")
    @Future(message = "Data deve ser futura")
    private LocalDate meetingDate;

    @NotNull(message = "Hora é obrigatória")
    private LocalTime meetingTime;

    @NotBlank(message = "Local é obrigatório")
    @Size(max = 200, message = "Local deve ter no máximo 200 caracteres")
    private String location;

    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    private String description;

    @NotBlank(message = "Publicador é obrigatório")
    private String publisherId;

    @NotBlank(message = "Condomínio é obrigatório")
    private String condominiumId;

    private List<String> participantIds;
}