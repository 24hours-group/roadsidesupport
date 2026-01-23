import CheckIcon from "@mui/icons-material/Check";

export default function ProgressSteps({
  steps = [],
  currentStep = 0,
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`progress-step ${
                  index < currentStep
                    ? "progress-step-completed"
                    : index === currentStep
                      ? "progress-step-active"
                      : "progress-step-pending"
                }`}
              >
                {index < currentStep ? (
                  <CheckIcon style={{ fontSize: 20 }} />
                ) : (
                  index + 1
                )}
              </div>
              <span
                className={`mt-2 text-xs font-semibold text-center max-w-[80px] hidden sm:block ${
                  index <= currentStep ? "text-primary" : "text-secondary-500"
                }`}
              >
                {step}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 rounded-full bg-secondary-200 overflow-hidden">
                <div
                  className={`h-full bg-primary transition-all duration-500 ${
                    index < currentStep ? "w-full" : "w-0"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
