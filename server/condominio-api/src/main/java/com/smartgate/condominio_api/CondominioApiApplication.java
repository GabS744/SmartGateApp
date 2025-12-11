package com.smartgate.condominio_api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CondominioApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(CondominioApiApplication.class, args);
    }

}
