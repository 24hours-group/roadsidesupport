import { SERVICE_TYPES } from "@/lib/schemas";
import TireRepairIcon from "@mui/icons-material/TireRepair";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import BuildIcon from "@mui/icons-material/Build";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import styles from "./ServiceSelector.module.css";

const serviceIcons = {
  tire: TireRepairIcon,
  battery: BatteryChargingFullIcon,
  key: VpnKeyIcon,
  fuel: LocalGasStationIcon,
  tow: LocalShippingIcon,
  winch: OfflineBoltIcon,
  mechanic: BuildIcon,
  other: HelpOutlineIcon,
};

export default function ServiceSelector({ value, onChange, error }) {
  const services = Object.values(SERVICE_TYPES);

  return (
    <div className={styles.wrapper}>
      <div className={styles.gridLayout}>
        {services.map((service) => {
          const IconComponent = serviceIcons[service.icon];
          const isSelected = value === service.id;
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onChange(service.id)}
              className={`${styles.serviceCard} ${isSelected ? styles.serviceCardSelected : ""}`}
            >
              <div
                className={
                  isSelected ? styles.iconSelected : styles.iconDefault
                }
              >
                {IconComponent && <IconComponent style={{ fontSize: 40 }} />}
              </div>
              <h3 className={styles.serviceLabel}>{service.label}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </button>
          );
        })}
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
