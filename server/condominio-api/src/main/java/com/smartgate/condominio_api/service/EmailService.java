package com.smartgate.condominio_api.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void send(String to, String emailContent) {
        try {
            System.out.println("🔵 Iniciando envio de e-mail...");
            System.out.println("   FROM: " + senderEmail);
            System.out.println("   TO: " + to);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            helper.setText(emailContent, true);
            helper.setTo(to);
            helper.setSubject("Confirme seu cadastro - SmartGate");
            helper.setFrom(senderEmail);

            System.out.println("📤 Enviando mensagem via SMTP...");
            mailSender.send(mimeMessage);
            
            System.out.println("✅ E-mail enviado com sucesso para: " + to);

        } catch (MessagingException e) {
            System.err.println("❌ ERRO MESSAGING: " + e.getMessage());
            System.err.println("   Classe: " + e.getClass().getName());
            e.printStackTrace();
            throw new IllegalStateException("Falha ao enviar email: " + e.getMessage(), e);
            
        } catch (Exception e) {
            System.err.println("❌ ERRO INESPERADO: " + e.getMessage());
            System.err.println("   Classe: " + e.getClass().getName());
            e.printStackTrace();
            throw new IllegalStateException("Erro inesperado ao enviar email: " + e.getMessage(), e);
        }
    }
}