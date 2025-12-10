package com.smartgate.condominio_api.mapper;

import com.smartgate.condominio_api.request.ExpenseCategoryRequest;
import com.smartgate.condominio_api.response.ExpenseCategoryResponse;
import com.smartgate.condominio_api.domain.ExpenseCategory;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = "spring",
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ExpenseCategoryMapper {

    @Mapping(target = "idCategory", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    ExpenseCategory toEntity(ExpenseCategoryRequest request);

    ExpenseCategoryResponse toResponse(ExpenseCategory category);

    List<ExpenseCategoryResponse> toResponseList(List<ExpenseCategory> categories);
}