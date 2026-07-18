package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.Application;
import org.example.entity.JobPosting;
import org.example.entity.User;
import org.example.enums.ApplicationStatus;
import org.example.enums.JobStatus;
import org.example.repository.ApplicationRepository;
import org.example.repository.JobPostingRepository;
import org.example.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobPostingRepository jobPostingRepository;
    private final UserRepository userRepository;

    public Application applyForJob(Long jobId)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        JobPosting jobPosting = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if(jobPosting.getStatus() != JobStatus.APPROVED)
        {
            throw new RuntimeException("This job is not available");
        }

        if(jobPosting.getApplicationDeadline().isBefore(java.time.LocalDate.now()))
        {
            throw new RuntimeException("Application deadline has passed");
        }

        if(student.getResumeUrl() == null || student.getResumeUrl().isBlank())
        {
            throw new RuntimeException("Please upload your resume before applying");
        }

        if(applicationRepository.findByStudentAndJobPosting(student,jobPosting).isPresent())
        {
            throw new RuntimeException("You have already applied for this job");
        }

        Application application = Application.builder()
                .student(student)
                .jobPosting(jobPosting)
                .status(ApplicationStatus.PENDING)
                .appliedAt(LocalDateTime.now())
                .build();

        return applicationRepository.save(application);
    }

    public List<Application> getMyApplications()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        return applicationRepository.findByStudent(student);
    }

    public List<Application> getApplicants(Long jobId)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User company = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        JobPosting jobPosting = jobPostingRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if(!jobPosting.getCompany().getId().equals(company.getId()))
        {
            throw new RuntimeException("You are not authorized to view applicants for this job");
        }

        return applicationRepository.findByJobPosting(jobPosting);
    }

    public Application updateApplicationStatus(Long applicationId, ApplicationStatus status)
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User company = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Company not found"));

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if(!application.getJobPosting().getCompany().getId().equals(company.getId()))
        {
            throw new RuntimeException("You are not authorized to update this application");
        }

        application.setStatus(status);

        return applicationRepository.save(application);
    }
}