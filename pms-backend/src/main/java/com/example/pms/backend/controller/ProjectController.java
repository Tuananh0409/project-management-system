package com.example.pms.backend.controller;

import com.example.pms.backend.dto.project.AddProjectMemberRequest;
import com.example.pms.backend.dto.project.CreateProjectRequest;
import com.example.pms.backend.dto.project.ProjectMemberResponse;
import com.example.pms.backend.dto.project.ProjectResponse;
import com.example.pms.backend.dto.project.ProjectSummaryResponse;
import com.example.pms.backend.dto.project.UpdateProjectMemberRoleRequest;
import com.example.pms.backend.dto.project.UpdateProjectRequest;
import com.example.pms.backend.entity.Project;
import com.example.pms.backend.entity.Workspace;
import com.example.pms.backend.service.ProjectService;
import com.example.pms.backend.service.ResourceResolver;
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
@RequestMapping("/api/workspaces/{workspaceSlug}/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final ResourceResolver resourceResolver;

    @GetMapping
    public List<ProjectSummaryResponse> list(@PathVariable String workspaceSlug) {
        Workspace workspace = resourceResolver.resolveWorkspace(workspaceSlug);
        return projectService.listByWorkspace(workspace.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponse create(
            @PathVariable String workspaceSlug, @Valid @RequestBody CreateProjectRequest request) {
        Workspace workspace = resourceResolver.resolveWorkspace(workspaceSlug);
        return projectService.create(workspace.getId(), request);
    }

    @GetMapping("/{projectSlug}")
    public ProjectResponse getBySlug(
            @PathVariable String workspaceSlug, @PathVariable String projectSlug) {
        Project project = resourceResolver.resolveProject(workspaceSlug, projectSlug);
        return projectService.getById(project.getWorkspace().getId(), project.getId());
    }

    @PatchMapping("/{projectSlug}")
    public ProjectResponse update(
            @PathVariable String workspaceSlug,
            @PathVariable String projectSlug,
            @Valid @RequestBody UpdateProjectRequest request) {
        Project project = resourceResolver.resolveProject(workspaceSlug, projectSlug);
        return projectService.update(project.getWorkspace().getId(), project.getId(), request);
    }

    @DeleteMapping("/{projectSlug}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String workspaceSlug, @PathVariable String projectSlug) {
        Project project = resourceResolver.resolveProject(workspaceSlug, projectSlug);
        projectService.delete(project.getWorkspace().getId(), project.getId());
    }

    @GetMapping("/{projectSlug}/members")
    public List<ProjectMemberResponse> listMembers(
            @PathVariable String workspaceSlug, @PathVariable String projectSlug) {
        Project project = resourceResolver.resolveProject(workspaceSlug, projectSlug);
        return projectService.listMembers(project.getWorkspace().getId(), project.getId());
    }

    @PostMapping("/{projectSlug}/members")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectMemberResponse addMember(
            @PathVariable String workspaceSlug,
            @PathVariable String projectSlug,
            @Valid @RequestBody AddProjectMemberRequest request) {
        Project project = resourceResolver.resolveProject(workspaceSlug, projectSlug);
        return projectService.addMember(project.getWorkspace().getId(), project.getId(), request);
    }

    @PatchMapping("/{projectSlug}/members/{userId}/role")
    public ProjectMemberResponse updateMemberRole(
            @PathVariable String workspaceSlug,
            @PathVariable String projectSlug,
            @PathVariable Long userId,
            @Valid @RequestBody UpdateProjectMemberRoleRequest request) {
        Project project = resourceResolver.resolveProject(workspaceSlug, projectSlug);
        return projectService.updateMemberRole(
                project.getWorkspace().getId(), project.getId(), userId, request);
    }

    @DeleteMapping("/{projectSlug}/members/{userId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(
            @PathVariable String workspaceSlug, @PathVariable String projectSlug, @PathVariable Long userId) {
        Project project = resourceResolver.resolveProject(workspaceSlug, projectSlug);
        projectService.removeMember(project.getWorkspace().getId(), project.getId(), userId);
    }
}
