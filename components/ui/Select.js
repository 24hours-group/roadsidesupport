import { forwardRef } from "react";

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
      <div className="w-full">
        {label && (
          <label className="input-label">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          className={`input-field ${error ? "input-field-error" : ""} ${className}`}
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
        {error && <p className="input-error">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
