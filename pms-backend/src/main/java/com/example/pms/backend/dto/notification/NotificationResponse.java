package com.example.pms.backend.dto.notification;

import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class NotificationResponse {

    Long id;
    String type;
    String title;
    String message;
    Instant createdAt;
    boolean actionable;
    String actionStatus;
    WorkspaceInvitationPayload invitation;

    @Value
    @Builder
    public static class WorkspaceInvitationPayload {
        Long invitationId;
        Long workspaceId;
        String workspaceName;
        String inviterName;
        String roleName;
        String token;
        Instant expiredAt;
    }
}
