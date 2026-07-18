package org.example.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class MatchResponse {

    @JsonProperty("match_score")
    private double matchScore;

    @JsonProperty("matched_skills")
    private List<String> matchedSkills;

    @JsonProperty("missing_skills")
    private List<String> missingSkills;

    public MatchResponse() {
    }

    public MatchResponse(double matchScore, List<String> matchedSkills, List<String> missingSkills) {
        this.matchScore = matchScore;
        this.matchedSkills = matchedSkills;
        this.missingSkills = missingSkills;
    }

    public double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(double matchScore) {
        this.matchScore = matchScore;
    }

    public List<String> getMatchedSkills() {
        return matchedSkills;
    }

    public void setMatchedSkills(List<String> matchedSkills) {
        this.matchedSkills = matchedSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }
}