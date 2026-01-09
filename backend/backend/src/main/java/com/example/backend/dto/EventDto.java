package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
    private Long id;
    private String title;
    private LocalDate date;
    private String time;
    private String color;
    private String recurrence;
    private LocalDate endDate;
    private String meetingLink;
    private Long userId;
    private Boolean reminderEnabled;
    private Integer reminderMinutes;
}
