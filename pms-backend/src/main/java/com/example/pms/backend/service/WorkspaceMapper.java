package com.example.pms.backend.service;

import com.example.pms.backend.dto.workspace.InvitationResponse;
import com.example.pms.backend.dto.workspace.MemberResponse;
import com.example.pms.backend.dto.workspace.WorkspaceResponse;
import com.example.pms.backend.entity.User;
import com.example.pms.backend.entity.Workspace;
import com.example.pms.backend.entity.WorkspaceInvitation;
import com.example.pms.backend.entity.WorkspaceMember;
import org.springframework.stereotype.Component;

@Component
public class WorkspaceMapper {

    public WorkspaceResponse toResponse(Workspace workspace, String myRole) {
        User owner = workspace.getOwner();
        return WorkspaceResponse.builder()
                .id(workspace.getId())
                .name(workspace.getName())
                .description(workspace.getDescription())
                .code(workspace.getCode())
                .slug(workspace.getSlug())
                .logoUrl(resolveLogoUrlForClient(workspace))
                .ownerId(owner.getId())
                .ownerUsername(owner.getUsername())
                .privacyMode(workspace.getPrivacyMode())
                .themeColor(workspace.getThemeColor())
                .status(workspace.getStatus())
                .timezone(workspace.getTimezone())
                .myRole(myRole)
                .createdAt(workspace.getCreatedAt())
                .updatedAt(workspace.getUpdatedAt())
                .build();
    }

    public MemberResponse toMemberResponse(WorkspaceMember member) {
        User user = member.getUser();
        return MemberResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .roleName(member.getRole().getRoleName())
                .joinedAt(member.getJoinedAt())
                .build();
    }

    /** URL logo cho client: API upload hoặc https legacy. */
    public String resolveLogoUrlForClient(Workspace workspace) {
        String raw = workspace.getLogoUrl();
        if (raw == null || raw.isBlank()) {
            return null;
        }
        if (raw.startsWith("/api/workspaces/") || raw.startsWith("http://") || raw.startsWith("https://")) {
            return raw;
        }
        return WorkspaceLogoService.buildLogoApiPath(workspace.getSlug());
    }

    public InvitationResponse toInvitationResponse(WorkspaceInvitation invitation) {
        return InvitationResponse.builder()
                .id(invitation.getId())
                .workspaceId(invitation.getWorkspace().getId())
                .workspaceName(invitation.getWorkspace().getName())
                .email(invitation.getEmail())
                .roleName(invitation.getRole().getRoleName())
                .status(invitation.getStatus())
                .token(invitation.getToken())
                .expiredAt(invitation.getExpiredAt())
                .createdAt(invitation.getCreatedAt())
                .build();
    }
}
