package com.smartgate.condominio_api.mapper;

import com.smartgate.condominio_api.response.MeetingParticipantResponse;
import com.smartgate.condominio_api.domain.MeetingParticipant;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = "spring",
        uses = {PersonMapper.class}
)
public interface MeetingParticipantMapper {

    @Mapping(target = "person", source = "person")
    MeetingParticipantResponse toResponse(MeetingParticipant participant);

    List<MeetingParticipantResponse> toResponseList(List<MeetingParticipant> participants);
}