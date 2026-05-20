package com.example.pms.backend.dto.workspace;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateMemberRoleRequest {

    @NotBlank(message = "Vai trò không được để trống")
    private String roleName;
}
