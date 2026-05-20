package com.example.pms.backend.controller;

import com.example.pms.backend.dto.project.ProjectSummaryResponse;
import com.example.pms.backend.dto.workspace.CreateWorkspaceRequest;
import com.example.pms.backend.dto.workspace.DeleteWorkspaceRequest;
import com.example.pms.backend.dto.workspace.InvitationResponse;
import com.example.pms.backend.dto.workspace.InviteMemberRequest;
import com.example.pms.backend.dto.workspace.MemberResponse;
import com.example.pms.backend.dto.workspace.UpdateMemberRoleRequest;
import com.example.pms.backend.dto.workspace.UpdateWorkspaceRequest;
import com.example.pms.backend.dto.workspace.WorkspaceResponse;
import com.example.pms.backend.service.ProjectService;
import com.example.pms.backend.service.WorkspaceService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/workspaces")
@RequiredArgsConstructor
public class WorkspaceController {

    private final WorkspaceService workspaceService;
    private final ProjectService projectService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorkspaceResponse create(@Valid @RequestBody CreateWorkspaceRequest request) {
        return workspaceService.create(request);
    }

    @GetMapping
    public List<WorkspaceResponse> listMine() {
        return workspaceService.listMine();
    }

    @GetMapping("/{workspaceId}")
    public WorkspaceResponse getById(@PathVariable Long workspaceId) {
        return workspaceService.getById(workspaceId);
    }

    @PatchMapping("/{workspaceId}")
    public WorkspaceResponse update(
            @PathVariable Long workspaceId, @Valid @RequestBody UpdateWorkspaceRequest request) {
        return workspaceService.update(workspaceId, request);
    }

    @DeleteMapping("/{workspaceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable Long workspaceId, @Valid @RequestBody DeleteWorkspaceRequest request) {
        workspaceService.delete(workspaceId, request);
    }

    @GetMapping("/{workspaceId}/members")
    public List<MemberResponse> listMembers(@PathVariable Long workspaceId) {
        return workspaceService.listMembers(workspaceId);
    }

    @GetMapping("/{workspaceId}/projects")
    public List<ProjectSummaryResponse> listProjects(@PathVariable Long workspaceId) {
        return projectService.listByWorkspace(workspaceId);
    }

    @PostMapping("/{workspaceId}/invitations")
    @ResponseStatus(HttpStatus.CREATED)
    public InvitationResponse invite(
            @PathVariable Long workspaceId, @Valid @RequestBody InviteMemberRequest request) {
        return workspaceService.inviteMember(workspaceId, request);
    }

    @GetMapping("/{workspaceId}/invitations")
    public List<InvitationResponse> listPendingInvitations(@PathVariable Long workspaceId) {
        return workspaceService.listPendingInvitations(workspaceId);
    }

    @PatchMapping("/{workspaceId}/members/{userId}/role")
    public MemberResponse updateMemberRole(
            @PathVariable Long workspaceId,
            @PathVariable Long userId,
            @Valid @RequestBody UpdateMemberRoleRequest request) {
        return workspaceService.updateMemberRole(workspaceId, userId, request);
    }

    @DeleteMapping("/{workspaceId}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(@PathVariable Long workspaceId, @PathVariable Long userId) {
        workspaceService.removeMember(workspaceId, userId);
    }

    @PostMapping("/{workspaceId}/leave")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void leave(@PathVariable Long workspaceId) {
        workspaceService.leaveWorkspace(workspaceId);
    }
}
