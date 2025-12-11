package com.smartgate.condominio_api.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommitteeMemberSummaryResponse {
    private String idResident;
    private String personName;
    private String position;
}