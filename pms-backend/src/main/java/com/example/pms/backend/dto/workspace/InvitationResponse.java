package com.example.pms.backend.dto.workspace;

import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class InvitationResponse {

    Long id;
    Long workspaceId;
    String workspaceName;
    String email;
    String roleName;
    String status;
    String token;
    Instant expiredAt;
    Instant createdAt;
}
