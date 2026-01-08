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

import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
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
                .build();
    }

    // Helper: Chuyển DTO sang Entity để lưu vào Database
    private Event convertToEntity(EventDto dto){
        Event.EventBuilder builder = Event.builder()
                .title(dto.getTitle())
                .date(dto.getDate())
                .time(dto.getTime());
        
        // Chỉ set nếu có giá trị, nếu không Builder.Default trong Entity sẽ tự hoạt động
        if (dto.getColor() != null && !dto.getColor().isEmpty()) {
            builder.color(dto.getColor());
        }
        if (dto.getRecurrence() != null && !dto.getRecurrence().isEmpty()) {
            builder.recurrence(dto.getRecurrence());
        }
        
        return builder
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

        Event saved = eventRepository.save(event);
        log.info("✅ Event '{}' saved successfully for User ID: {}. New Event ID: {}", 
                saved.getTitle(), user.getId(), saved.getId());
        return convertToDto(saved);
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
