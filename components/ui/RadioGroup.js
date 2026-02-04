import styles from "./RadioGroup.module.css";

export default function RadioGroup({
  name,
  options = [],
  value,
  onChange,
  error,
  label,
  orientation = "vertical",
}) {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div
        className={
          orientation === "vertical"
            ? styles.optionsVertical
            : styles.optionsHorizontal
        }
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`${styles.option} ${
              value === option.value
                ? styles.optionSelected
                : styles.optionDefault
            }`}
          >
            <div className={styles.radioWrapper}>
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className={styles.radioInput}
              />
              <div className={styles.radioCircle} />
            </div>
            <div className={styles.optionContent}>
              <span className={styles.optionLabel}>{option.label}</span>
              {option.description && (
                <span className={styles.optionDescription}>
                  {option.description}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
