import { forwardRef } from "react";
import styles from "./Select.module.css";

const Select = forwardRef(
  (
    {
      label,
      error,
      options = [],
      placeholder = "Select an option",
      className = "",
      ...props
    },
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
        <select
          ref={ref}
          className={`${styles.select} ${error ? styles.selectError : ""} ${className}`}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className={styles.error}>{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
