import { forwardRef } from "react";

const Input = forwardRef(
  (
    { label, error, helperText, className = "", type = "text", ...props },
    ref,
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="input-label">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`input-field ${error ? "input-field-error" : ""} ${className}`}
          {...props}
        />
        {error && <p className="input-error">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-secondary-500 mt-1">{helperText}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
