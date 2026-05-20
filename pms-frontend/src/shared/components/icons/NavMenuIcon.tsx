import type { LucideIcon } from "lucide-react";

const defaultClass = "h-5 w-5 shrink-0 opacity-90";

type Props = {
  icon: LucideIcon;
  className?: string;
};

/** Icon kích thước thống nhất cho menu sidebar trái */
export function NavMenuIcon({ icon: Icon, className }: Props) {
  return (
    <Icon className={className ?? defaultClass} strokeWidth={2} aria-hidden />
  );
}
