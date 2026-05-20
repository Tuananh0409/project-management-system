package com.example.pms.backend.dto.workspace;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateWorkspaceRequest {

    @Size(max = 100, message = "Tên workspace tối đa 100 ký tự")
    private String name;

    private String description;

    private String logoUrl;

    private String privacyMode;

    private String themeColor;

    private String status;

    private String timezone;
}
