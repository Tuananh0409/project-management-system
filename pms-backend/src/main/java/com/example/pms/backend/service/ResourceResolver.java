package com.example.pms.backend.service;

import com.example.pms.backend.entity.Project;
import com.example.pms.backend.entity.Workspace;
import com.example.pms.backend.exception.BusinessException;
import com.example.pms.backend.exception.ErrorCode;
import com.example.pms.backend.repository.ProjectRepository;
import com.example.pms.backend.repository.WorkspaceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/** Resolve workspace/project từ slug URL (không dùng id số trên path). */
@Component
@RequiredArgsConstructor
public class ResourceResolver {

    private final WorkspaceRepository workspaceRepository;
    private final ProjectRepository projectRepository;

    public Workspace resolveWorkspace(String workspaceSlug) {
        if (workspaceSlug == null || workspaceSlug.isBlank()) {
            throw new BusinessException(ErrorCode.WORKSPACE_NOT_FOUND);
        }
        return workspaceRepository
                .findBySlugIgnoreCaseAndDeletedFalse(workspaceSlug.trim())
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_NOT_FOUND));
    }

    public Project resolveProject(String workspaceSlug, String projectSlug) {
        Workspace workspace = resolveWorkspace(workspaceSlug);
        if (projectSlug == null || projectSlug.isBlank()) {
            throw new BusinessException(ErrorCode.PROJECT_NOT_FOUND);
        }
        return projectRepository
                .findBySlugIgnoreCaseAndWorkspaceIdAndDeletedFalse(projectSlug.trim(), workspace.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.PROJECT_NOT_FOUND));
    }
}
