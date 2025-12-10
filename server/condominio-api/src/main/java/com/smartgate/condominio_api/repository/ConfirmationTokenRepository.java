package com.smartgate.condominio_api.repository;

import com.smartgate.condominio_api.domain.ConfirmationToken;
import com.smartgate.condominio_api.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {
    Optional<ConfirmationToken> findByToken(String token);

    Optional<ConfirmationToken> findByUser(User user);
}