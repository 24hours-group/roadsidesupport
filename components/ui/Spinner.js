import CircularProgress from "@mui/material/CircularProgress";
import styles from "./Spinner.module.css";

export default function Spinner({ size = "md", className = "" }) {
  const sizes = {
    sm: 16,
    md: 32,
    lg: 48,
    xl: 64,
  };

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <CircularProgress
        size={sizes[size]}
        className={styles.spinner}
        sx={{ color: "#FF6D00" }}
      />
    </div>
  );
}
