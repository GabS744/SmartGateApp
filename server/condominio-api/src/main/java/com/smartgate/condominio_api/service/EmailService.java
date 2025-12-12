package com.smartgate.condominio_api.service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public void send(String to, String emailContent) {
        log.info("🔵 [Brevo] A preparar envio para: {}", to);

        try {
            // URL da API v3 da Brevo para envio de emails transacionais
            String url = "https://api.brevo.com/v3/smtp/email";
            RestTemplate restTemplate = new RestTemplate();

            // 1. Configurar Headers (Autenticação e Tipo de Conteúdo)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("api-key", brevoApiKey); // O cabeçalho correto é 'api-key'

            // 2. Montar o Corpo da Requisição (JSON)
            Map<String, Object> body = new HashMap<>();
            
            // Remetente (Sender)
            Map<String, String> sender = new HashMap<>();
            sender.put("name", "SmartGate App");
            sender.put("email", senderEmail);
            body.put("sender", sender);

            // Destinatário (To) - A API espera uma lista
            Map<String, String> toAddress = new HashMap<>();
            toAddress.put("email", to);
            body.put("to", Collections.singletonList(toAddress));

            // Conteúdo (Assunto + HTML)
            body.put("subject", "Confirme o seu cadastro - SmartGate");
            body.put("htmlContent", emailContent);

            // 3. Enviar Requisição HTTP POST
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            // 4. Validar Resposta
            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("✅ [Brevo] E-mail enviado com sucesso! ID da mensagem: {}", response.getBody());
            } else {
                log.error("❌ [Brevo] Falha ao enviar. Status: {}", response.getStatusCode());
                log.error("   Resposta da API: {}", response.getBody());
            }

        } catch (Exception e) {
            log.error("❌ [Brevo] Erro na conexão com a API: {}", e.getMessage());
            e.printStackTrace();
        }
    }
}