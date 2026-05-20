package com.example.pms.backend.repository;

import com.example.pms.backend.entity.Project;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByWorkspaceIdAndDeletedFalseOrderByNameAsc(Long workspaceId);

    @Query("""
            SELECT COUNT(p) FROM Project p
            JOIN p.status s
            WHERE p.workspace.id = :workspaceId
              AND p.deleted = false
              AND LOWER(s.statusName) = 'active'
            """)
    long countActiveProjectsByWorkspaceId(@Param("workspaceId") Long workspaceId);
}
