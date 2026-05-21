package com.example.pms.backend.repository;

import com.example.pms.backend.entity.ProjectMember;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);

    List<ProjectMember> findByProjectIdOrderByJoinedAtAsc(Long projectId);

    @Query("""
            SELECT COUNT(pm) FROM ProjectMember pm
            JOIN pm.role r
            WHERE pm.project.id = :projectId AND LOWER(r.roleName) = 'pm'
            """)
    long countPmByProjectId(@Param("projectId") Long projectId);
}
