package com.smartgate.condominio_api.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@Builder
public class UserResponse {
    private UUID id;
    private String fullName;
    private String email;
    private String role;
    private Boolean enabled;
    private String createdAt;
}
