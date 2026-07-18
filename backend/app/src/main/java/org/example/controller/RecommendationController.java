package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.dto.request.RecommendationRequest;
import org.example.dto.response.RecommendationResponse;
import org.example.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/student")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping("/recommendations")
    public ResponseEntity<List<RecommendationResponse>> getRecommendations(@RequestBody RecommendationRequest request) {
        return ResponseEntity.ok(recommendationService.getRecommendations(request));
    }
}