package com.example.pms.backend.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    WORKSPACE_NAME_EXISTS("ERR_WS_01", "Tên Workspace đã tồn tại", HttpStatus.CONFLICT),
    WORKSPACE_NOT_FOUND("ERR_WS_03", "Workspace không tồn tại", HttpStatus.NOT_FOUND),
    WORKSPACE_FORBIDDEN("ERR_WS_04", "Bạn không có quyền thực hiện thao tác này", HttpStatus.FORBIDDEN),
    WORKSPACE_DELETE_NAME_MISMATCH("ERR_WS_05", "Tên xác nhận không khớp", HttpStatus.BAD_REQUEST),
    WORKSPACE_HAS_ACTIVE_PROJECTS("ERR_WS_06", "Vẫn còn dự án đang hoạt động, không thể xóa", HttpStatus.CONFLICT),
    MEMBER_ALREADY_EXISTS("ERR_WS_07", "Người dùng đã là thành viên trong Workspace này", HttpStatus.CONFLICT),
    INVITE_EMAIL_NOT_FOUND("ERR_WS_08", "Email không tồn tại trong hệ thống", HttpStatus.BAD_REQUEST),
    WORKSPACE_MIN_ONE_ADMIN("ERR_WS_09", "Workspace phải có ít nhất một quản trị viên", HttpStatus.CONFLICT),
    INVITATION_INVALID("ERR_WS_10", "Lời mời đã hết hạn hoặc đã bị hủy", HttpStatus.BAD_REQUEST),
    INVITATION_WORKSPACE_GONE("ERR_WS_11", "Workspace này đã bị xóa hoặc không tồn tại", HttpStatus.GONE),
    LAST_ADMIN_CANNOT_LEAVE("ERR_WS_12", "Admin duy nhất không thể rời khỏi Workspace", HttpStatus.CONFLICT),
    EMAIL_ALREADY_EXISTS("ERR_US_01", "Email đã tồn tại trong hệ thống", HttpStatus.CONFLICT),
    WEAK_PASSWORD("ERR_US_02", "Mật khẩu không đủ độ mạnh", HttpStatus.BAD_REQUEST),
    INVALID_CREDENTIALS("ERR_US_03", "Sai thông tin đăng nhập", HttpStatus.UNAUTHORIZED),
    ACCOUNT_LOCKED("ERR_US_04", "Tài khoản đã bị khóa", HttpStatus.FORBIDDEN),
    PASSWORD_MISMATCH("ERR_US_09", "Mật khẩu xác nhận không khớp", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND("ERR_US_11", "Người dùng không tồn tại", HttpStatus.NOT_FOUND),
    VALIDATION_ERROR("ERR_VALIDATION", "Dữ liệu không hợp lệ", HttpStatus.BAD_REQUEST);

    private final String code;
    private final String defaultMessage;
    private final HttpStatus status;
}
