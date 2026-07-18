package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.entity.JobPosting;
import org.example.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/jobs/pending")
    public ResponseEntity<List<JobPosting>> getPendingJobs()
    {
        return ResponseEntity.ok(adminService.getPendingJobs());
    }

    @PutMapping("/jobs/{id}/approve")
    public ResponseEntity<JobPosting> approveJob(@PathVariable Long id)
    {
        return ResponseEntity.ok(adminService.approveJob(id));
    }

    @PutMapping("/jobs/{id}/reject")
    public ResponseEntity<JobPosting> rejectJob(@PathVariable Long id)
    {
        return ResponseEntity.ok(adminService.rejectJob(id));
    }
}