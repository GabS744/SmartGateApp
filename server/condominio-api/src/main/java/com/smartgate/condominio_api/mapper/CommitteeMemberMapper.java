package com.smartgate.condominio_api.mapper;

import com.smartgate.condominio_api.response.CommitteeMemberSummaryResponse;
import com.smartgate.condominio_api.domain.CommitteeMember;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CommitteeMemberMapper {

    @Mapping(target = "personName", source = "resident.person.fullName")
    CommitteeMemberSummaryResponse toSummaryResponse(CommitteeMember committeeMember);
}
