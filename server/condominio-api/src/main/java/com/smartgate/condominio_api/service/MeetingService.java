package com.smartgate.condominio_api.service;

import com.smartgate.condominio_api.request.MeetingRequest;
import com.smartgate.condominio_api.request.MeetingUpdateRequest;
import com.smartgate.condominio_api.response.MeetingResponse;
import com.smartgate.condominio_api.mapper.MeetingMapper;
import com.smartgate.condominio_api.domain.*;
import com.smartgate.condominio_api.repository.*;
import com.smartgate.condominio_api.utils.InvitationStatus;
import com.smartgate.condominio_api.utils.MeetingStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final MeetingParticipantRepository participantRepository;
    private final PersonRepository personRepository;
    private final CondominiumRepository condominiumRepository;
    private final MeetingMapper meetingMapper;

    public MeetingResponse createMeeting(MeetingRequest request) {
        Person publisher = personRepository.findById(request.getPublisherId())
                .orElseThrow(() -> new RuntimeException("Publicador não encontrado"));

        Condominium condominium = condominiumRepository.findById(request.getCondominiumId())
                .orElseThrow(() -> new RuntimeException("Condomínio não encontrado"));

        Meeting meeting = meetingMapper.toEntity(request);
        meeting.setPublisher(publisher);
        meeting.setCondominium(condominium);
        meeting.setStatus(MeetingStatus.SCHEDULED);

        Meeting saved = meetingRepository.save(meeting);

        // Adicionar participantes
        if (request.getParticipantIds() != null && !request.getParticipantIds().isEmpty()) {
            for (String personId : request.getParticipantIds()) {
                Person person = personRepository.findById(personId)
                        .orElseThrow(() -> new RuntimeException("Pessoa não encontrada: " + personId));

                MeetingParticipant participant = MeetingParticipant.builder()
                        .meeting(saved)
                        .person(person)
                        .invitationStatus(InvitationStatus.PENDING)
                        .build();

                saved.addParticipant(participant);
            }
            saved = meetingRepository.save(saved);
        }

        return enrichMeetingResponse(meetingMapper.toResponse(saved));
    }

    public MeetingResponse updateMeeting(String meetingId, MeetingUpdateRequest request) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Reunião não encontrada"));

        if (meeting.getStatus() != MeetingStatus.SCHEDULED) {
            throw new RuntimeException("Apenas reuniões agendadas podem ser editadas");
        }

        meetingMapper.updateEntityFromRequest(request, meeting);

        Meeting updated = meetingRepository.save(meeting);
        return enrichMeetingResponse(meetingMapper.toResponse(updated));
    }

    @Transactional(readOnly = true)
    public MeetingResponse getMeetingById(String meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Reunião não encontrada"));
        return enrichMeetingResponse(meetingMapper.toResponse(meeting));
    }

    @Transactional(readOnly = true)
    public List<MeetingResponse> getAllMeetings() {
        List<Meeting> meetings = meetingRepository.findAll();
        return meetings.stream()
                .map(meetingMapper::toResponse)
                .map(this::enrichMeetingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MeetingResponse> getMeetingsByCondominium(String condominiumId) {
        List<Meeting> meetings = meetingRepository.findByCondominiumIdCondominium(condominiumId);
        return meetings.stream()
                .map(meetingMapper::toResponse)
                .map(this::enrichMeetingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MeetingResponse> getUpcomingMeetings(String condominiumId) {
        List<Meeting> meetings = meetingRepository.findUpcomingMeetings(condominiumId, LocalDate.now());
        return meetings.stream()
                .map(meetingMapper::toResponse)
                .map(this::enrichMeetingResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MeetingResponse> getMeetingsByStatus(MeetingStatus status) {
        List<Meeting> meetings = meetingRepository.findByStatus(status);
        return meetings.stream()
                .map(meetingMapper::toResponse)
                .map(this::enrichMeetingResponse)
                .toList();
    }

    public void acceptInvitation(String meetingId, String personId) {
        MeetingParticipant participant = participantRepository
                .findByMeetingIdMeetingAndPersonIdPerson(meetingId, personId)
                .orElseThrow(() -> new RuntimeException("Participante não encontrado"));

        participant.accept();
        participantRepository.save(participant);
    }

    public void declineInvitation(String meetingId, String personId) {
        MeetingParticipant participant = participantRepository
                .findByMeetingIdMeetingAndPersonIdPerson(meetingId, personId)
                .orElseThrow(() -> new RuntimeException("Participante não encontrado"));

        participant.decline();
        participantRepository.save(participant);
    }

    public MeetingResponse addParticipants(String meetingId, List<String> personIds) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Reunião não encontrada"));

        if (meeting.getStatus() != MeetingStatus.SCHEDULED) {
            throw new RuntimeException("Apenas reuniões agendadas podem receber novos participantes");
        }

        for (String personId : personIds) {
            // Verificar se já não é participante
            if (participantRepository.findByMeetingIdMeetingAndPersonIdPerson(meetingId, personId).isPresent()) {
                continue;
            }

            Person person = personRepository.findById(personId)
                    .orElseThrow(() -> new RuntimeException("Pessoa não encontrada: " + personId));

            MeetingParticipant participant = MeetingParticipant.builder()
                    .meeting(meeting)
                    .person(person)
                    .invitationStatus(InvitationStatus.PENDING)
                    .build();

            meeting.addParticipant(participant);
        }

        Meeting updated = meetingRepository.save(meeting);
        return enrichMeetingResponse(meetingMapper.toResponse(updated));
    }

    public MeetingResponse cancelMeeting(String meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Reunião não encontrada"));

        if (meeting.getStatus() != MeetingStatus.SCHEDULED) {
            throw new RuntimeException("Apenas reuniões agendadas podem ser canceladas");
        }

        meeting.setStatus(MeetingStatus.CANCELLED);
        Meeting updated = meetingRepository.save(meeting);
        return enrichMeetingResponse(meetingMapper.toResponse(updated));
    }

    public MeetingResponse completeMeeting(String meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Reunião não encontrada"));

        if (meeting.getStatus() != MeetingStatus.SCHEDULED) {
            throw new RuntimeException("Apenas reuniões agendadas podem ser concluídas");
        }

        meeting.setStatus(MeetingStatus.COMPLETED);
        Meeting updated = meetingRepository.save(meeting);
        return enrichMeetingResponse(meetingMapper.toResponse(updated));
    }

    public void deleteMeeting(String meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Reunião não encontrada"));

        if (meeting.getStatus() == MeetingStatus.COMPLETED) {
            throw new RuntimeException("Reuniões concluídas não podem ser excluídas");
        }

        meetingRepository.delete(meeting);
    }

    // Método auxiliar para enriquecer o response com contadores
    private MeetingResponse enrichMeetingResponse(MeetingResponse response) {
        Long accepted = participantRepository.countAcceptedParticipants(response.getIdMeeting());
        Long pending = participantRepository.countPendingParticipants(response.getIdMeeting());
        Long declined = participantRepository.countDeclinedParticipants(response.getIdMeeting());

        response.setTotalAccepted(accepted);
        response.setTotalPending(pending);
        response.setTotalDeclined(declined);

        return response;
    }
}
