package com.example.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name ="events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private LocalDate date;

    private String time;

    @Builder.Default
    @Column(nullable = false)
    private String color = "primary";

    @Builder.Default
    @Column(nullable = false)
    private String recurrence = "none";

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "meeting_link")
    private String meetingLink;

    @Builder.Default
@Column(name = "reminder_enabled")
private Boolean reminderEnabled = true;

@Builder.Default
@Column(name = "reminder_minutes")
private Integer reminderMinutes = 15;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}
