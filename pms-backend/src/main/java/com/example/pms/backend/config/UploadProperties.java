package com.example.pms.backend.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.upload")
@Getter
@Setter
public class UploadProperties {

    /** Thư mục gốc lưu file (local dev; production có thể thay S3). */
    private String storageDir = "uploads";

    /** Tối đa mỗi file — bytes (mặc định 20MB theo FRS task). */
    private long maxFileSizeBytes = 20L * 1024 * 1024;
}
