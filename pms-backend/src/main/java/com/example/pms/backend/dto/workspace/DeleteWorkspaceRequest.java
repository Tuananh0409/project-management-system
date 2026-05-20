package com.example.pms.backend.dto.workspace;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeleteWorkspaceRequest {

    @NotBlank(message = "Tên xác nhận không được để trống")
    private String confirmName;
}
