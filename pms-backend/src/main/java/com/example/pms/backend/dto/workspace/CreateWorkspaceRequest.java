package com.example.pms.backend.dto.workspace;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateWorkspaceRequest {

    @NotBlank(message = "Tên workspace không được để trống")
    @Size(max = 100, message = "Tên workspace tối đa 100 ký tự")
    private String name;

    private String description;

    @Size(max = 50, message = "Mã workspace tối đa 50 ký tự")
    private String code;

    @Size(max = 150, message = "Slug tối đa 150 ký tự")
    private String slug;

    /** URL https — logo workspace (chuẩn Jira/Notion). */
    @Size(max = 500, message = "URL logo tối đa 500 ký tự")
    private String logoUrl;

    /** PRIVATE | ORG_WIDE */
    @Size(max = 20)
    private String privacyMode;

    /** #RGB hoặc #RRGGBB */
    @Size(max = 20)
    private String themeColor;

    /** IANA, ví dụ Asia/Ho_Chi_Minh */
    @Size(max = 64)
    private String timezone;
}
