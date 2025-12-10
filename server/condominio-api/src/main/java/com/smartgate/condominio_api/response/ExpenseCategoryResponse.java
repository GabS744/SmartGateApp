package com.smartgate.condominio_api.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseCategoryResponse {
    private String idCategory;
    private String name;
    private String description;
    private LocalDateTime createdAt;
}
