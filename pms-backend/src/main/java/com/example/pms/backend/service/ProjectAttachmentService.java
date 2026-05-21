package com.example.pms.backend.service;

import com.example.pms.backend.config.UploadProperties;
import com.example.pms.backend.dto.project.ProjectAttachmentResponse;
import com.example.pms.backend.entity.Project;
import com.example.pms.backend.entity.ProjectAttachment;
import com.example.pms.backend.entity.User;
import com.example.pms.backend.exception.BusinessException;
import com.example.pms.backend.exception.ErrorCode;
import com.example.pms.backend.repository.ProjectAttachmentRepository;
import com.example.pms.backend.repository.ProjectMemberRepository;
import com.example.pms.backend.repository.ProjectRepository;
import com.example.pms.backend.repository.WorkspaceMemberRepository;
import com.example.pms.backend.repository.WorkspaceRepository;
import com.example.pms.backend.security.CurrentUserProvider;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ProjectAttachmentService {

    private static final String ROLE_ADMIN = "Admin";
    private static final String ROLE_PM = "PM";
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
            "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "png", "jpg", "jpeg", "gif", "webp", "zip",
            "rar", "csv");

    private final ProjectAttachmentRepository attachmentRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final WorkspaceRepository workspaceRepository;
    private final CurrentUserProvider currentUserProvider;
    private final UploadProperties uploadProperties;

    @Transactional(readOnly = true)
    public List<ProjectAttachmentResponse> list(Long workspaceId, Long projectId) {
        Project project = loadProject(workspaceId, projectId);
        requireProjectAccess(project, currentUserProvider.getCurrentUser().getId());
        return attachmentRepository.findByProjectIdWithUploaderOrderByCreatedAtDesc(projectId).stream()
                .map(a -> toResponse(a, project))
                .toList();
    }

    @Transactional
    public ProjectAttachmentResponse upload(Long workspaceId, Long projectId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Chưa chọn file");
        }
        Project project = loadProject(workspaceId, projectId);
        User currentUser = currentUserProvider.getCurrentUser();
        requireProjectWriteAccess(project, currentUser.getId());

        if (file.getSize() > uploadProperties.getMaxFileSizeBytes()) {
            throw new BusinessException(ErrorCode.ATTACHMENT_TOO_LARGE);
        }

        String originalName = sanitizeFileName(file.getOriginalFilename());
        String extension = extractExtension(originalName);
        if (extension.isEmpty() || !ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BusinessException(ErrorCode.ATTACHMENT_TYPE_NOT_ALLOWED);
        }

        String storedName = UUID.randomUUID() + "_" + originalName;
        Path targetDir = Paths.get(uploadProperties.getStorageDir(), "projects", String.valueOf(projectId));
        try {
            Files.createDirectories(targetDir);
            Path targetPath = targetDir.resolve(storedName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            String relativePath = "projects/" + projectId + "/" + storedName;

            ProjectAttachment attachment = ProjectAttachment.builder()
                    .project(project)
                    .fileName(originalName)
                    .filePath(relativePath)
                    .fileType(file.getContentType() != null ? file.getContentType() : guessMediaType(extension))
                    .fileSize(file.getSize())
                    .uploadedBy(currentUser)
                    .build();
            attachment = attachmentRepository.save(attachment);
            return toResponse(attachment, project);
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Không lưu được file: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public ResourceDownload download(Long workspaceId, Long projectId, Long attachmentId) {
        Project project = loadProject(workspaceId, projectId);
        requireProjectAccess(project, currentUserProvider.getCurrentUser().getId());
        ProjectAttachment attachment = attachmentRepository
                .findByIdAndProjectId(attachmentId, projectId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ATTACHMENT_NOT_FOUND));

        Path path = resolveStoragePath(attachment.getFilePath());
        if (!Files.exists(path)) {
            throw new BusinessException(ErrorCode.ATTACHMENT_NOT_FOUND, "File vật lý không còn trên server");
        }
        try {
            Resource resource = new UrlResource(path.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new BusinessException(ErrorCode.ATTACHMENT_NOT_FOUND);
            }
            String mediaType =
                    attachment.getFileType() != null ? attachment.getFileType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;
            return new ResourceDownload(resource, attachment.getFileName(), mediaType);
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.ATTACHMENT_NOT_FOUND);
        }
    }

    @Transactional
    public void delete(Long workspaceId, Long projectId, Long attachmentId) {
        Project project = loadProject(workspaceId, projectId);
        User currentUser = currentUserProvider.getCurrentUser();
        ProjectAttachment attachment = attachmentRepository
                .findByIdAndProjectId(attachmentId, projectId)
                .orElseThrow(() -> new BusinessException(ErrorCode.ATTACHMENT_NOT_FOUND));

        boolean canDelete = attachment.getUploadedBy().getId().equals(currentUser.getId())
                || canManageProject(project, currentUser.getId());
        if (!canDelete) {
            throw new BusinessException(ErrorCode.ATTACHMENT_FORBIDDEN);
        }

        Path path = resolveStoragePath(attachment.getFilePath());
        attachmentRepository.delete(attachment);
        try {
            Files.deleteIfExists(path);
        } catch (IOException ignored) {
            /* DB record removed */
        }
    }

    public record ResourceDownload(Resource resource, String fileName, String contentType) {}

    private Project loadProject(Long workspaceId, Long projectId) {
        return projectRepository
                .findByIdAndWorkspaceIdAndDeletedFalse(projectId, workspaceId)
                .orElseThrow(() -> new BusinessException(ErrorCode.PROJECT_NOT_FOUND));
    }

    private void requireProjectAccess(Project project, Long userId) {
        if (isWorkspaceAdmin(project.getWorkspace().getId(), userId)) {
            return;
        }
        if (projectMemberRepository.findByProjectIdAndUserId(project.getId(), userId).isPresent()) {
            return;
        }
        throw new BusinessException(ErrorCode.PROJECT_FORBIDDEN);
    }

    private void requireProjectWriteAccess(Project project, Long userId) {
        requireProjectAccess(project, userId);
    }

    private boolean canManageProject(Project project, Long userId) {
        if (isWorkspaceAdmin(project.getWorkspace().getId(), userId)) {
            return true;
        }
        return projectMemberRepository
                .findByProjectIdAndUserId(project.getId(), userId)
                .map(m -> {
                    String role = m.getRole().getRoleName();
                    return ROLE_PM.equalsIgnoreCase(role) || "Lead".equalsIgnoreCase(role);
                })
                .orElse(false);
    }

    private boolean isWorkspaceAdmin(Long workspaceId, Long userId) {
        workspaceRepository.findByIdAndDeletedFalse(workspaceId).orElseThrow();
        return workspaceMemberRepository
                .findByWorkspaceIdAndUserId(workspaceId, userId)
                .map(m -> ROLE_ADMIN.equalsIgnoreCase(m.getRole().getRoleName()))
                .orElse(false);
    }

    private Path resolveStoragePath(String relativePath) {
        return Paths.get(uploadProperties.getStorageDir()).resolve(relativePath).normalize();
    }

    private ProjectAttachmentResponse toResponse(ProjectAttachment a, Project project) {
        String workspaceSlug = project.getWorkspace().getSlug();
        String projectSlug = project.getSlug();
        String downloadUrl = "/api/workspaces/" + workspaceSlug + "/projects/" + projectSlug + "/attachments/"
                + a.getId() + "/download";
        return ProjectAttachmentResponse.builder()
                .id(a.getId())
                .projectId(project.getId())
                .fileName(a.getFileName())
                .fileType(a.getFileType())
                .fileSize(a.getFileSize())
                .uploadedByUsername(a.getUploadedBy().getUsername())
                .createdAt(a.getCreatedAt())
                .downloadUrl(downloadUrl)
                .build();
    }

    private String sanitizeFileName(String name) {
        if (name == null || name.isBlank()) {
            return "file";
        }
        String base = Paths.get(name).getFileName().toString();
        return base.replaceAll("[^a-zA-Z0-9._\\-]", "_");
    }

    private String extractExtension(String fileName) {
        int dot = fileName.lastIndexOf('.');
        if (dot < 0 || dot == fileName.length() - 1) {
            return "";
        }
        return fileName.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    private String guessMediaType(String extension) {
        return switch (extension) {
            case "pdf" -> "application/pdf";
            case "png" -> "image/png";
            case "jpg", "jpeg" -> "image/jpeg";
            case "gif" -> "image/gif";
            case "webp" -> "image/webp";
            case "zip" -> "application/zip";
            default -> MediaType.APPLICATION_OCTET_STREAM_VALUE;
        };
    }
}
