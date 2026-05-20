package com.example.pms.backend.repository;

import com.example.pms.backend.entity.WorkspaceRole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkspaceRoleRepository extends JpaRepository<WorkspaceRole, Long> {

    Optional<WorkspaceRole> findByRoleNameIgnoreCase(String roleName);
}
