import { forwardRef } from "react";
import styles from "./Checkbox.module.css";

const Checkbox = forwardRef(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className={styles.wrapper}>
        <label className={styles.label}>
          <div className={styles.inputWrapper}>
            <input
              ref={ref}
              type="checkbox"
              className={styles.input}
              {...props}
            />
            <div className={styles.checkbox}>
              <svg
                className={styles.checkIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <span className={styles.labelText}>{label}</span>
        </label>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
