package com.example.pms.backend.repository;

import com.example.pms.backend.entity.WorkspaceMember;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WorkspaceMemberRepository extends JpaRepository<WorkspaceMember, Long> {

    Optional<WorkspaceMember> findByWorkspaceIdAndUserId(Long workspaceId, Long userId);

    boolean existsByWorkspaceIdAndUserId(Long workspaceId, Long userId);

    List<WorkspaceMember> findByWorkspaceId(Long workspaceId);

    @Query("""
            SELECT COUNT(m) FROM WorkspaceMember m
            JOIN m.role r
            WHERE m.workspace.id = :workspaceId AND r.roleName = 'Admin'
            """)
    long countAdminsByWorkspaceId(@Param("workspaceId") Long workspaceId);
}
