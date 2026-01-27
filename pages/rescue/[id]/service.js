import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui";
import SiteHeader from "@/components/SiteHeader";
import { MapPreview } from "@/components/rescue";
import { SERVICE_TYPES } from "@/lib/schemas";
import AnimatedStyles from "@/components/AnimatedStyles";

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
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
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

      <div className="min-h-screen bg-dark text-white selection:bg-accent selection:text-dark">
        <SiteHeader simple={true} />

        <main className="pt-24 px-4 pb-20">
          <div className="max-w-xl mx-auto">
            {/* Back Link */}
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
            >
              <ArrowBackIcon style={{ fontSize: 20 }} />
              <span className="font-medium">Change Selection</span>
            </button>

            {/* Header */}
            <div className="text-center mb-8 animate-fade-in-up">
              <h1 className="text-3xl mobile:text-2xl font-bold text-white mb-3 tracking-tight">
                Confirm Your Details
              </h1>
              <p className="text-white/50 text-lg mobile:text-base">
                Please verify the information below is correct
              </p>
            </div>

            {/* Map Preview */}
            <div className="rounded-2xl overflow-hidden mb-6 border border-white/10 animate-fade-in-up animate-fade-in-up-1">
              <MapPreview location={requestData.pickup_location} height={200} />
            </div>

            {/* Location Card */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-4 animate-fade-in-up animate-fade-in-up-2">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                  <LocationOnIcon
                    className="text-accent"
                    style={{ fontSize: 24 }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/40 text-xs uppercase tracking-wider font-medium mb-1">
                    Pickup Location
                  </p>
                  <p className="text-white font-medium text-lg leading-snug">
                    {requestData.pickup_location?.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Card */}
            <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 mb-8 animate-fade-in-up animate-fade-in-up-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center flex-shrink-0">
                  {IconComponent && (
                    <IconComponent
                      className="text-primary-400"
                      style={{ fontSize: 24 }}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white/40 text-xs uppercase tracking-wider font-medium mb-1">
                    Service Requested
                  </p>
                  <p className="text-white font-semibold text-lg">
                    {service?.label || requestData.service_type}
                  </p>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-accent/5 border border-accent/10 rounded-2xl p-5 mb-10 animate-fade-in-up animate-fade-in-up-3">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <InfoOutlinedIcon
                    className="text-accent"
                    style={{ fontSize: 20 }}
                  />
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">
                    What happens next?
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed">
                    After completing the form, a specialist will call you within
                    10 minutes to provide pricing and dispatch help.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 animate-fade-in-up animate-fade-in-up-4">
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
                <button className="w-full text-center text-white/40 hover:text-white font-semibold text-sm py-3 transition-colors duration-200">
                  CHANGE SELECTION
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
