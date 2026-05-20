package com.example.pms.backend.exception;

import java.time.Instant;
import java.util.Map;
import lombok.Builder;
import lombok.Value;

@Value
@Builder
public class ApiErrorResponse {

    String code;
    String message;
    Instant timestamp;
    Map<String, String> fieldErrors;
}
