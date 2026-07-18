package org.example.service;

import org.example.entity.JobPosting;
import org.example.entity.User;
import org.example.entity.Application;
import org.example.enums.JobStatus;
import org.example.enums.Role;
import org.example.repository.JobPostingRepository;
import org.example.repository.UserRepository;
import org.example.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final JobPostingRepository jobPostingRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;


    public List<JobPosting> getPendingJobs()
    {
        return jobPostingRepository.findByStatus(JobStatus.PENDING);
    }

    public JobPosting approveJob(Long id)
    {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (jobPosting.getStatus() != JobStatus.PENDING) {
            throw new RuntimeException("Only pending jobs can be approved");
        }

        jobPosting.setStatus(JobStatus.APPROVED);

        return jobPostingRepository.save(jobPosting);
    }

    public JobPosting rejectJob(Long id)
    {
        JobPosting jobPosting = jobPostingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (jobPosting.getStatus() != JobStatus.PENDING) {
            throw new RuntimeException("Only pending jobs can be rejected");
        }

        jobPosting.setStatus(JobStatus.REJECTED);

        return jobPostingRepository.save(jobPosting);
    }

    public List<User> getAllCompanies() {
        return userRepository.findByRole(Role.ROLE_COMPANY);
    }

    public List<JobPosting> getAllJobs() {
        return jobPostingRepository.findAll();
    }

    public List<org.example.entity.Application> getAllApplications() {
        return applicationRepository.findAll();
    }
}