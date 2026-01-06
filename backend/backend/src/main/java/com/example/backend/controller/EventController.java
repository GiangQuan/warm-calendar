package com.example.backend.controller;

import com.example.backend.dto.EventDto;
import com.example.backend.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin("*")

public class EventController {
    private final EventService eventService;

    @GetMapping
    public ResponseEntity<List<EventDto>> getEventsByUserId(@RequestParam Long userId) {
        return ResponseEntity.ok(eventService.getEventsByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<EventDto> createEvent(@RequestBody EventDto eventDto) {
        return ResponseEntity.ok(eventService.CreateEvent(eventDto));
    }

    @PutMapping
    public ResponseEntity<EventDto> updateEvent(@PathVariable Long id,@RequestBody EventDto eventDto) {
        return ResponseEntity.ok(eventService.updateEvent(id, eventDto));
    }

    @DeleteMapping
    public ResponseEntity<EventDto> deleteEvent(@PathVariable Long id) {
        eventService.DeleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
