package com.smartgate.condominio_api.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // Pega o e-mail configurado no application.yml para usar como remetente
    @Value("${spring.mail.username}")
    private String senderEmail;

    // @Async // Executa em uma thread separada para não travar a API
    public void send(String to, String emailContent) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setText(emailContent, true); // true = ativa HTML
            helper.setTo(to);
            helper.setSubject("Confirme seu cadastro - SmartGate");
            helper.setFrom(senderEmail); // Quem está enviando

            mailSender.send(mimeMessage);
            System.out.println("Email enviado com sucesso para: " + to);

        } catch (MessagingException e) {
            // Em produção, use um Logger (Slf4j)
            throw new IllegalStateException("Falha ao enviar email", e);
        }
    }
}