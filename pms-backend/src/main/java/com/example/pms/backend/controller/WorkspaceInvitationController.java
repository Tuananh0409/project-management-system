package com.example.pms.backend.controller;

import com.example.pms.backend.dto.workspace.WorkspaceResponse;
import com.example.pms.backend.service.WorkspaceService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.example.pms.backend.dto.workspace.InvitationResponse;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
public class WorkspaceInvitationController {

    private final WorkspaceService workspaceService;

    @GetMapping("/mine")
    public List<InvitationResponse> listMine() {
        return workspaceService.listMyPendingInvitations();
    }

    @PostMapping("/{token}/accept")
    public WorkspaceResponse accept(@PathVariable String token) {
        return workspaceService.acceptInvitation(token);
    }

    @PostMapping("/{token}/decline")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void decline(@PathVariable String token) {
        workspaceService.declineInvitation(token);
    }
}
