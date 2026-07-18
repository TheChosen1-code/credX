package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.dto.request.MatchRequest;
import org.example.dto.request.RecommendationRequest;
import org.example.dto.response.JobResponse;
import org.example.dto.response.MatchResponse;
import org.example.dto.response.RecommendationResponse;
import org.example.entity.JobPosting;
import org.example.entity.User;
import org.example.enums.JobStatus;
import org.example.enums.Role;
import org.example.repository.JobPostingRepository;
import org.example.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final JobPostingRepository jobPostingRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;

    public List<RecommendationResponse> getRecommendations(RecommendationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.ROLE_STUDENT) {
            throw new RuntimeException("Only students can access recommendations");
        }

        List<JobPosting> approvedJobs = jobPostingRepository.findByStatus(JobStatus.APPROVED);
        List<RecommendationResponse> recommendations = new ArrayList<>();

        for (JobPosting job : approvedJobs) {
            List<String> jobSkills = job.getSkills() != null
                    ? Arrays.stream(job.getSkills().split(","))
                            .map(String::trim)
                            .filter(s -> !s.isEmpty())
                            .toList()
                    : List.of();

            MatchRequest matchRequest = new MatchRequest(request.getSkills(), jobSkills);
            MatchResponse matchResponse = restTemplate.postForObject("http://127.0.0.1:8000/match", matchRequest, MatchResponse.class);

            if (matchResponse != null) {
                JobResponse jobResponse = JobResponse.builder()
                        .id(job.getId())
                        .title(job.getTitle())
                        .description(job.getDescription())
                        .location(job.getLocation())
                        .packageOffered(job.getPackageOffered())
                        .minimumCgpa(job.getMinimumCgpa())
                        .skills(job.getSkills())
                        .applicationDeadline(job.getApplicationDeadline())
                        .status(job.getStatus())
                        .createdAt(job.getCreatedAt())
                        .companyName(job.getCompany() != null ? job.getCompany().getCompanyName() : null)
                        .website(job.getCompany() != null ? job.getCompany().getWebsite() : null)
                        .build();

                recommendations.add(RecommendationResponse.builder()
                        .job(jobResponse)
                        .matchScore(matchResponse.getMatchScore())
                        .build());
            }
        }

        recommendations.sort((r1, r2) -> Double.compare(r2.getMatchScore(), r1.getMatchScore()));

        return recommendations.stream().limit(5).toList();
    }
}
