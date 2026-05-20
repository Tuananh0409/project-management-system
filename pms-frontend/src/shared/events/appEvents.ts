export const APP_EVENTS = {
  workspacesChanged: "pms:workspaces-changed",
} as const;

export type WorkspacesChangedDetail = {
  workspaceId?: number;
};

export function notifyWorkspacesChanged(detail?: WorkspacesChangedDetail) {
  window.dispatchEvent(
    new CustomEvent<WorkspacesChangedDetail>(APP_EVENTS.workspacesChanged, { detail }),
  );
}
