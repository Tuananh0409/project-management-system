package com.example.pms.backend.dto.project;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProjectMemberRoleRequest {

    @NotBlank(message = "Vai trò không được để trống")
    private String roleName;
}
