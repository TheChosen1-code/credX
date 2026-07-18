package org.example.service;

import org.example.entity.JobPosting;
import org.example.enums.JobStatus;
import org.example.repository.JobPostingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final JobPostingRepository jobPostingRepository;

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
}