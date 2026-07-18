package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.entity.Application;
import org.example.entity.JobPosting;
import org.example.service.ApplicationService;
import org.example.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;
    private final ApplicationService applicationService;
    @GetMapping("/jobs")
    public ResponseEntity<List<JobPosting>> getApprovedJobs()
    {
        return ResponseEntity.ok(studentService.getApprovedJobs());
    }

    @PostMapping("/upload-resume")
    public ResponseEntity<String> uploadResume(
            @RequestParam("file") MultipartFile file) throws IOException {

        return ResponseEntity.ok(studentService.uploadResume(file));
    }

    @PostMapping("/jobs/{jobId}/apply")
    public ResponseEntity<Application> applyForJob(@PathVariable Long jobId)
    {
        return ResponseEntity.ok(applicationService.applyForJob(jobId));
    }

    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getMyApplications()
    {
        return ResponseEntity.ok(applicationService.getMyApplications());
    }
}