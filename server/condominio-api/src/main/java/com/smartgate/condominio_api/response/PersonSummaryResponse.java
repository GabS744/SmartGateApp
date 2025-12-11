package com.smartgate.condominio_api.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PersonSummaryResponse {
    private String idPerson;
    private String fullName;
    private String email;
}
