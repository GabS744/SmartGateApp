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
                .dateOfBirth(registerRequest.getDateOfBirth())
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

        System.out.println("Link de confirmação: " + link);

        String emailHtml = """
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
                <p style="font-size: 16px; margin-bottom: 20px; text-align: center;">Olá, <strong>%s</strong>!</p>
            
                <p style="font-size: 14px; line-height: 1.6; margin-bottom: 15px; text-align: center;">
                    Sua conta no <strong>SmartGate</strong> está quase pronta! <br/> Para ativá-la, por favor confirme o seu endereço de email clicando no link abaixo.
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="%s" 
                    style="background-color: #2c3e50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Confirmar meu email
                    </a>
                </div>
                
                <p style="font-size: 14px; line-height: 1.6; margin-bottom: 15px; color: #555; text-align: center;">
                    Sua conta não será ativada até que seu email seja confirmado.
                </p>
                
                <p style="font-size: 13px; line-height: 1.6; margin-bottom: 25px; color: #888; text-align: center;">
                    Se você não se cadastrou no SmartGate recentemente, por favor ignore este email.
                </p>
                
                <p style="font-size: 14px; margin-bottom: 5px; text-align: center;">Atenciosamente,</p>
                <p style="font-size: 14px; font-weight: bold; color: #2c3e50; text-align: center;">Equipe SmartGate</p>
            </div>
            """.formatted(firstName, link);

        emailService.send(user.getEmail(), emailHtml);
    }

    @Transactional
    public void confirmToken(String token, String firstName) {
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

        String emailHtml = """
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd;">
                <p style="font-size: 16px; margin-bottom: 20px; text-align: center;">Olá, <strong>João</strong>!</p>
            
                <p style="font-size: 14px; line-height: 1.6; margin-bottom: 15px; text-align: center;">
                    Sua conta no <strong>SmartGate</strong> foi confirmada com sucesso!
                </p>
                
                <p style="font-size: 14px; line-height: 1.6; margin-bottom: 15px; color: #555555; text-align: center;">
                    Volte para o aplicativo para começar a usá-lo!
                </p>
                
                <p style="font-size: 13px; line-height: 1.6; margin-bottom: 25px; color: #888; text-align: center;">
                    Se você não se cadastrou no SmartGate recentemente, por favor ignore este email.
                </p>
                
                <p style="font-size: 14px; margin-bottom: 5px; text-align: center;">Atenciosamente,</p>
                <p style="font-size: 14px; font-weight: bold; color: #2c3e50; text-align: center;">Equipe SmartGate</p>
            </div>
            """.formatted(firstName);

        emailService.send(user.getEmail(), emailHtml);
    }
}