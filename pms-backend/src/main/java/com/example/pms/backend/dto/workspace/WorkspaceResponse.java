package com.example.pms.backend.dto.workspace;

import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class WorkspaceResponse {

    Long id;
    String name;
    String description;
    String code;
    String slug;
    String logoUrl;
    Long ownerId;
    String ownerUsername;
    String privacyMode;
    String themeColor;
    String status;
    String timezone;
    String myRole;
    Instant createdAt;
    Instant updatedAt;
}
