package com.example.pms.backend.repository;

import com.example.pms.backend.entity.ProjectAttachment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectAttachmentRepository extends JpaRepository<ProjectAttachment, Long> {

    @Query(
            """
            SELECT a FROM ProjectAttachment a
            JOIN FETCH a.uploadedBy
            WHERE a.project.id = :projectId
            ORDER BY a.createdAt DESC
            """)
    List<ProjectAttachment> findByProjectIdWithUploaderOrderByCreatedAtDesc(
            @Param("projectId") Long projectId);

    List<ProjectAttachment> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    Optional<ProjectAttachment> findByIdAndProjectId(Long id, Long projectId);
}
