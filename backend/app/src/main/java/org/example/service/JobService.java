package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.request.CreateJobRequest;
import org.example.dto.response.JobResponse;
import org.example.entity.JobPosting;
import org.example.entity.User;
import org.example.enums.JobStatus;
import org.example.repository.JobPostingRepository;
import org.example.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobPostingRepository jobPostingRepository;
    private final UserRepository userRepository;

    public JobResponse createJob(CreateJobRequest request)
    {
        Authentication authentication = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String username = authentication.getName();

        User company = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        JobPosting jobPosting = JobPosting.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .packageOffered(request.getPackageOffered())
                .minimumCgpa(request.getMinimumCgpa())
                .applicationDeadline(request.getApplicationDeadline())
                .status(JobStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .company(company)
                .skills(request.getSkills())
                .build();

        JobPosting savedJob = jobPostingRepository.save(jobPosting);

        return JobResponse.builder()
                .id(savedJob.getId())
                .title(savedJob.getTitle())
                .description(savedJob.getDescription())
                .location(savedJob.getLocation())
                .packageOffered(savedJob.getPackageOffered())
                .minimumCgpa(savedJob.getMinimumCgpa())
                .applicationDeadline(savedJob.getApplicationDeadline())
                .status(savedJob.getStatus())
                .skills(savedJob.getSkills())
                .createdAt(savedJob.getCreatedAt())
                .companyName(savedJob.getCompany().getCompanyName())
                .website(savedJob.getCompany().getWebsite())

                .build();
    }
}