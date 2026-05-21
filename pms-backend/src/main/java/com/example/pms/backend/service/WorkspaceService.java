package com.example.pms.backend.service;

import com.example.pms.backend.dto.workspace.CreateWorkspaceRequest;
import com.example.pms.backend.dto.workspace.DeleteWorkspaceRequest;
import com.example.pms.backend.dto.workspace.InvitationResponse;
import com.example.pms.backend.dto.workspace.InviteMemberRequest;
import com.example.pms.backend.dto.workspace.MemberResponse;
import com.example.pms.backend.dto.workspace.UpdateMemberRoleRequest;
import com.example.pms.backend.dto.workspace.UpdateWorkspaceRequest;
import com.example.pms.backend.dto.workspace.WorkspaceResponse;
import com.example.pms.backend.entity.User;
import com.example.pms.backend.entity.Workspace;
import com.example.pms.backend.entity.WorkspaceInvitation;
import com.example.pms.backend.entity.WorkspaceMember;
import com.example.pms.backend.entity.WorkspaceRole;
import com.example.pms.backend.exception.BusinessException;
import com.example.pms.backend.exception.ErrorCode;
import com.example.pms.backend.repository.ProjectRepository;
import com.example.pms.backend.repository.UserRepository;
import com.example.pms.backend.repository.WorkspaceInvitationRepository;
import com.example.pms.backend.repository.WorkspaceMemberRepository;
import com.example.pms.backend.repository.WorkspaceRepository;
import com.example.pms.backend.repository.WorkspaceRoleRepository;
import com.example.pms.backend.security.CurrentUserProvider;
import com.example.pms.backend.util.SlugUtils;
import com.example.pms.backend.workspace.WorkspacePrivacy;
import java.net.URI;
import java.time.Instant;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private static final String ROLE_ADMIN = "Admin";
    private static final String STATUS_PENDING = "pending";
    private static final String STATUS_ACCEPTED = "accepted";
    private static final String STATUS_DECLINED = "declined";
    private static final String STATUS_EXPIRED = "expired";
    private static final String SYSTEM_ADMIN_EMAIL = "admin@ctel.local";

    private final WorkspaceRepository workspaceRepository;
    private final WorkspaceMemberRepository workspaceMemberRepository;
    private final WorkspaceInvitationRepository workspaceInvitationRepository;
    private final WorkspaceRoleRepository workspaceRoleRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final CurrentUserProvider currentUserProvider;
    private final WorkspaceMapper workspaceMapper;

    @Transactional
    public WorkspaceResponse create(CreateWorkspaceRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();

        if (!isSystemAdmin(currentUser)) {
            throw new BusinessException(ErrorCode.WORKSPACE_FORBIDDEN, "Chỉ admin hệ thống mới được tạo workspace");
        }

        String name = request.getName().trim();
        if (workspaceRepository.existsByNameIgnoreCase(name)) {
            throw new BusinessException(ErrorCode.WORKSPACE_NAME_EXISTS);
        }

        String code = request.getCode() != null && !request.getCode().isBlank()
                ? SlugUtils.sanitizeManualDepartmentCode(request.getCode())
                : SlugUtils.toDepartmentCode(request.getName());
        String slug = request.getSlug() != null && !request.getSlug().isBlank()
                ? SlugUtils.toSlug(request.getSlug().trim())
                : SlugUtils.toSlug(request.getName());

        String baseCode = code;
        int codeSuffix = 1;
        while (workspaceRepository.existsByCodeIgnoreCase(code)) {
            codeSuffix++;
            code = baseCode + codeSuffix;
            if (code.length() > 50) {
                code = baseCode + (System.currentTimeMillis() % 100000);
                break;
            }
            if (codeSuffix > 500) {
                code = baseCode + (System.currentTimeMillis() % 100000);
                break;
            }
        }
        int slugSuffix = 0;
        String baseSlug = slug;
        while (workspaceRepository.existsBySlugIgnoreCase(slug)) {
            slugSuffix++;
            slug = baseSlug + "-" + slugSuffix;
            if (slug.length() > 150) {
                slug = baseSlug + "-" + (System.currentTimeMillis() % 10000);
                break;
            }
            if (slugSuffix > 500) {
                slug = baseSlug + "-" + (System.currentTimeMillis() % 10000);
                break;
            }
        }

        if (request.getPrivacyMode() != null
                && !request.getPrivacyMode().isBlank()
                && !WorkspacePrivacy.isAllowed(request.getPrivacyMode())) {
            throw new BusinessException(
                    ErrorCode.VALIDATION_ERROR,
                    "privacyMode chỉ nhận PRIVATE hoặc ORG_WIDE");
        }
        String privacy = WorkspacePrivacy.normalizeOrDefault(request.getPrivacyMode());
        String themeColor = normalizeThemeColor(request.getThemeColor());
        String timezone = resolveTimezone(request.getTimezone());
        Workspace workspace = Workspace.builder()
                .name(name)
                .description(request.getDescription())
                .code(code)
                .slug(slug)
                .logoUrl(null)
                .owner(currentUser)
                .privacyMode(privacy)
                .themeColor(themeColor)
                .timezone(timezone)
                .status("active")
                .deleted(false)
                .build();

        workspace = workspaceRepository.save(workspace);

        WorkspaceRole adminRole = getRoleByName(ROLE_ADMIN);
        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(workspace)
                .user(currentUser)
                .role(adminRole)
                .joinedAt(Instant.now())
                .build());

        return workspaceMapper.toResponse(workspace, ROLE_ADMIN);
    }

    @Transactional(readOnly = true)
    public List<WorkspaceResponse> listMine() {
        User currentUser = currentUserProvider.getCurrentUser();
        return workspaceRepository.findAllAccessibleByUserId(currentUser.getId()).stream()
                .map(w -> workspaceMapper.toResponse(w, resolveMyRole(w.getId(), currentUser.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public WorkspaceResponse getById(Long workspaceId) {
        User currentUser = currentUserProvider.getCurrentUser();
        Workspace workspace = getActiveWorkspace(workspaceId);
        requireMember(workspaceId, currentUser.getId());
        return workspaceMapper.toResponse(workspace, resolveMyRole(workspaceId, currentUser.getId()));
    }

    @Transactional
    public WorkspaceResponse update(Long workspaceId, UpdateWorkspaceRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();
        Workspace workspace = getActiveWorkspace(workspaceId);
        requireWorkspaceAdmin(workspaceId, currentUser.getId());

        if (request.getName() != null && !request.getName().isBlank()) {
            String newName = request.getName().trim();
            if (workspaceRepository.existsByNameIgnoreCaseAndDeletedFalseAndIdNot(newName, workspaceId)) {
                throw new BusinessException(ErrorCode.WORKSPACE_NAME_EXISTS);
            }
            workspace.setName(newName);
        }
        if (request.getDescription() != null) {
            workspace.setDescription(request.getDescription());
        }
        if (request.getLogoUrl() != null && request.getLogoUrl().isBlank()) {
            workspace.setLogoUrl(null);
        }
        if (request.getPrivacyMode() != null && !request.getPrivacyMode().isBlank()) {
            if (!WorkspacePrivacy.isAllowed(request.getPrivacyMode())) {
                throw new BusinessException(
                        ErrorCode.VALIDATION_ERROR,
                        "privacyMode chỉ nhận PRIVATE hoặc ORG_WIDE");
            }
            workspace.setPrivacyMode(
                    WorkspacePrivacy.normalizeOrDefault(request.getPrivacyMode()));
        }
        if (request.getThemeColor() != null) {
            workspace.setThemeColor(
                    request.getThemeColor().isBlank()
                            ? null
                            : normalizeThemeColor(request.getThemeColor()));
        }
        if (request.getStatus() != null) {
            workspace.setStatus(request.getStatus());
        }
        if (request.getTimezone() != null && !request.getTimezone().isBlank()) {
            workspace.setTimezone(resolveTimezone(request.getTimezone()));
        }

        workspace = workspaceRepository.save(workspace);
        return workspaceMapper.toResponse(workspace, resolveMyRole(workspaceId, currentUser.getId()));
    }

    @Transactional
    public void delete(Long workspaceId, DeleteWorkspaceRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();
        Workspace workspace = getActiveWorkspace(workspaceId);
        requireWorkspaceAdmin(workspaceId, currentUser.getId());

        if (!workspace.getName().equals(request.getConfirmName().trim())) {
            throw new BusinessException(ErrorCode.WORKSPACE_DELETE_NAME_MISMATCH);
        }

        if (projectRepository.countActiveProjectsByWorkspaceId(workspaceId) > 0) {
            throw new BusinessException(ErrorCode.WORKSPACE_HAS_ACTIVE_PROJECTS);
        }

        workspace.setDeleted(true);
        workspace.setStatus("archived");
        workspaceRepository.save(workspace);
    }

    @Transactional(readOnly = true)
    public List<MemberResponse> listMembers(Long workspaceId) {
        User currentUser = currentUserProvider.getCurrentUser();
        requireMember(workspaceId, currentUser.getId());
        return workspaceMemberRepository.findByWorkspaceId(workspaceId).stream()
                .map(workspaceMapper::toMemberResponse)
                .toList();
    }

    @Transactional
    public InvitationResponse inviteMember(Long workspaceId, InviteMemberRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();
        Workspace workspace = getActiveWorkspace(workspaceId);
        requireWorkspaceAdmin(workspaceId, currentUser.getId());

        String email = request.getEmail().trim().toLowerCase();
        User invitee = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVITE_EMAIL_NOT_FOUND));

        if (workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, invitee.getId())) {
            throw new BusinessException(ErrorCode.MEMBER_ALREADY_EXISTS);
        }

        if (workspaceInvitationRepository.existsByWorkspaceIdAndEmailIgnoreCaseAndStatus(
                workspaceId, email, STATUS_PENDING)) {
            throw new BusinessException(ErrorCode.MEMBER_ALREADY_EXISTS, "Đã có lời mời đang chờ xác nhận");
        }

        WorkspaceRole role = getRoleByName(request.getRoleName());

        WorkspaceInvitation invitation = WorkspaceInvitation.builder()
                .workspace(workspace)
                .email(email)
                .inviter(currentUser)
                .role(role)
                .status(STATUS_PENDING)
                .token(UUID.randomUUID().toString().replace("-", ""))
                .expiredAt(Instant.now().plus(48, ChronoUnit.HOURS))
                .build();

        invitation = workspaceInvitationRepository.save(invitation);
        return workspaceMapper.toInvitationResponse(invitation);
    }

    @Transactional(readOnly = true)
    public List<InvitationResponse> listPendingInvitations(Long workspaceId) {
        User currentUser = currentUserProvider.getCurrentUser();
        requireWorkspaceAdmin(workspaceId, currentUser.getId());
        return workspaceInvitationRepository.findByWorkspaceIdAndStatus(workspaceId, STATUS_PENDING).stream()
                .map(workspaceMapper::toInvitationResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InvitationResponse> listMyPendingInvitations() {
        User currentUser = currentUserProvider.getCurrentUser();
        Instant now = Instant.now();
        return workspaceInvitationRepository
                .findPendingWithDetailsByEmail(currentUser.getEmail(), STATUS_PENDING)
                .stream()
                .filter(invitation -> !invitation.getWorkspace().getDeleted())
                .filter(invitation -> invitation.getExpiredAt() == null || invitation.getExpiredAt().isAfter(now))
                .map(workspaceMapper::toInvitationResponse)
                .toList();
    }

    @Transactional
    public WorkspaceResponse acceptInvitation(String token) {
        User currentUser = currentUserProvider.getCurrentUser();
        WorkspaceInvitation invitation = getValidPendingInvitation(token);

        if (!invitation.getEmail().equalsIgnoreCase(currentUser.getEmail())) {
            throw new BusinessException(ErrorCode.WORKSPACE_FORBIDDEN, "Lời mời không dành cho tài khoản này");
        }

        Workspace workspace = invitation.getWorkspace();
        if (workspace.getDeleted()) {
            throw new BusinessException(ErrorCode.INVITATION_WORKSPACE_GONE);
        }

        if (workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspace.getId(), currentUser.getId())) {
            invitation.setStatus(STATUS_ACCEPTED);
            workspaceInvitationRepository.save(invitation);
            return workspaceMapper.toResponse(workspace, resolveMyRole(workspace.getId(), currentUser.getId()));
        }

        workspaceMemberRepository.save(WorkspaceMember.builder()
                .workspace(workspace)
                .user(currentUser)
                .role(invitation.getRole())
                .joinedAt(Instant.now())
                .build());

        invitation.setStatus(STATUS_ACCEPTED);
        workspaceInvitationRepository.save(invitation);

        return workspaceMapper.toResponse(workspace, invitation.getRole().getRoleName());
    }

    @Transactional
    public void declineInvitation(String token) {
        User currentUser = currentUserProvider.getCurrentUser();
        WorkspaceInvitation invitation = getValidPendingInvitation(token);

        if (!invitation.getEmail().equalsIgnoreCase(currentUser.getEmail())) {
            throw new BusinessException(ErrorCode.WORKSPACE_FORBIDDEN, "Lời mời không dành cho tài khoản này");
        }

        invitation.setStatus(STATUS_DECLINED);
        workspaceInvitationRepository.save(invitation);
    }

    @Transactional
    public MemberResponse updateMemberRole(Long workspaceId, Long targetUserId, UpdateMemberRoleRequest request) {
        User currentUser = currentUserProvider.getCurrentUser();
        getActiveWorkspace(workspaceId);
        requireWorkspaceAdmin(workspaceId, currentUser.getId());

        WorkspaceMember member = workspaceMemberRepository
                .findByWorkspaceIdAndUserId(workspaceId, targetUserId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "Thành viên không tồn tại"));

        WorkspaceRole newRole = getRoleByName(request.getRoleName());
        boolean wasAdmin = ROLE_ADMIN.equalsIgnoreCase(member.getRole().getRoleName());
        boolean becomesMember = !ROLE_ADMIN.equalsIgnoreCase(newRole.getRoleName());

        if (wasAdmin && becomesMember && workspaceMemberRepository.countAdminsByWorkspaceId(workspaceId) <= 1) {
            throw new BusinessException(ErrorCode.WORKSPACE_MIN_ONE_ADMIN);
        }

        if (currentUser.getId().equals(targetUserId)
                && wasAdmin
                && becomesMember
                && workspaceMemberRepository.countAdminsByWorkspaceId(workspaceId) <= 1) {
            throw new BusinessException(ErrorCode.WORKSPACE_MIN_ONE_ADMIN);
        }

        member.setRole(newRole);
        member = workspaceMemberRepository.save(member);
        return workspaceMapper.toMemberResponse(member);
    }

    @Transactional
    public void removeMember(Long workspaceId, Long targetUserId) {
        User currentUser = currentUserProvider.getCurrentUser();
        getActiveWorkspace(workspaceId);
        requireWorkspaceAdmin(workspaceId, currentUser.getId());

        WorkspaceMember member = workspaceMemberRepository
                .findByWorkspaceIdAndUserId(workspaceId, targetUserId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND, "Thành viên không tồn tại"));

        if (ROLE_ADMIN.equalsIgnoreCase(member.getRole().getRoleName())
                && workspaceMemberRepository.countAdminsByWorkspaceId(workspaceId) <= 1) {
            throw new BusinessException(ErrorCode.WORKSPACE_MIN_ONE_ADMIN);
        }

        workspaceMemberRepository.delete(member);
    }

    @Transactional
    public void leaveWorkspace(Long workspaceId) {
        User currentUser = currentUserProvider.getCurrentUser();
        getActiveWorkspace(workspaceId);

        WorkspaceMember member = workspaceMemberRepository
                .findByWorkspaceIdAndUserId(workspaceId, currentUser.getId())
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_FORBIDDEN));

        if (ROLE_ADMIN.equalsIgnoreCase(member.getRole().getRoleName())
                && workspaceMemberRepository.countAdminsByWorkspaceId(workspaceId) <= 1) {
            throw new BusinessException(ErrorCode.LAST_ADMIN_CANNOT_LEAVE);
        }

        workspaceMemberRepository.delete(member);
    }

    private WorkspaceInvitation getValidPendingInvitation(String token) {
        WorkspaceInvitation invitation = workspaceInvitationRepository
                .findByToken(token)
                .orElseThrow(() -> new BusinessException(ErrorCode.INVITATION_INVALID));

        if (!STATUS_PENDING.equals(invitation.getStatus())) {
            throw new BusinessException(ErrorCode.INVITATION_INVALID);
        }

        if (Instant.now().isAfter(invitation.getExpiredAt())) {
            invitation.setStatus(STATUS_EXPIRED);
            workspaceInvitationRepository.save(invitation);
            throw new BusinessException(ErrorCode.INVITATION_INVALID);
        }

        return invitation;
    }

    private Workspace getActiveWorkspace(Long workspaceId) {
        return workspaceRepository
                .findByIdAndDeletedFalse(workspaceId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_NOT_FOUND));
    }

    private void requireMember(Long workspaceId, Long userId) {
        if (!workspaceMemberRepository.existsByWorkspaceIdAndUserId(workspaceId, userId)) {
            throw new BusinessException(ErrorCode.WORKSPACE_FORBIDDEN);
        }
    }

    private void requireWorkspaceAdmin(Long workspaceId, Long userId) {
        WorkspaceMember member = workspaceMemberRepository
                .findByWorkspaceIdAndUserId(workspaceId, userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WORKSPACE_FORBIDDEN));
        if (!ROLE_ADMIN.equalsIgnoreCase(member.getRole().getRoleName())) {
            throw new BusinessException(ErrorCode.WORKSPACE_FORBIDDEN);
        }
    }

    private String resolveMyRole(Long workspaceId, Long userId) {
        return workspaceMemberRepository
                .findByWorkspaceIdAndUserId(workspaceId, userId)
                .map(m -> m.getRole().getRoleName())
                .orElse(null);
    }

    /** #RGB / #RRGGBB hoặc rỗng. */
    private String normalizeThemeColor(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String s = raw.trim();
        if (!s.startsWith("#")) {
            s = "#" + s;
        }
        if (!s.matches("^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$")) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "themeColor: dùng #RGB hoặc #RRGGBB");
        }
        if (s.length() == 4) {
            return "#" + s.charAt(1) + s.charAt(1) + s.charAt(2) + s.charAt(2) + s.charAt(3) + s.charAt(3);
        }
        return s.toUpperCase(java.util.Locale.ROOT);
    }

    private String resolveTimezone(String raw) {
        if (raw == null || raw.isBlank()) {
            return "Asia/Ho_Chi_Minh";
        }
        try {
            return ZoneId.of(raw.trim()).getId();
        } catch (RuntimeException ex) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "timezone không hợp lệ (IANA, ví dụ Asia/Ho_Chi_Minh)");
        }
    }

    private String resolveLogoUrl(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        String url = raw.trim();
        if (url.length() > 500) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "logoUrl quá dài");
        }
        try {
            URI uri = URI.create(url);
            if (uri.getScheme() == null || (!uri.getScheme().equalsIgnoreCase("https") && !uri.getScheme().equalsIgnoreCase("http"))) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "logoUrl phải là http(s)");
            }
        } catch (IllegalArgumentException ex) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "logoUrl không hợp lệ");
        }
        return url;
    }

    private boolean isSystemAdmin(User user) {
        if (user == null) {
            return false;
        }
        if (user.getId() != null && user.getId() == 1L) {
            return true;
        }
        return user.getEmail() != null
                && SYSTEM_ADMIN_EMAIL.equalsIgnoreCase(user.getEmail().trim());
    }

    private WorkspaceRole getRoleByName(String roleName) {
        return workspaceRoleRepository
                .findByRoleNameIgnoreCase(roleName.trim())
                .orElseThrow(() -> new BusinessException(
                        ErrorCode.VALIDATION_ERROR, "Vai trò không hợp lệ: " + roleName));
    }
}
