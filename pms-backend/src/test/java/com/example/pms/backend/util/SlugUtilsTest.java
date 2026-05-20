package com.example.pms.backend.util;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class SlugUtilsTest {

    @Test
    void toDepartmentCode_phongIT() {
        assertThat(SlugUtils.toDepartmentCode("Phòng IT")).isEqualTo("IT");
    }

    @Test
    void toDepartmentCode_kinhDoanh() {
        assertThat(SlugUtils.toDepartmentCode("Phòng Kinh doanh")).isEqualTo("KD");
    }

    @Test
    void toDepartmentCode_cntt() {
        assertThat(SlugUtils.toDepartmentCode("Phòng Công nghệ thông tin")).isEqualTo("CNTT");
    }

    @Test
    void toDepartmentCode_taiChinh() {
        assertThat(SlugUtils.toDepartmentCode("Ban Tài chính")).isEqualTo("TC");
    }

    @Test
    void sanitizeManualDepartmentCode_stripsNonAlnum() {
        assertThat(SlugUtils.sanitizeManualDepartmentCode("hr-team")).isEqualTo("HRTEAM");
    }
}
