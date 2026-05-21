package com.example.pms.backend.dto.project;

import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ProjectResponse {

    Long id;
    Long workspaceId;
    String name;
    String code;
    String slug;
    String description;
    String statusName;
    String statusColorCode;
    String colorCode;
    String privacyMode;
    Instant startDate;
    Instant endDate;
    Long projectLeadUserId;
    String projectManagerUsername;
    String myRole;
    Instant createdAt;
    Instant updatedAt;
}
