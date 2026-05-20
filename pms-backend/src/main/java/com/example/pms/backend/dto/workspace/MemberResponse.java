package com.example.pms.backend.dto.workspace;

import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class MemberResponse {

    Long userId;
    String email;
    String username;
    String roleName;
    Instant joinedAt;
}
