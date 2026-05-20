package com.example.pms.backend.controller;

import com.example.pms.backend.dto.notification.NotificationResponse;
import com.example.pms.backend.service.NotificationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/mine")
    public List<NotificationResponse> listMine() {
        return notificationService.listMine();
    }
}
