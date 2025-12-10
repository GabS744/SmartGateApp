/*
package com.smartgate.condominio_api.service;

import com.smartgate.condominio_api.request.ExpenseCategoryRequest;
import com.smartgate.condominio_api.response.ExpenseCategoryResponse;
import com.smartgate.condominio_api.mapper.ExpenseCategoryMapper;
import com.smartgate.condominio_api.domain.ExpenseCategory;
import com.smartgate.condominio_api.repository.ExpenseCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseCategoryService {

    private final ExpenseCategoryRepository categoryRepository;
    private final ExpenseCategoryMapper categoryMapper;

    public ExpenseCategoryResponse createCategory(ExpenseCategoryRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new RuntimeException("Já existe uma categoria com este nome");
        }

        ExpenseCategory category = categoryMapper.toEntity(request);
        ExpenseCategory saved = categoryRepository.save(category);
        return categoryMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public ExpenseCategoryResponse getCategoryById(String categoryId) {
        ExpenseCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        return categoryMapper.toResponse(category);
    }

    @Transactional(readOnly = true)
    public List<ExpenseCategoryResponse> getAllCategories() {
        List<ExpenseCategory> categories = categoryRepository.findAll();
        return categoryMapper.toResponseList(categories);
    }

    public void deleteCategory(String categoryId) {
        ExpenseCategory category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        categoryRepository.delete(category);
    }
}
*/
