package com.smartgate.condominio_api.mapper;

import com.smartgate.condominio_api.response.PersonSummaryResponse;
import com.smartgate.condominio_api.domain.Person;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface PersonMapper {

    PersonSummaryResponse toSummaryResponse(Person person);
}

