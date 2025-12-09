package com.smartgate.condominio_api.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String role;
    private Boolean enabled;
    private String createdAt;
}
