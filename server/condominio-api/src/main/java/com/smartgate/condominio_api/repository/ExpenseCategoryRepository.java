package com.smartgate.condominio_api.repository;

import com.smartgate.condominio_api.domain.ExpenseCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ExpenseCategoryRepository extends JpaRepository<ExpenseCategory, String> {
    Optional<ExpenseCategory> findByName(String name);
    boolean existsByName(String name);
}
