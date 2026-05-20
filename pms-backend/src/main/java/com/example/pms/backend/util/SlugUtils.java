package com.example.pms.backend.util;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

public final class SlugUtils {

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    /** Bỏ tiền tố kiểu tổ chức ở đầu tên phòng ban (đã chuẩn hóa ASCII, chữ thường). */
    private static final Pattern DEPT_PREFIX = Pattern.compile(
            "^(phong|ban|bo\\s+phan|khoi|trung\\s+tam|division|department)\\s+",
            Pattern.CASE_INSENSITIVE);

    private SlugUtils() {}

    /**
     * Mã ngắn gắn với phòng ban: bỏ "Phòng/Ban/...", lấy chữ cái đầu các từ có nghĩa hoặc từ viết tắt ngắn.
     * Ví dụ: "Phòng IT" → {@code IT}, "Phòng Kinh doanh" → {@code KD},
     * "Phòng Công nghệ thông tin" → {@code CNTT}.
     */
    public static String toDepartmentCode(String input) {
        if (input == null || input.isBlank()) {
            return "PB";
        }
        String ascii = toAsciiLowerWords(input.trim());
        String remainder = DEPT_PREFIX.matcher(ascii).replaceFirst("").trim();
        if (remainder.isBlank()) {
            remainder = ascii;
        }

        List<String> parts = new ArrayList<>();
        for (String raw : remainder.split("[\\s\\-_.]+")) {
            if (raw.isBlank()) {
                continue;
            }
            String w = raw.replaceAll("[^a-z0-9]", "");
            if (w.isBlank()) {
                continue;
            }
            parts.add(w);
        }

        if (parts.isEmpty()) {
            String fallback = ascii.replaceAll("[^a-z0-9]", "");
            return shortenCode(fallback.isBlank() ? "PB" : fallback);
        }

        if (parts.size() == 1) {
            String w = parts.get(0);
            if (w.length() <= 8) {
                return shortenCode(w);
            }
            return shortenCode(w.substring(0, 6));
        }

        StringBuilder acronym = new StringBuilder();
        for (String w : parts) {
            if (acronym.length() >= 8) {
                break;
            }
            acronym.append(w.charAt(0));
        }
        return shortenCode(acronym.toString());
    }

    private static String shortenCode(String lettersOrDigits) {
        if (lettersOrDigits == null || lettersOrDigits.isBlank()) {
            return "PB";
        }
        String u = lettersOrDigits.toUpperCase(Locale.ROOT);
        return u.length() > 12 ? u.substring(0, 12) : u;
    }

    /** Chuẩn hóa mã do người dùng nhập (chữ số, tối đa 12 ký tự hiển thị business). */
    public static String sanitizeManualDepartmentCode(String raw) {
        if (raw == null || raw.isBlank()) {
            return "PB";
        }
        String cleaned = toAsciiLowerWords(raw).replaceAll("[^a-z0-9]", "");
        return shortenCode(cleaned.isBlank() ? "PB" : cleaned);
    }

    /** Chuỗi chữ thường ASCII, giữ khoảng trắng giữa các từ. */
    private static String toAsciiLowerWords(String input) {
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String noMarks = normalized.replaceAll("\\p{M}", "");
        return WHITESPACE.matcher(noMarks.trim().toLowerCase(Locale.ROOT)).replaceAll(" ").trim();
    }

    public static String toSlug(String input) {
        if (input == null || input.isBlank()) {
            return "item";
        }
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        String noMarks = normalized.replaceAll("\\p{M}", "");
        String slug = WHITESPACE.matcher(noMarks.trim().toLowerCase(Locale.ROOT)).replaceAll("-");
        slug = NON_LATIN.matcher(slug).replaceAll("");
        return slug.isBlank() ? "item" : slug;
    }

    public static String toCode(String input) {
        String slug = toSlug(input);
        return slug.length() > 50 ? slug.substring(0, 50) : slug;
    }
}
