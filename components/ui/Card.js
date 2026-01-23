export default function Card({
  children,
  className = "",
  variant = "default",
  hover = false,
  padding = "md",
}) {
  const variants = {
    default: "bg-white border border-secondary-200 shadow-card",
    glass: "glass-card",
    glassDark: "glass-card-dark",
    outline: "bg-white border-2 border-secondary-200",
    elevated: "bg-white shadow-lg",
  };

  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`rounded-2xl ${variants[variant]} ${paddings[padding]} 
                  ${hover ? "hover:shadow-card-hover transition-shadow duration-300" : ""} 
                  ${className}`}
    >
      {children}
    </div>
  );
}
