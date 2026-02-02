import CircularProgress from "@mui/material/CircularProgress";

export default function Spinner({ size = "md", className = "" }) {
  const sizes = {
    sm: 16,
    md: 32,
    lg: 48,
    xl: 64,
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <CircularProgress
        size={sizes[size]}
        className="text-primary"
        sx={{ color: "#FF6D00" }}
      />
    </div>
  );
}
