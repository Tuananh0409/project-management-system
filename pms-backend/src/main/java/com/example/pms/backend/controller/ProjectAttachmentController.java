package com.example.pms.backend.controller;

import com.example.pms.backend.dto.project.ProjectAttachmentResponse;
import com.example.pms.backend.entity.Project;
import com.example.pms.backend.service.ProjectAttachmentService;
import com.example.pms.backend.service.ProjectAttachmentService.ResourceDownload;
import com.example.pms.backend.service.ResourceResolver;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/workspaces/{workspaceSlug}/projects/{projectSlug}/attachments")
@RequiredArgsConstructor
public class ProjectAttachmentController {

    private final ProjectAttachmentService attachmentService;
    private final ResourceResolver resourceResolver;

    @GetMapping
    public List<ProjectAttachmentResponse> list(
            @PathVariable String workspaceSlug, @PathVariable String projectSlug) {
        Project project = resourceResolver.resolveProject(workspaceSlug, projectSlug);
        return attachmentService.list(project.getWorkspace().getId(), project.getId());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectAttachmentResponse upload(
            @PathVariable String workspaceSlug,
            @PathVariable String projectSlug,
            @RequestParam("file") MultipartFile file) {
        Project project = resourceResolver.resolveProject(workspaceSlug, projectSlug);
        return attachmentService.upload(project.getWorkspace().getId(), project.getId(), file);
    }

    @GetMapping("/{attachmentId}/download")
    public ResponseEntity<org.springframework.core.io.Resource> download(
            @PathVariable String workspaceSlug,
            @PathVariable String projectSlug,
            @PathVariable Long attachmentId) {
        Project project = resourceResolver.resolveProject(workspaceSlug, projectSlug);
        ResourceDownload download =
                attachmentService.download(project.getWorkspace().getId(), project.getId(), attachmentId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + download.fileName() + "\"")
                .contentType(MediaType.parseMediaType(download.contentType()))
                .body(download.resource());
    }

    @DeleteMapping("/{attachmentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @PathVariable String workspaceSlug,
            @PathVariable String projectSlug,
            @PathVariable Long attachmentId) {
        Project project = resourceResolver.resolveProject(workspaceSlug, projectSlug);
        attachmentService.delete(project.getWorkspace().getId(), project.getId(), attachmentId);
    }
}
