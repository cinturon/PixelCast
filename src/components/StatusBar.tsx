type StatusBarProps = {
  loading: boolean;
  refreshTime?: Date;
};

export const StatusBar = ({ loading, refreshTime }: StatusBarProps) => {
  const message = loading
    ? "Loading..."
    : refreshTime
      ? `Last refreshed: ${refreshTime.toLocaleTimeString()}`
      : "Not refreshed yet";

  return (
    <div
      className={`status-bar${loading ? " status-bar--loading" : ""}`}
      role="status"
      aria-live="polite"
      aria-busy={loading}
    >
      <p className="status-bar__message">{message}</p>
    </div>
  );
};
