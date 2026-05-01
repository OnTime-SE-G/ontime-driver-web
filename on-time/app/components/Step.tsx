interface StepProps {
  done?: boolean;
  active?: boolean;
  icon: string;
  label: string;
}

export default function Step({ done, active, icon, label }: StepProps) {
  return (
    <div className="dashboard-step">
      <div
        className={`dashboard-step-bullet ${
          done
            ? "dashboard-step-bullet--done"
            : active
              ? "dashboard-step-bullet--active"
              : "dashboard-step-bullet--pending"
        }`}
      >
        <span className="material-symbols-outlined">{icon}</span>
      </div>

      <span
        className={`dashboard-step-label ${
          active || done
            ? "dashboard-step-label--active"
            : "dashboard-step-label--pending"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
