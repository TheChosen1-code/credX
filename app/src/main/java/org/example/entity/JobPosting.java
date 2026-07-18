package org.example.entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import org.example.enums.JobStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPosting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    private String packageOffered;

    private Double minimumCgpa;

    private LocalDate applicationDeadline;

    @Enumerated(EnumType.STRING)
    private JobStatus status;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private User company;
}