package com.smartgate.condominio_api.repository;

import com.smartgate.condominio_api.domain.Expense;
// import com.smartgate.condominio_api.utils.ExpenseStatus; // REMOVA ou COMENTE esta linha
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

    // MUDANÇA 1: Recebe String agora
    List<Expense> findByStatus(String status);

    List<Expense> findByExpenseDateBetween(LocalDate startDate, LocalDate endDate);

    List<Expense> findByCommitteeMemberIdResident(String committeeMemberId);

    List<Expense> findByCondominiumIdCondominiumAndCategoryIdCategory(String condominiumId, String categoryId);

    // MUDANÇA 2: Recebe String no parâmetro
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.condominium.idCondominium = :condominiumId AND e.status = :status")
    BigDecimal getTotalExpensesByStatus(@Param("condominiumId") String condominiumId,
                                        @Param("status") String status);

    // MUDANÇA 3: Recebe String no parâmetro
    @Query("SELECT e FROM Expense e WHERE e.condominium.idCondominium = :condominiumId AND e.status = :status")
    List<Expense> findByCondominiumAndStatus(@Param("condominiumId") String condominiumId,
                                             @Param("status") String status);

    // MUDANÇA 4 (CRÍTICA): Mudamos 'PAID' para 'Pago'.
    // Isso é necessário porque no banco agora estará escrito literalmente "Pago".
    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.condominium.idCondominium = :condominiumId AND e.status = 'Pago'")
    BigDecimal getTotalPaidExpensesByCondominium(@Param("condominiumId") String condominiumId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.condominium.idCondominium = :condominiumId " +
            "AND e.expenseDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalExpensesByPeriod(@Param("condominiumId") String condominiumId,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);
}