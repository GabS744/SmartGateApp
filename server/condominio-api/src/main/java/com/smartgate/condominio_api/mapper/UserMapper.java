package com.smartgate.condominio_api.mapper;

import com.smartgate.condominio_api.domain.User;
import com.smartgate.condominio_api.request.UserRequest;
import com.smartgate.condominio_api.response.UserResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "passwordHash", source = "password")
    @Mapping(target = "role", constant = "USER")
    @Mapping(target = "enabled", constant = "true")
    User toEntity(UserRequest dto);

    UserResponse toUserResponse(User user);
}
