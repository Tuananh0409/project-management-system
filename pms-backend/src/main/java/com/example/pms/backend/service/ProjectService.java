package com.example.pms.backend.service;

import com.example.pms.backend.dto.project.ProjectSummaryResponse;
import com.example.pms.backend.entity.User;
import com.example.pms.backend.exception.BusinessException;
import com.example.pms.backend.exception.ErrorCode;
import com.example.pms.backend.repository.ProjectRepository;
import com.example.pms.backend.repository.WorkspaceMemberRepository;
import com.example.pms.backend.repository.WorkspaceRepository;
import com.example.pms.backend.security.CurrentUserProvider;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final CurrentUserProvider currentUserProvider;

    @Transactional(readOnly = true)
    public List<ProjectSummaryResponse> listByWorkspace(Long workspaceId) {
        User currentUser = currentUserProvider.getCurrentUser();
        workspaceRepository
                .findByIdAndDeletedFalse(workspaceId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_NOT_FOUND));

        if (!workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, currentUser.getId())) {
            throw new BusinessException(ErrorCode.WORKSPACE_FORBIDDEN);
        }

        return projectRepository.findByWorkspaceIdAndDeletedFalseOrderByNameAsc(workspaceId).stream()
                .map(project -> ProjectSummaryResponse.builder()
                        .id(project.getId())
                        .name(project.getName())
                        .code(project.getCode())
                        .slug(project.getSlug())
                        .colorCode(project.getColorCode())
                        .workspaceId(workspaceId)
                        .build())
                .toList();
    }
}
