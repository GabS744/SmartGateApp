package com.smartgate.condominio_api.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseCategoryRequest {

    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 50, message = "Nome deve ter no máximo 50 caracteres")
    private String name;

    @Size(max = 200, message = "Descrição deve ter no máximo 200 caracteres")
    private String description;
}
