import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui";
import SiteHeader from "@/components/SiteHeader";
import { MapPreview } from "@/components/rescue";
import { SERVICE_TYPES } from "@/lib/schemas";
import AnimatedStyles from "@/components/AnimatedStyles";
import styles from "./service.module.css";

// MUI Icons
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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

export default function ServiceConfirmPage() {
  const router = useRouter();
  const { id } = router.query;
  const [requestData, setRequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Load request data from localStorage
    const saved = localStorage.getItem(`rescue_${id}`);
    if (saved) {
      setRequestData(JSON.parse(saved));
    } else {
      // Redirect if no data found
      router.replace("/rescue");
    }
    setIsLoading(false);
  }, [id, router]);

  if (isLoading || !requestData) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const service = SERVICE_TYPES[requestData.service_type];
  const IconComponent = service ? serviceIcons[service.icon] : null;

  return (
    <>
      <Head>
        <title>Confirm Location - Roadside Support</title>
        <meta
          name="description"
          content="Confirm your service and location details."
        />
      </Head>
      <AnimatedStyles />

      <div className={styles.page}>
        <SiteHeader simple={true} />

        <main className={styles.main}>
          <div className={styles.container}>
            {/* Back Link */}
            <button onClick={() => router.back()} className={styles.backLink}>
              <ArrowBackIcon style={{ fontSize: 20 }} />
              <span className={styles.backLinkText}>Change Selection</span>
            </button>

            {/* Header */}
            <div className={`${styles.header} animate-fade-in-up`}>
              <h1 className={styles.title}>Confirm Your Details</h1>
              <p className={styles.subtitle}>
                Please verify the information below is correct
              </p>
            </div>

            {/* Map Preview */}
            <div className={`${styles.mapPreview} animate-fade-in-up-1`}>
              <MapPreview location={requestData.pickup_location} height={200} />
            </div>

            {/* Location Card */}
            <div className={`${styles.infoCard} animate-fade-in-up-2`}>
              <div className={styles.infoCardInner}>
                <div className={styles.infoIconWrapper}>
                  <LocationOnIcon
                    className="text-primary"
                    style={{ fontSize: 24 }}
                  />
                </div>
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Pickup Location</p>
                  <p className={styles.infoValue}>
                    {requestData.pickup_location?.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Card */}
            <div className={`${styles.serviceCard} animate-fade-in-up-2`}>
              <div className={styles.serviceCardInner}>
                <div className={styles.serviceIconWrapper}>
                  {IconComponent && (
                    <IconComponent
                      className="text-primary-400"
                      style={{ fontSize: 24 }}
                    />
                  )}
                </div>
                <div className={styles.infoContent}>
                  <p className={styles.infoLabel}>Service Requested</p>
                  <p className={styles.serviceTitle}>
                    {service?.label || requestData.service_type}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className={`${styles.infoBox} animate-fade-in-up-3`}>
              <div className={styles.infoBoxInner}>
                <div className={styles.infoBoxIcon}>
                  <InfoOutlinedIcon
                    className="text-primary"
                    style={{ fontSize: 20 }}
                  />
                </div>
                <div>
                  <p className={styles.infoBoxTitle}>What happens next?</p>
                  <p className={styles.infoBoxText}>
                    After completing the form, a specialist will call you within
                    10 minutes to provide pricing and dispatch help.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`${styles.actions} animate-fade-in-up-4`}>
              <Button
                variant="accent"
                size="lg"
                className="w-full py-4 text-lg shadow-accent-glow hover:shadow-accent-glow-lg transition-all duration-300"
                onClick={() => router.push(`/rescue/${id}/situation`)}
              >
                CONTINUE TO DETAILS
                <ArrowForwardIcon className="ml-2" />
              </Button>

              <Link href="/rescue">
                <button className={styles.changeLink}>CHANGE SELECTION</button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
