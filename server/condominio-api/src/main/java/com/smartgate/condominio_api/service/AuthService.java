package com.smartgate.condominio_api.service;

import com.smartgate.condominio_api.domain.ConfirmationToken;
import com.smartgate.condominio_api.domain.User;
import com.smartgate.condominio_api.exception.InvalidCredentialsException;
import com.smartgate.condominio_api.repository.ConfirmationTokenRepository;
import com.smartgate.condominio_api.repository.UserRepository;
import com.smartgate.condominio_api.request.LoginRequest;
import com.smartgate.condominio_api.request.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final ConfirmationTokenRepository confirmationTokenRepository;
    private final EmailService emailService;

    public String login(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }

        if (!user.isEnabled()) {
            throw new IllegalStateException("Conta não ativada. Por favor, verifique seu e-mail.");
        }

        return jwtService.generateToken(user);
    }

    @Transactional
    public void register(RegisterRequest registerRequest) {

        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new IllegalArgumentException("As senhas não coincidem");
        }

        Optional<User> userOptional = userRepository.findByEmail(registerRequest.getEmail());

        if (userOptional.isPresent()) {

            User existingUser = userOptional.get();

            if (existingUser.isEnabled()) {
                throw new IllegalArgumentException("Email já registrado");
            }

            generateAndSendToken(existingUser, registerRequest.getFirstName());
            return;
        }

        var user = User.builder()
                .fullName(registerRequest.getFirstName() + " " + registerRequest.getLastName())
                .email(registerRequest.getEmail())
                .birthDate(registerRequest.getBirthDate())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .role("USER")
                .enabled(false)
                .build();

        userRepository.save(user);

        generateAndSendToken(user, registerRequest.getFirstName());
    }

    private void generateAndSendToken(User user, String firstName) {
        String tokenUuid = UUID.randomUUID().toString();

        ConfirmationToken token = confirmationTokenRepository.findByUser(user)
                .orElse(new ConfirmationToken());

        token.setToken(tokenUuid);
        token.setCreatedAt(LocalDateTime.now());
        token.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        token.setUser(user);

        confirmationTokenRepository.save(token);

        String link = "http://localhost:8080/v1/auth/confirm?token=" + tokenUuid;

        String emailHtml = """
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
                <h2 style="color: #2c3e50;">Bem-vindo ao SmartGate!</h2>
                <p>Olá, %s.</p>
                <p>Clique no botão abaixo para ativar sua conta:</p>
                <a href="%s" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ativar Conta</a>
                <p style="font-size: 12px; color: #888;">Este link é válido por 15 minutos.</p>
            </div>
            """.formatted(firstName, link);

        emailService.send(user.getEmail(), emailHtml);
    }

    @Transactional
    public String confirmToken(String token) {
        ConfirmationToken confirmationToken = confirmationTokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalStateException("Token não encontrado"));

        if (confirmationToken.getConfirmedAt() != null) {
            throw new IllegalStateException("Email já confirmado");
        }

        LocalDateTime expiredAt = confirmationToken.getExpiresAt();

        if (expiredAt.isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Token expirado");
        }

        confirmationToken.setConfirmedAt(LocalDateTime.now());

        User user = confirmationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        return "Conta confirmada com sucesso!";
    }
}