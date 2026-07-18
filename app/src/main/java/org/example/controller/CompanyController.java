package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.entity.Application;
import org.example.enums.ApplicationStatus;
import org.example.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/company")
@RequiredArgsConstructor
public class CompanyController {

    private final ApplicationService applicationService;

    @GetMapping("/jobs/{jobId}/applications")
    public ResponseEntity<List<Application>> getApplicants(@PathVariable Long jobId)
    {
        return ResponseEntity.ok(applicationService.getApplicants(jobId));
    }

    @PutMapping("/applications/{applicationId}/status")
    public ResponseEntity<Application> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status)
    {
        return ResponseEntity.ok(
                applicationService.updateApplicationStatus(applicationId, status)
        );
    }
}