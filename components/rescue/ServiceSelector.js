import { SERVICE_TYPES } from "@/lib/schemas";
import TireRepairIcon from "@mui/icons-material/TireRepair";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";

const serviceIcons = {
  tire: TireRepairIcon,
  battery: BatteryChargingFullIcon,
  key: VpnKeyIcon,
  fuel: LocalGasStationIcon,
  tow: LocalShippingIcon,
  winch: OfflineBoltIcon,
};

export default function ServiceSelector({ value, onChange, error }) {
  const services = Object.values(SERVICE_TYPES);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => {
          const IconComponent = serviceIcons[service.icon];
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onChange(service.id)}
              className={`service-card ${value === service.id ? "service-card-selected" : ""}`}
            >
              <div
                className={`${value === service.id ? "text-primary" : "text-secondary-500"} transition-colors`}
              >
                {IconComponent && <IconComponent style={{ fontSize: 40 }} />}
              </div>
              <h3 className="font-semibold text-secondary-800">
                {service.label}
              </h3>
              <p className="text-sm text-secondary-500 hidden sm:block">
                {service.description}
              </p>
            </button>
          );
        })}
      </div>
      {error && <p className="input-error mt-3 text-center">{error}</p>}
    </div>
  );
}
