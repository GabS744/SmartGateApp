package com.smartgate.condominio_api.service;

import com.smartgate.condominio_api.domain.User;
import com.smartgate.condominio_api.exception.UserNotFoundException;
import com.smartgate.condominio_api.mapper.UserMapper;
import com.smartgate.condominio_api.repository.UserRepository;
import com.smartgate.condominio_api.request.UserRequest;
import com.smartgate.condominio_api.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final UserMapper mapper;
    private final BCryptPasswordEncoder passwordEncoder;

    public UserResponse create(UserRequest dto) {
        User user = mapper.toEntity(dto);
        user.setCreatedAt(LocalDateTime.now());
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return mapper.toUserResponse(repository.save(user));
    }

    public UserResponse findById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        return mapper.toUserResponse(user);
    }

    public List<UserResponse> findAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toUserResponse)
                .toList();
    }

    public UserResponse update(Long id, UserRequest dto) {
        User user = repository.findById(id)
                .orElseThrow(() -> new UserNotFoundException(id));

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());

        return mapper.toUserResponse(repository.save(user));
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new UserNotFoundException(id);
        }
        repository.deleteById(id);
    }

}
