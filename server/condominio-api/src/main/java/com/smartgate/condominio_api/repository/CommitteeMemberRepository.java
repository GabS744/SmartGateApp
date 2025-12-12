package com.smartgate.condominio_api.repository;

import com.smartgate.condominio_api.domain.CommitteeMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommitteeMemberRepository extends JpaRepository<CommitteeMember, String> {

}