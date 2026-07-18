package org.example.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class MatchRequest {

    @JsonProperty("student_skills")
    private List<String> studentSkills;

    @JsonProperty("job_skills")
    private List<String> jobSkills;

    public MatchRequest() {
    }

    public MatchRequest(List<String> studentSkills, List<String> jobSkills) {
        this.studentSkills = studentSkills;
        this.jobSkills = jobSkills;
    }

    public List<String> getStudentSkills() {
        return studentSkills;
    }

    public void setStudentSkills(List<String> studentSkills) {
        this.studentSkills = studentSkills;
    }

    public List<String> getJobSkills() {
        return jobSkills;
    }

    public void setJobSkills(List<String> jobSkills) {
        this.jobSkills = jobSkills;
    }
}