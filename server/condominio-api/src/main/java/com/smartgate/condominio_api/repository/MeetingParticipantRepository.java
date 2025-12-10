package com.smartgate.condominio_api.repository;

import com.smartgate.condominio_api.domain.MeetingParticipant;
import com.smartgate.condominio_api.utils.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingParticipantRepository extends JpaRepository<MeetingParticipant, String> {

    List<MeetingParticipant> findByMeetingIdMeeting(String meetingId);

    List<MeetingParticipant> findByPersonIdPerson(String personId);

    Optional<MeetingParticipant> findByMeetingIdMeetingAndPersonIdPerson(String meetingId, String personId);

    @Query("SELECT mp FROM MeetingParticipant mp WHERE mp.person.idPerson = :personId " +
            "AND mp.invitationStatus = :status")
    List<MeetingParticipant> findByPersonAndStatus(@Param("personId") String personId,
                                                   @Param("status") InvitationStatus status);

    @Query("SELECT COUNT(mp) FROM MeetingParticipant mp WHERE mp.meeting.idMeeting = :meetingId " +
            "AND mp.invitationStatus = 'ACCEPTED'")
    Long countAcceptedParticipants(@Param("meetingId") String meetingId);

    @Query("SELECT COUNT(mp) FROM MeetingParticipant mp WHERE mp.meeting.idMeeting = :meetingId " +
            "AND mp.invitationStatus = 'PENDING'")
    Long countPendingParticipants(@Param("meetingId") String meetingId);

    @Query("SELECT COUNT(mp) FROM MeetingParticipant mp WHERE mp.meeting.idMeeting = :meetingId " +
            "AND mp.invitationStatus = 'DECLINED'")
    Long countDeclinedParticipants(@Param("meetingId") String meetingId);
}