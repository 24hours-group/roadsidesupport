import { forwardRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";

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
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed gap-2";

    const variants = {
      primary: "bg-primary text-white hover:bg-primary-700 hover:shadow-lg",
      secondary:
        "bg-secondary-100 text-secondary-800 hover:bg-secondary-200 border border-secondary-300",
      accent:
        "bg-primary text-white font-bold hover:bg-primary-800 hover:shadow-lg",
      outline:
        "border-2 border-primary text-primary hover:bg-primary hover:text-white",
      ghost: "text-secondary-700 hover:bg-secondary-100",
      danger: "bg-error text-white hover:bg-red-700 shadow-lg shadow-error/25",
    };

    const sizes = {
      sm: "py-2 px-4 text-sm",
      md: "py-3 px-6 text-base",
      lg: "py-4 px-8 text-lg",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
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
