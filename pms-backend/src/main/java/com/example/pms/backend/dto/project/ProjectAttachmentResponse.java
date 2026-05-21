package com.example.pms.backend.dto.project;

import java.time.Instant;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ProjectAttachmentResponse {

    Long id;
    Long projectId;
    String fileName;
    String fileType;
    Long fileSize;
    String uploadedByUsername;
    Instant createdAt;
    String downloadUrl;
}
