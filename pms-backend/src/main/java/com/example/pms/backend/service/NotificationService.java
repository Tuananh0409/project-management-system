package com.example.pms.backend.service;

import com.example.pms.backend.dto.notification.NotificationResponse;
import com.example.pms.backend.entity.User;
import com.example.pms.backend.repository.WorkspaceInvitationRepository;
import com.example.pms.backend.security.CurrentUserProvider;
import java.time.Instant;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final String STATUS_PENDING = "pending";
    private static final String TYPE_WORKSPACE_INVITATION = "WORKSPACE_INVITATION";

    private final WorkspaceInvitationRepository workspaceInvitationRepository;
    private final CurrentUserProvider currentUserProvider;

    @Transactional(readOnly = true)
    public List<NotificationResponse> listMine() {
        User currentUser = currentUserProvider.getCurrentUser();
        Instant now = Instant.now();

        return workspaceInvitationRepository
                .findPendingWithDetailsByEmail(currentUser.getEmail(), STATUS_PENDING)
                .stream()
                .filter(invitation -> !invitation.getWorkspace().getDeleted())
                .filter(invitation -> invitation.getExpiredAt() == null || invitation.getExpiredAt().isAfter(now))
                .map(invitation -> NotificationResponse.builder()
                        .id(invitation.getId())
                        .type(TYPE_WORKSPACE_INVITATION)
                        .title("Lời mời vào workspace")
                        .message("Bạn được mời vào \"" + invitation.getWorkspace().getName() + "\" với vai trò "
                                + invitation.getRole().getRoleName())
                        .createdAt(invitation.getCreatedAt())
                        .actionable(true)
                        .actionStatus("PENDING")
                        .invitation(NotificationResponse.WorkspaceInvitationPayload.builder()
                                .invitationId(invitation.getId())
                                .workspaceId(invitation.getWorkspace().getId())
                                .workspaceName(invitation.getWorkspace().getName())
                                .inviterName(invitation.getInviter().getUsername())
                                .roleName(invitation.getRole().getRoleName())
                                .token(invitation.getToken())
                                .expiredAt(invitation.getExpiredAt())
                                .build())
                        .build())
                .toList();
    }
}
