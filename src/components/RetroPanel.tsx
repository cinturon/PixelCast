import type { ReactNode } from "react";

type RetroPanelProps = {
  children: ReactNode;
  className?: string;
};

export const RetroPanel = ({ children, className }: RetroPanelProps) => {
  const classes = ["retro-panel", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <div className="retro-panel__body">{children}</div>
    </div>
  );
};
