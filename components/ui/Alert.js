import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";

export default function Alert({
  children,
  variant = "info",
  title,
  icon,
  className = "",
  onClose,
}) {
  const variants = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  const icons = {
    info: <InfoIcon className="text-blue-500" style={{ fontSize: 22 }} />,
    success: (
      <CheckCircleIcon className="text-green-500" style={{ fontSize: 22 }} />
    ),
    warning: (
      <WarningIcon className="text-amber-500" style={{ fontSize: 22 }} />
    ),
    error: <ErrorIcon className="text-red-500" style={{ fontSize: 22 }} />,
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${variants[variant]} ${className}`}
    >
      <div className="flex-shrink-0">{icon || icons[variant]}</div>
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
        >
          <CloseIcon style={{ fontSize: 18 }} />
        </button>
      )}
    </div>
  );
}
