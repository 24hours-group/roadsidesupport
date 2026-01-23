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
    <div className="w-full">
      {label && <label className="input-label mb-3">{label}</label>}
      <div
        className={`flex ${orientation === "vertical" ? "flex-col gap-3" : "flex-row flex-wrap gap-4"}`}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
              ${
                value === option.value
                  ? "border-primary bg-primary-50 shadow-md"
                  : "border-secondary-200 bg-white hover:border-primary/50 hover:shadow-sm"
              }`}
          >
            <div className="relative">
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only peer"
              />
              <div
                className="w-5 h-5 rounded-full border-2 border-secondary-300 
                              peer-checked:border-primary peer-checked:border-[6px]
                              transition-all duration-200"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-secondary-800">
                {option.label}
              </span>
              {option.description && (
                <span className="text-sm text-secondary-500">
                  {option.description}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="input-error mt-2">{error}</p>}
    </div>
  );
}
