import styles from "./Card.module.css";

export default function Card({
  children,
  className = "",
  variant = "default",
  hover = false,
  padding = "md",
}) {
  const variants = {
    default: styles.default,
    glass: styles.glass,
    glassDark: styles.glassDark,
    outline: styles.outline,
    elevated: styles.elevated,
  };

  const paddings = {
    none: styles.paddingNone,
    sm: styles.paddingSm,
    md: styles.paddingMd,
    lg: styles.paddingLg,
  };

  return (
    <div
      className={`${styles.card} ${variants[variant]} ${paddings[padding]} 
                  ${hover ? styles.hoverable : ""} 
                  ${className}`}
    >
      {children}
    </div>
  );
}
