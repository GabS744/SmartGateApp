package com.smartgate.condominio_api.service;

import com.smartgate.condominio_api.domain.User;
import com.smartgate.condominio_api.mapper.UserMapper;
import com.smartgate.condominio_api.repository.UserRepository;
import com.smartgate.condominio_api.request.UserRequest;
import com.smartgate.condominio_api.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository repository;
    private final UserMapper mapper;

    public UserResponse create(UserRequest dto) {
        User user = mapper.toEntity(dto);
        return mapper.toUserResponse(repository.save(user));
    }

    public UserResponse findById(Long id) {
        return mapper.toUserResponse(repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found")));
    }

    public List<UserResponse> findAll() {
        return repository.findAll().stream().map(mapper::toUserResponse).toList();
    }

    public UserResponse update(Long id, UserRequest dto) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        // password update = futuro com BCrypt

        return mapper.toUserResponse(repository.save(user));
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
