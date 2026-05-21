package com.example.pms.backend.controller;

import com.example.pms.backend.dto.workspace.CreateWorkspaceRequest;
import com.example.pms.backend.dto.workspace.DeleteWorkspaceRequest;
import com.example.pms.backend.dto.workspace.InvitationResponse;
import com.example.pms.backend.dto.workspace.InviteMemberRequest;
import com.example.pms.backend.dto.workspace.MemberResponse;
import com.example.pms.backend.dto.workspace.UpdateMemberRoleRequest;
import com.example.pms.backend.dto.workspace.UpdateWorkspaceRequest;
import com.example.pms.backend.dto.workspace.WorkspaceResponse;
import com.example.pms.backend.entity.Workspace;
import com.example.pms.backend.service.ResourceResolver;
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
    private final ResourceResolver resourceResolver;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorkspaceResponse create(@Valid @RequestBody CreateWorkspaceRequest request) {
        return workspaceService.create(request);
    }

    @GetMapping
    public List<WorkspaceResponse> listMine() {
        return workspaceService.listMine();
    }

    @GetMapping("/{workspaceSlug}")
    public WorkspaceResponse getBySlug(@PathVariable String workspaceSlug) {
        Workspace workspace = resourceResolver.resolveWorkspace(workspaceSlug);
        return workspaceService.getById(workspace.getId());
    }

    @PatchMapping("/{workspaceSlug}")
    public WorkspaceResponse update(
            @PathVariable String workspaceSlug, @Valid @RequestBody UpdateWorkspaceRequest request) {
        Workspace workspace = resourceResolver.resolveWorkspace(workspaceSlug);
        return workspaceService.update(workspace.getId(), request);
    }

    @DeleteMapping("/{workspaceSlug}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable String workspaceSlug, @Valid @RequestBody DeleteWorkspaceRequest request) {
        Workspace workspace = resourceResolver.resolveWorkspace(workspaceSlug);
        workspaceService.delete(workspace.getId(), request);
    }

    @GetMapping("/{workspaceSlug}/members")
    public List<MemberResponse> listMembers(@PathVariable String workspaceSlug) {
        Workspace workspace = resourceResolver.resolveWorkspace(workspaceSlug);
        return workspaceService.listMembers(workspace.getId());
    }

    @PostMapping("/{workspaceSlug}/invitations")
    @ResponseStatus(HttpStatus.CREATED)
    public InvitationResponse invite(
            @PathVariable String workspaceSlug, @Valid @RequestBody InviteMemberRequest request) {
        Workspace workspace = resourceResolver.resolveWorkspace(workspaceSlug);
        return workspaceService.inviteMember(workspace.getId(), request);
    }

    @GetMapping("/{workspaceSlug}/invitations")
    public List<InvitationResponse> listPendingInvitations(@PathVariable String workspaceSlug) {
        Workspace workspace = resourceResolver.resolveWorkspace(workspaceSlug);
        return workspaceService.listPendingInvitations(workspace.getId());
    }

    @PatchMapping("/{workspaceSlug}/members/{userId}/role")
    public MemberResponse updateMemberRole(
            @PathVariable String workspaceSlug,
            @PathVariable Long userId,
            @Valid @RequestBody UpdateMemberRoleRequest request) {
        Workspace workspace = resourceResolver.resolveWorkspace(workspaceSlug);
        return workspaceService.updateMemberRole(workspace.getId(), userId, request);
    }

    @DeleteMapping("/{workspaceSlug}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(@PathVariable String workspaceSlug, @PathVariable Long userId) {
        Workspace workspace = resourceResolver.resolveWorkspace(workspaceSlug);
        workspaceService.removeMember(workspace.getId(), userId);
    }

    @PostMapping("/{workspaceSlug}/leave")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void leave(@PathVariable String workspaceSlug) {
        Workspace workspace = resourceResolver.resolveWorkspace(workspaceSlug);
        workspaceService.leaveWorkspace(workspace.getId());
    }
}
