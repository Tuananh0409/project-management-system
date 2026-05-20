import { useState } from "react";
import type { Workspace } from "../types";

type Props = {
  workspace: Pick<Workspace, "code" | "themeColor" | "logoUrl" | "name">;
  size?: "sm" | "md";
  className?: string;
};

const sizeClass = {
  sm: "h-6 w-6 text-[10px] rounded",
  md: "h-10 w-10 text-sm rounded-lg",
} as const;

export function WorkspaceAvatar({ workspace, size = "md", className = "" }: Props) {
  const [logoFailed, setLogoFailed] = useState(false);
  const color = workspace.themeColor ?? "#2563eb";
  const initials = workspace.code.slice(0, 2).toUpperCase();
  const showLogo = workspace.logoUrl && !logoFailed;

  if (showLogo) {
    return (
      <img
        src={workspace.logoUrl!}
        alt={workspace.name}
        className={`shrink-0 object-cover ${sizeClass[size]} ${className}`}
        onError={() => setLogoFailed(true)}
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center font-bold text-white ${sizeClass[size]} ${className}`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}
