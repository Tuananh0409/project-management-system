package com.example.pms.backend.dto.project;

import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ProjectMemberResponse {

    Long userId;
    String username;
    String email;
    String roleName;
    Instant joinedAt;
}
