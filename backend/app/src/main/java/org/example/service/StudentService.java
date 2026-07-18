package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.JobPosting;
import org.example.entity.User;
import org.example.enums.JobStatus;
import org.example.repository.JobPostingRepository;
import org.example.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final JobPostingRepository jobPostingRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;

    public List<JobPosting> getApprovedJobs()
    {
        return jobPostingRepository.findByStatus(JobStatus.APPROVED);
    }

    public String uploadResume(MultipartFile file) throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Resume is required");
        }
        if (!"application/pdf".equals(file.getContentType())) {
            throw new RuntimeException("Only PDF files are allowed");
        }
        String resumeUrl = cloudinaryService.uploadResume(file);
        user.setResumeUrl(resumeUrl);
        userRepository.save(user);

        return resumeUrl;
    }

    public User getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(User profileData) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (profileData.getFullName() != null) {
            user.setFullName(profileData.getFullName());
        }
        if (profileData.getBranch() != null) {
            user.setBranch(profileData.getBranch());
        }
        if (profileData.getBatchYear() != null) {
            user.setBatchYear(profileData.getBatchYear());
        }
        if (profileData.getResumeUrl() != null) {
            user.setResumeUrl(profileData.getResumeUrl());
        }

        return userRepository.save(user);
    }
}