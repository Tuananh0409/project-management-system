package com.example.pms.backend.workspace;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.pms.backend.auth.AuthTestSupport;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
class WorkspaceApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthTestSupport authTestSupport;

    @Test
    void createWorkspace_inviteAndAccept() throws Exception {
        String workspaceJson = objectMapper.writeValueAsString(Map.of(
                "name", "Phong IT",
                "description", "Workspace phong cong nghe",
                "code", "IT",
                "slug", "phong-it"));

        MvcResult createResult = mockMvc.perform(post("/api/workspaces")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + authTestSupport.bearerTokenForUserId(1))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(workspaceJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Phong IT"))
                .andExpect(jsonPath("$.myRole").value("Admin"))
                .andReturn();

        String workspaceSlug = objectMapper
                .readTree(createResult.getResponse().getContentAsString())
                .get("slug")
                .asText();

        String inviteJson = objectMapper.writeValueAsString(Map.of(
                "email", "member@ctel.local",
                "roleName", "Member"));

        MvcResult inviteResult = mockMvc.perform(post("/api/workspaces/{slug}/invitations", workspaceSlug)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + authTestSupport.bearerTokenForUserId(1))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(inviteJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("pending"))
                .andExpect(jsonPath("$.email").value("member@ctel.local"))
                .andReturn();

        String token = objectMapper
                .readTree(inviteResult.getResponse().getContentAsString())
                .get("token")
                .asText();

        mockMvc.perform(post("/api/invitations/{token}/accept", token)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + authTestSupport.bearerTokenForUserId(2)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.myRole").value("Member"));

        mockMvc.perform(get("/api/workspaces/{slug}/members", workspaceSlug)
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + authTestSupport.bearerTokenForUserId(1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }
}
