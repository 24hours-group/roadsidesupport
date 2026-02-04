import { forwardRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./Button.module.css";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: styles.primary,
      secondary: styles.secondary,
      accent: styles.accent,
      outline: styles.outline,
      ghost: styles.ghost,
      danger: styles.danger,
    };

    const sizes = {
      sm: styles.sm,
      md: styles.md,
      lg: styles.lg,
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${styles.button} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <CircularProgress size={20} color="inherit" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
