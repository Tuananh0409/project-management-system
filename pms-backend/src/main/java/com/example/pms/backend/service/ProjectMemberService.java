package com.example.pms.backend.service;

import com.example.pms.backend.entity.Project;
import com.example.pms.backend.entity.ProjectMember;
import com.example.pms.backend.entity.ProjectRole;
import com.example.pms.backend.entity.User;
import com.example.pms.backend.exception.BusinessException;
import com.example.pms.backend.exception.ErrorCode;
import com.example.pms.backend.repository.ProjectMemberRepository;
import com.example.pms.backend.repository.ProjectRoleRepository;
import com.example.pms.backend.repository.WorkspaceMemberRepository;
import java.time.Instant;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Project member helpers — {@code joined_at} is set when adding a member (ERD + FRS aligned).
 * Use from Project APIs when that module is implemented.
 */
@Service
@RequiredArgsConstructor
public class ProjectMemberService {

    private final ProjectMemberRepository projectMemberRepository;
    private final ProjectRoleRepository projectRoleRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;

    @Transactional
    public ProjectMember addMember(Project project, User user, String roleName) {
        Long workspaceId = project.getWorkspace().getId();
        if (!workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, user.getId())) {
            throw new BusinessException(
                    ErrorCode.WORKSPACE_FORBIDDEN, "User chưa tham gia workspace của dự án này");
        }

        if (projectMemberRepository.findByProjectIdAndUserId(project.getId(), user.getId()).isPresent()) {
            throw new BusinessException(ErrorCode.MEMBER_ALREADY_EXISTS, "User đã là thành viên dự án");
        }

        ProjectRole role = projectRoleRepository
                .findByRoleNameIgnoreCase(roleName.trim())
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.VALIDATION_ERROR, "Vai trò project không hợp lệ: " + roleName));

        return projectMemberRepository.save(ProjectMember.builder()
                .project(project)
                .user(user)
                .role(role)
                .joinedAt(Instant.now())
                .build());
    }
}
