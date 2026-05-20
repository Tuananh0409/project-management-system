package com.example.pms.backend.workspace;

/** Giá trị {@code privacy_mode} chuẩn SaaS (tương đương Jira/Asana/Notion). */
public final class WorkspacePrivacy {

    public static final String PRIVATE = "PRIVATE";
    /** Hiển thị trong directory tổ chức; user khác có thể xin tham gia (sau này). */
    public static final String ORG_WIDE = "ORG_WIDE";

    private WorkspacePrivacy() {}

    public static boolean isAllowed(String value) {
        if (value == null || value.isBlank()) {
            return false;
        }
        String v = value.trim();
        return PRIVATE.equalsIgnoreCase(v) || ORG_WIDE.equalsIgnoreCase(v);
    }

    public static String normalizeOrDefault(String value) {
        if (value == null || value.isBlank()) {
            return PRIVATE;
        }
        String v = value.trim();
        if (ORG_WIDE.equalsIgnoreCase(v)) {
            return ORG_WIDE;
        }
        return PRIVATE;
    }
}
