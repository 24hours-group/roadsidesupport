import CheckIcon from "@mui/icons-material/Check";
import styles from "./ProgressSteps.module.css";

export default function ProgressSteps({
  steps = [],
  currentStep = 0,
  className = "",
}) {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.container}>
        {steps.map((step, index) => (
          <div key={index} className={styles.stepWrapper}>
            {/* Step Circle */}
            <div className={styles.stepContent}>
              <div
                className={`${styles.stepCircle} ${
                  index < currentStep
                    ? styles.stepCompleted
                    : index === currentStep
                      ? styles.stepActive
                      : styles.stepPending
                }`}
              >
                {index < currentStep ? (
                  <CheckIcon style={{ fontSize: 20 }} />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`${styles.stepLabel} ${
                  index <= currentStep
                    ? styles.stepLabelActive
                    : styles.stepLabelInactive
                }`}
              >
                {step}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={styles.connector}>
                <div
                  className={`${styles.connectorFill} ${
                    index < currentStep
                      ? styles.connectorComplete
                      : styles.connectorIncomplete
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
