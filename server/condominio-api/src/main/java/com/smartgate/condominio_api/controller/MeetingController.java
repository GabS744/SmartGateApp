package com.smartgate.condominio_api.controller;

import com.smartgate.condominio_api.request.MeetingRequest;
import com.smartgate.condominio_api.request.MeetingUpdateRequest;
import com.smartgate.condominio_api.response.MeetingResponse;
import com.smartgate.condominio_api.service.MeetingService;
import com.smartgate.condominio_api.utils.MeetingStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("v1/meetings")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;

    @PostMapping
    public ResponseEntity<MeetingResponse> create(@RequestBody MeetingRequest request) {
        MeetingResponse response = meetingService.createMeeting(request);
        return ResponseEntity.status(201).body(response);
    }

    @PutMapping("/{meetingId}")
    public ResponseEntity<MeetingResponse> update(
            @PathVariable String meetingId,
            @RequestBody MeetingUpdateRequest request) {
        MeetingResponse response = meetingService.updateMeeting(meetingId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{meetingId}")
    public ResponseEntity<MeetingResponse> getById(@PathVariable String meetingId) {
        return ResponseEntity.ok(meetingService.getMeetingById(meetingId));
    }

    @GetMapping
    public ResponseEntity<List<MeetingResponse>> getAll() {
        return ResponseEntity.ok(meetingService.getAllMeetings());
    }

    @GetMapping("/condominium/{condominiumId}")
    public ResponseEntity<List<MeetingResponse>> getByCondominium(@PathVariable String condominiumId) {
        return ResponseEntity.ok(meetingService.getMeetingsByCondominium(condominiumId));
    }

    @GetMapping("/upcoming/{condominiumId}")
    public ResponseEntity<List<MeetingResponse>> getUpcoming(@PathVariable String condominiumId) {
        return ResponseEntity.ok(meetingService.getUpcomingMeetings(condominiumId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<MeetingResponse>> getByStatus(@PathVariable MeetingStatus status) {
        return ResponseEntity.ok(meetingService.getMeetingsByStatus(status));
    }

    @PostMapping("/{meetingId}/accept/{personId}")
    public ResponseEntity<Void> accept(
            @PathVariable String meetingId,
            @PathVariable String personId) {
        meetingService.acceptInvitation(meetingId, personId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{meetingId}/decline/{personId}")
    public ResponseEntity<Void> decline(
            @PathVariable String meetingId,
            @PathVariable String personId) {
        meetingService.declineInvitation(meetingId, personId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{meetingId}/participants")
    public ResponseEntity<MeetingResponse> addParticipants(
            @PathVariable String meetingId,
            @RequestBody List<String> participantIds) {
        return ResponseEntity.ok(meetingService.addParticipants(meetingId, participantIds));
    }

    @PostMapping("/{meetingId}/cancel")
    public ResponseEntity<MeetingResponse> cancel(@PathVariable String meetingId) {
        return ResponseEntity.ok(meetingService.cancelMeeting(meetingId));
    }

    @PostMapping("/{meetingId}/complete")
    public ResponseEntity<MeetingResponse> complete(@PathVariable String meetingId) {
        return ResponseEntity.ok(meetingService.completeMeeting(meetingId));
    }

    @DeleteMapping("/{meetingId}")
    public ResponseEntity<Void> delete(@PathVariable String meetingId) {
        meetingService.deleteMeeting(meetingId);
        return ResponseEntity.noContent().build();
    }
}
