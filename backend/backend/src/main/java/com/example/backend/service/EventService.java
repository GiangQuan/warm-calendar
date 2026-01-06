package com.example.backend.service;

import com.example.backend.dto.EventDto;
import com.example.backend.model.Event;
import com.example.backend.model.User;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    public List<EventDto> getEventsByUserId(Long userId) {
        return eventRepository.findByUserIdOrderByDateAsc(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    // Helper: Chuyển Entity sang DTO để gửi về Frontend
    private EventDto convertToDto(Event event){
        return EventDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .date(event.getDate())
                .time(event.getTime())
                .color(event.getColor())
                .recurrence(event.getRecurrence())
                .endDate(event.getEndDate())
                .meetingLink(event.getMeetingLink())
                .userId(event.getUser().getId())
                .build();
    }

    // Helper: Chuyển DTO sang Entity để lưu vào Database
    private Event convertToEntity(EventDto dto){
        return Event.builder()
                .title(dto.getTitle())
                .date(dto.getDate())
                .time(dto.getTime())
                .color(dto.getColor())
                .recurrence(dto.getRecurrence())
                .endDate(dto.getEndDate())
                .meetingLink(dto.getMeetingLink())
                .build();
    }

    public void DeleteEvent(Long id){
        eventRepository.deleteById(id);
    }

    public EventDto CreateEvent(EventDto dto){
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = convertToEntity(dto);
        event.setUser(user);

        return convertToDto(eventRepository.save(event));
    }

    public EventDto updateEvent(Long id, EventDto dto) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        event.setTitle(dto.getTitle());
        event.setDate(dto.getDate());
        event.setTime(dto.getTime());
        event.setColor(dto.getColor());
        event.setRecurrence(dto.getRecurrence());
        event.setEndDate(dto.getEndDate());
        event.setMeetingLink(dto.getMeetingLink());

        return convertToDto(eventRepository.save(event));
    }

}
