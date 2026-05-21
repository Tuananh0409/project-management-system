package com.example.pms.backend.repository;

import com.example.pms.backend.entity.ProjectStatus;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectStatusRepository extends JpaRepository<ProjectStatus, Long> {

    Optional<ProjectStatus> findByStatusNameIgnoreCase(String statusName);
}
