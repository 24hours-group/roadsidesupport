import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./Alert.module.css";

export default function Alert({
  children,
  variant = "info",
  title,
  icon,
  className = "",
  onClose,
}) {
  const variants = {
    info: styles.info,
    success: styles.success,
    warning: styles.warning,
    error: styles.error,
  };

  const icons = {
    info: <InfoIcon className={styles.infoIcon} style={{ fontSize: 22 }} />,
    success: (
      <CheckCircleIcon
        className={styles.successIcon}
        style={{ fontSize: 22 }}
      />
    ),
    warning: (
      <WarningIcon className={styles.warningIcon} style={{ fontSize: 22 }} />
    ),
    error: <ErrorIcon className={styles.errorIcon} style={{ fontSize: 22 }} />,
  };

  return (
    <div className={`${styles.alert} ${variants[variant]} ${className}`}>
      <div className={styles.iconWrapper}>{icon || icons[variant]}</div>
      <div className={styles.content}>
        {title && <p className={styles.title}>{title}</p>}
        <div className={styles.message}>{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className={styles.closeButton}>
          <CloseIcon style={{ fontSize: 18 }} />
        </button>
      )}
    </div>
  );
}
