package com.smartgate.condominio_api.repository;

import com.smartgate.condominio_api.domain.Condominium;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CondominiumRepository extends JpaRepository<Condominium, String> {
}
