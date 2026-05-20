package com.example.pms.backend.repository;

import com.example.pms.backend.entity.Workspace;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

    boolean existsByNameIgnoreCaseAndDeletedFalse(String name);

    boolean existsByNameIgnoreCaseAndDeletedFalseAndIdNot(String name, Long id);

    boolean existsByCodeIgnoreCaseAndDeletedFalse(String code);

    boolean existsBySlugIgnoreCaseAndDeletedFalse(String slug);

    Optional<Workspace> findByIdAndDeletedFalse(Long id);

    @Query("""
            SELECT w FROM Workspace w
            LEFT JOIN FETCH w.owner
            WHERE w.deleted = false
              AND EXISTS (
                  SELECT 1 FROM WorkspaceMember m
                  WHERE m.workspace = w AND m.user.id = :userId
              )
            ORDER BY w.createdAt DESC
            """)
    List<Workspace> findAllAccessibleByUserId(@Param("userId") Long userId);
}
