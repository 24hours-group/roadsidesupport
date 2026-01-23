import { forwardRef } from "react";

const Checkbox = forwardRef(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className="sr-only peer"
              {...props}
            />
            <div
              className="w-6 h-6 rounded-lg border-2 border-secondary-300 bg-white 
                          peer-checked:bg-primary peer-checked:border-primary
                          peer-focus:ring-2 peer-focus:ring-primary/20
                          transition-all duration-200 flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
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
          <span className="text-secondary-700 group-hover:text-secondary-900 transition-colors">
            {label}
          </span>
        </label>
        {error && <p className="input-error mt-1">{error}</p>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
