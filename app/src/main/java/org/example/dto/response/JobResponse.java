package org.example.dto.response;

import org.example.enums.JobStatus;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobResponse {

    private Long id;

    private String title;

    private String description;

    private String location;

    private String packageOffered;

    private Double minimumCgpa;

    private LocalDate applicationDeadline;

    private JobStatus status;

    private LocalDateTime createdAt;

    private String companyName;

    private String website;
}