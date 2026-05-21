package com.example.pms.backend.service;

import com.example.pms.backend.config.UploadProperties;
import com.example.pms.backend.dto.workspace.WorkspaceResponse;
import com.example.pms.backend.entity.Workspace;
import com.example.pms.backend.exception.BusinessException;
import com.example.pms.backend.exception.ErrorCode;
import com.example.pms.backend.repository.WorkspaceMemberRepository;
import com.example.pms.backend.repository.WorkspaceRepository;
import com.example.pms.backend.security.CurrentUserProvider;
import java.io.IOException;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class WorkspaceLogoService {

    private static final String ROLE_ADMIN = "Admin";
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("png", "jpg", "jpeg", "gif", "webp");
    private static final String LOGO_FILE_PREFIX = "logo.";

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final CurrentUserProvider currentUserProvider;
    private final UploadProperties uploadProperties;
    private final WorkspaceMapper workspaceMapper;

    @Transactional
    public WorkspaceResponse upload(String workspaceSlug, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Chưa chọn file logo");
        }
        Workspace workspace = getActiveBySlug(workspaceSlug);
        requireWorkspaceAdmin(workspace.getId(), currentUserProvider.getCurrentUser().getId());

        if (file.getSize() > uploadProperties.getMaxLogoBytes()) {
            throw new BusinessException(ErrorCode.WORKSPACE_LOGO_TOO_LARGE);
        }

        String extension = extractExtension(sanitizeFileName(file.getOriginalFilename()));
        if (extension.isEmpty() || !ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BusinessException(ErrorCode.WORKSPACE_LOGO_TYPE_NOT_ALLOWED);
        }

        Path logoDir = Paths.get(uploadProperties.getStorageDir(), "workspaces", String.valueOf(workspace.getId()));
        try {
            Files.createDirectories(logoDir);
            deleteExistingLogos(logoDir);
            Path target = logoDir.resolve(LOGO_FILE_PREFIX + extension);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            workspace.setLogoUrl(buildLogoApiPath(workspace.getSlug()));
            workspace = workspaceRepository.save(workspace);
            String myRole = workspaceMemberRepository
                    .findByWorkspaceIdAndUserId(workspace.getId(), currentUserProvider.getCurrentUser().getId())
                    .map(m -> m.getRole().getRoleName())
                    .orElse(ROLE_ADMIN);
            return workspaceMapper.toResponse(workspace, myRole);
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Không lưu được logo: " + e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public ResourceDownload download(String workspaceSlug) {
        Workspace workspace = getActiveBySlug(workspaceSlug);
        requireWorkspaceMember(workspace.getId(), currentUserProvider.getCurrentUser().getId());

        Path logoFile = resolveLogoFile(workspace.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_LOGO_NOT_FOUND));

        try {
            Resource resource = new UrlResource(logoFile.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new BusinessException(ErrorCode.WORKSPACE_LOGO_NOT_FOUND);
            }
            String mediaType = guessMediaType(extractExtension(logoFile.getFileName().toString()));
            return new ResourceDownload(resource, mediaType);
        } catch (IOException e) {
            throw new BusinessException(ErrorCode.WORKSPACE_LOGO_NOT_FOUND);
        }
    }

    @Transactional
    public WorkspaceResponse delete(String workspaceSlug) {
        Workspace workspace = getActiveBySlug(workspaceSlug);
        requireWorkspaceAdmin(workspace.getId(), currentUserProvider.getCurrentUser().getId());
        try {
            deleteExistingLogos(
                    Paths.get(uploadProperties.getStorageDir(), "workspaces", String.valueOf(workspace.getId())));
        } catch (IOException ignored) {
            /* DB cleared */
        }
        workspace.setLogoUrl(null);
        workspace = workspaceRepository.save(workspace);
        String myRole = workspaceMemberRepository
                .findByWorkspaceIdAndUserId(workspace.getId(), currentUserProvider.getCurrentUser().getId())
                .map(m -> m.getRole().getRoleName())
                .orElse(ROLE_ADMIN);
        return workspaceMapper.toResponse(workspace, myRole);
    }

    public static String buildLogoApiPath(String workspaceSlug) {
        return "/api/workspaces/" + workspaceSlug + "/logo";
    }

    public record ResourceDownload(Resource resource, String contentType) {}

    private Workspace getActiveBySlug(String workspaceSlug) {
        return workspaceRepository
                .findBySlugIgnoreCaseAndDeletedFalse(workspaceSlug.trim())
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_NOT_FOUND));
    }

    private void requireWorkspaceAdmin(Long workspaceId, Long userId) {
        workspaceMemberRepository
                .findByWorkspaceIdAndUserId(workspaceId, userId)
                .filter(m -> ROLE_ADMIN.equalsIgnoreCase(m.getRole().getRoleName()))
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_FORBIDDEN));
    }

    private void requireWorkspaceMember(Long workspaceId, Long userId) {
        workspaceRepository.findByIdAndDeletedFalse(workspaceId).orElseThrow();
        workspaceMemberRepository
                .findByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_FORBIDDEN));
    }

    private java.util.Optional<Path> resolveLogoFile(Long workspaceId) {
        Path dir = Paths.get(uploadProperties.getStorageDir(), "workspaces", String.valueOf(workspaceId));
        if (!Files.isDirectory(dir)) {
            return java.util.Optional.empty();
        }
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(dir, LOGO_FILE_PREFIX + "*")) {
            for (Path path : stream) {
                if (Files.isRegularFile(path)) {
                    return java.util.Optional.of(path);
                }
            }
        } catch (IOException ignored) {
            return java.util.Optional.empty();
        }
        return java.util.Optional.empty();
    }

    private void deleteExistingLogos(Path logoDir) throws IOException {
        if (!Files.isDirectory(logoDir)) {
            return;
        }
        try (DirectoryStream<Path> stream = Files.newDirectoryStream(logoDir, LOGO_FILE_PREFIX + "*")) {
            for (Path path : stream) {
                Files.deleteIfExists(path);
            }
        }
    }

    private String sanitizeFileName(String name) {
        if (name == null || name.isBlank()) {
            return "logo.png";
        }
        return Paths.get(name).getFileName().toString().replaceAll("[^a-zA-Z0-9._\\-]", "_");
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
            case "png" -> MediaType.IMAGE_PNG_VALUE;
            case "jpg", "jpeg" -> MediaType.IMAGE_JPEG_VALUE;
            case "gif" -> MediaType.IMAGE_GIF_VALUE;
            case "webp" -> "image/webp";
            default -> MediaType.APPLICATION_OCTET_STREAM_VALUE;
        };
    }
}
