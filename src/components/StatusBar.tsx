type StatusBarProps = {
  loading: boolean;
  refreshTime?: Date;
  refresh: () => void;
};

export const StatusBar = ({ loading, refreshTime, refresh }: StatusBarProps) => {
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
      <div className="status-bar__row">
        <p className="status-bar__message">{message}</p>
        <button
          type="button"
          className="status-bar__refresh"
          onClick={() => void refresh()}
          aria-label="Refresh weather"
          disabled={loading}
        >
          Refresh
        </button>
      </div>
    </div>
  );
};
