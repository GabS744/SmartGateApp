package com.smartgate.condominio_api.repository;

import com.smartgate.condominio_api.domain.Contribution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;

@Repository
public interface ContributionRepository extends JpaRepository<Contribution, String> {

    // Soma todas as contribuições (Receita) de um condomínio em um período
    @Query("SELECT SUM(c.amount) FROM Contribution c WHERE c.condominium.idCondominium = :condominiumId " +
            "AND c.paymentDate BETWEEN :startDate AND :endDate")
    BigDecimal getTotalRevenueByPeriod(@Param("condominiumId") String condominiumId,
                                       @Param("startDate") LocalDate startDate,
                                       @Param("endDate") LocalDate endDate);
}