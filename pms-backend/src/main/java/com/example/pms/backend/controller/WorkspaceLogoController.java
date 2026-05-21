package com.example.pms.backend.controller;

import com.example.pms.backend.dto.workspace.WorkspaceResponse;
import com.example.pms.backend.service.WorkspaceLogoService;
import com.example.pms.backend.service.WorkspaceLogoService.ResourceDownload;
import lombok.RequiredArgsConstructor;
import java.time.Duration;
import org.springframework.http.CacheControl;
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
@RequestMapping("/api/workspaces/{workspaceSlug}/logo")
@RequiredArgsConstructor
public class WorkspaceLogoController {

    private final WorkspaceLogoService logoService;

    @GetMapping
    public ResponseEntity<org.springframework.core.io.Resource> getLogo(@PathVariable String workspaceSlug) {
        ResourceDownload download = logoService.download(workspaceSlug);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(Duration.ofHours(1)).cachePublic())
                .contentType(MediaType.parseMediaType(download.contentType()))
                .body(download.resource());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public WorkspaceResponse upload(
            @PathVariable String workspaceSlug, @RequestParam("file") MultipartFile file) {
        return logoService.upload(workspaceSlug, file);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String workspaceSlug) {
        logoService.delete(workspaceSlug);
    }
}
