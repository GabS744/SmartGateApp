package com.smartgate.condominio_api.controller;

import com.smartgate.condominio_api.request.UserRequest;
import com.smartgate.condominio_api.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("v1/user")
@RequiredArgsConstructor
public class UserController {
    private final UserService SERVICE;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Object create(@Valid @RequestBody UserRequest dto) {
        return SERVICE.create(dto);
    }

    @GetMapping("/{id}")
    public Object findById(@PathVariable Long id) {
        return SERVICE.findById(id);
    }

    @GetMapping
    public Object findAll() {
        return SERVICE.findAll();
    }

    @PutMapping("/{id}")
    public Object update(@PathVariable Long id, @Valid @RequestBody UserRequest dto) {
        return SERVICE.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        SERVICE.delete(id);
    }
}
