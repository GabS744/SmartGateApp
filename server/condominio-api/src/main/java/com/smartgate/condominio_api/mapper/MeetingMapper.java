package com.smartgate.condominio_api.mapper;

import com.smartgate.condominio_api.request.MeetingRequest;
import com.smartgate.condominio_api.request.MeetingUpdateRequest;
import com.smartgate.condominio_api.response.MeetingResponse;
import com.smartgate.condominio_api.domain.Meeting;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = "spring",
        uses = {PersonMapper.class, MeetingParticipantMapper.class},
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface MeetingMapper {

    @Mapping(target = "idMeeting", ignore = true)
    @Mapping(target = "publisher", ignore = true)
    @Mapping(target = "condominium", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Meeting toEntity(MeetingRequest request);

    @Mapping(target = "publisher", source = "publisher")
    @Mapping(target = "condominiumId", source = "condominium.idCondominium")
    @Mapping(target = "participants", source = "participants")
    @Mapping(target = "totalAccepted", ignore = true)
    @Mapping(target = "totalPending", ignore = true)
    @Mapping(target = "totalDeclined", ignore = true)
    MeetingResponse toResponse(Meeting meeting);

    List<MeetingResponse> toResponseList(List<Meeting> meetings);

    @Mapping(target = "idMeeting", ignore = true)
    @Mapping(target = "publisher", ignore = true)
    @Mapping(target = "condominium", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "participants", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromRequest(MeetingUpdateRequest request, @MappingTarget Meeting meeting);
}
