package org.example.repository;

import org.example.entity.Application;
import org.example.entity.JobPosting;
import org.example.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    Optional<Application> findByStudentAndJobPosting(User student, JobPosting jobPosting);

    List<Application> findByStudent(User student);

    List<Application> findByJobPosting(JobPosting jobPosting);

    List<Application> findByJobPostingCompany(User company);
}