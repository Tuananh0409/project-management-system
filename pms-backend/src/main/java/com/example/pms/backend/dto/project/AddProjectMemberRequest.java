package com.example.pms.backend.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddProjectMemberRequest {

    @NotNull(message = "userId không được để trống")
    private Long userId;

    @NotBlank(message = "Vai trò không được để trống")
    private String roleName;
}
