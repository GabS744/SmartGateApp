package com.smartgate.condominio_api.repository;

import com.smartgate.condominio_api.domain.Expense;
import com.smartgate.condominio_api.utils.ExpenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, String> {

    List<Expense> findByCondominiumIdCondominium(String condominiumId);

    List<Expense> findByStatus(ExpenseStatus status);

    List<Expense> findByExpenseDateBetween(LocalDate startDate, LocalDate endDate);

    List<Expense> findByCommitteeMemberIdResident(String committeeMemberId);

    @Query("SELECT e FROM Expense e WHERE e.condominium.idCondominium = :condominiumId AND e.status = :status")
    List<Expense> findByCondominiumAndStatus(@Param("condominiumId") String condominiumId,
                                             @Param("status") ExpenseStatus status);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.condominium.idCondominium = :condominiumId AND e.status = 'PAID'")
    BigDecimal getTotalPaidExpensesByCondominium(@Param("condominiumId") String condominiumId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.condominium.idCondominium = :condominiumId " +
            "AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalExpensesByPeriod(@Param("condominiumId") String condominiumId,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);
}