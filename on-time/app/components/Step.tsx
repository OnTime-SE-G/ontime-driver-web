interface StepProps {
  done?: boolean;
  active?: boolean;
  icon: string;
  label: string;
  onClick?: () => void;
}

export default function Step({
  label,
  icon,
  done,
  active,
  onClick,
}: StepProps) {
  const stateClass = done
    ? "dashboard-step-button--done"
    : active
      ? "dashboard-step-button--active"
      : "dashboard-step-button--pending";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`dashboard-step-button ${stateClass}`}
      aria-current={active ? "step" : undefined}
    >
      <div className="dashboard-step-icon-wrap">
        <span className="material-symbols-outlined dashboard-step-icon">
          {icon}
        </span>
      </div>

      <span className="dashboard-step-text">{label}</span>
    </button>
  );
}
