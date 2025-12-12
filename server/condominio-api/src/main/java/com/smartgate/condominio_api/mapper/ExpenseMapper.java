package com.smartgate.condominio_api.mapper;

import com.smartgate.condominio_api.request.ExpenseRequest;
import com.smartgate.condominio_api.request.ExpenseUpdateRequest;
import com.smartgate.condominio_api.response.ExpenseResponse;
import com.smartgate.condominio_api.domain.Expense;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = "spring",
        uses = {ExpenseCategoryMapper.class, CommitteeMemberMapper.class},
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface ExpenseMapper {

    // CRIAR: Status é ignorado aqui porque definimos manualmente como PENDING no Service
    @Mapping(target = "idExpense", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "committeeMember", ignore = true)
    @Mapping(target = "condominium", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Expense toEntity(ExpenseRequest request);

    @Mapping(target = "category", source = "category")
    @Mapping(target = "committeeMember", source = "committeeMember")
    @Mapping(target = "condominiumId", source = "condominium.idCondominium")
    ExpenseResponse toResponse(Expense expense);

    List<ExpenseResponse> toResponseList(List<Expense> expenses);

    // ATUALIZAR: Removemos o ignore do 'status' para permitir a edição!
    @Mapping(target = "idExpense", ignore = true)
    @Mapping(target = "category", ignore = true) // Ignora pq atualizamos manualmente no Service (busca no banco)
    @Mapping(target = "committeeMember", ignore = true)
    @Mapping(target = "condominium", ignore = true)
    // @Mapping(target = "status", ignore = true) <--- REMOVIDO: Agora o Mapper atualiza o status se vier no JSON
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(ExpenseUpdateRequest request, @MappingTarget Expense expense);
}