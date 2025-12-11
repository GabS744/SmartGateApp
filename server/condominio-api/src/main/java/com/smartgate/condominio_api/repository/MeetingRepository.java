package com.smartgate.condominio_api.repository;

import com.smartgate.condominio_api.domain.Meeting;
import com.smartgate.condominio_api.utils.MeetingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MeetingRepository extends JpaRepository<Meeting, String> {

    List<Meeting> findByCondominiumIdCondominium(String condominiumId);

    List<Meeting> findByStatus(MeetingStatus status);

    List<Meeting> findByMeetingDateBetween(LocalDate startDate, LocalDate endDate);

    List<Meeting> findByPublisherIdPerson(String publisherId);

    @Query("SELECT m FROM Meeting m WHERE m.condominium.idCondominium = :condominiumId " +
            "AND m.meetingDate >= :currentDate ORDER BY m.meetingDate ASC")
    List<Meeting> findUpcomingMeetings(@Param("condominiumId") String condominiumId,
                                       @Param("currentDate") LocalDate currentDate);

    @Query("SELECT m FROM Meeting m WHERE m.condominium.idCondominium = :condominiumId " +
            "AND m.status = :status ORDER BY m.meetingDate DESC")
    List<Meeting> findByCondominiumAndStatus(@Param("condominiumId") String condominiumId,
                                             @Param("status") MeetingStatus status);
}