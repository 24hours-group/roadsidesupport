import { forwardRef } from "react";
import styles from "./Input.module.css";

const Input = forwardRef(
  (
    { label, error, helperText, className = "", type = "text", ...props },
    ref,
  ) => {
    return (
      <div className={styles.wrapper}>
        {label && (
          <label className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`${styles.input} ${error ? styles.inputError : ""} ${className}`}
          {...props}
        />
        {error && <p className={styles.error}>{error}</p>}
        {helperText && !error && (
          <p className={styles.helperText}>{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
