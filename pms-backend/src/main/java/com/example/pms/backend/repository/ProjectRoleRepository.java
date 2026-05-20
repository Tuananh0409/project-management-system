package com.example.pms.backend.repository;

import com.example.pms.backend.entity.ProjectRole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRoleRepository extends JpaRepository<ProjectRole, Long> {

    Optional<ProjectRole> findByRoleNameIgnoreCase(String roleName);
}
