import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { Button, Card, Alert, Spinner, Input } from "@/components/ui";
import SiteHeader from "@/components/SiteHeader";
import DefaultMap from "@/components/rescue/DefaultMap";
import { SERVICE_TYPES } from "@/lib/schemas";
import { events } from "@/lib/analytics";

// MUI Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import EditLocationIcon from "@mui/icons-material/EditLocation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TireRepairIcon from "@mui/icons-material/TireRepair";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import SearchIcon from "@mui/icons-material/Search";

const serviceIcons = {
  tire: TireRepairIcon,
  battery: BatteryChargingFullIcon,
  key: VpnKeyIcon,
  fuel: LocalGasStationIcon,
  tow: LocalShippingIcon,
  winch: OfflineBoltIcon,
};

export default function RescuePage() {
  const router = useRouter();
  const [step, setStep] = useState("service"); // 'service' | 'location'
  const [serviceType, setServiceType] = useState("");
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [manualAddress, setManualAddress] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  // Focus ref for manual input
  const manualInputRef = useRef(null);

  useEffect(() => {
    events.rescueStarted();
  }, []);

  useEffect(() => {
    if (showManualInput && manualInputRef.current) {
      manualInputRef.current.focus();
    }
  }, [showManualInput]);

  const selectedService = serviceType ? SERVICE_TYPES[serviceType] : null;
  const IconComponent = selectedService
    ? serviceIcons[selectedService.icon]
    : null;

  // Get current GPS location
  const handleGetCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported");
      return;
    }

    setIsGettingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

        // Try reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { "User-Agent": "RoadsideSupport/1.0" } },
          );
          const data = await response.json();
          if (data.display_name) {
            address = data.display_name;
          }
        } catch (e) {
          console.warn("Geocoding failed");
        }

        setLocation({ address, lat: latitude, lng: longitude, source: "gps" });
        setIsGettingLocation(false);
        setShowManualInput(false);
        events.locationConfirmed("gps");
      },
      (err) => {
        setIsGettingLocation(false);
        setLocationError("Could not get location. Please enter manually.");
        setShowManualInput(true); // Auto-show manual input on error
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleManualLocationSubmit = (e) => {
    e.preventDefault();
    if (!manualAddress.trim()) return;

    setLocation({
      address: manualAddress,
      lat: 0,
      lng: 0,
      source: "manual",
    });
    setShowManualInput(false);
    events.locationConfirmed("manual");
  };

  const handleContinue = async () => {
    if (!serviceType || !location) return;

    setIsLoading(true);

    // Get or create persistent device ID
    let deviceId = localStorage.getItem("device_id");
    if (!deviceId) {
      deviceId = uuidv4();
      localStorage.setItem("device_id", deviceId);
    }

    const requestId = uuidv4();
    const requestData = {
      request_id: requestId,
      device_id: deviceId, // Persistent per device
      service_type: serviceType,
      pickup_location: location,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // Only save to localStorage - database submission happens on final step
    localStorage.setItem(`rescue_${requestId}`, JSON.stringify(requestData));

    router.push(`/rescue/${requestId}/situation`);
  };

  return (
    <>
      <Head>
        <title>Get Roadside Help - Roadside Support</title>
        <meta name="description" content="Request roadside assistance now." />
      </Head>

      <div className="min-h-screen bg-dark">
        <SiteHeader simple={true} />

        {/* Main Content */}
        <main className="pt-20 mobile:pt-4 mobile:pb-16 min-h-screen flex flex-col">
          <div className="flex-1 px-4 pb-8">
            <div className="max-w-lg mx-auto">
              {/* Map Container - Same width as content */}
              <div className="h-44 relative overflow-hidden rounded-t-2xl mb-0">
                <DefaultMap location={location} />
              </div>
              {/* Location Status */}
              {location && (
                <div className="mb-4 flex items-center gap-2 text-white/80 text-sm">
                  <LocationOnIcon
                    style={{ fontSize: 18 }}
                    className="text-accent"
                  />
                  <span className="truncate flex-1">{location.address}</span>
                  <button
                    onClick={() => {
                      setStep("location");
                      setManualAddress(location.address || "");
                      setShowManualInput(true);
                      setLocation(null);
                    }}
                    className="text-accent hover:underline font-medium"
                  >
                    EDIT
                  </button>
                </div>
              )}

              {/* Service Selection Card */}
              {selectedService && step !== "service" && (
                <div className="bg-secondary-800 border border-secondary-700 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                      {IconComponent && (
                        <IconComponent
                          className="text-primary-300"
                          style={{ fontSize: 28 }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold">
                        {selectedService.label}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {selectedService.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step: Service Selection */}
              {step === "service" && (
                <div className="bg-secondary-900/95 backdrop-blur-sm border border-secondary-700 border-t-0 rounded-b-2xl p-6">
                  <h1 className="text-2xl font-bold text-white mb-2">
                    What do you need?
                  </h1>
                  <p className="text-white/60 mb-6">
                    Select the service you require
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {Object.values(SERVICE_TYPES).map((service) => {
                      const Icon = serviceIcons[service.icon];
                      const isSelected = serviceType === service.id;
                      return (
                        <button
                          key={service.id}
                          onClick={() => {
                            setServiceType(service.id);
                            events.serviceSelected(service.id);
                          }}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                            isSelected
                              ? "border-accent bg-accent/10 text-white"
                              : "border-secondary-600 bg-secondary-800/50 text-white/70 hover:border-secondary-500"
                          }`}
                        >
                          {Icon && (
                            <Icon
                              style={{ fontSize: 32 }}
                              className={isSelected ? "text-accent" : ""}
                            />
                          )}
                          <span className="font-medium text-sm">
                            {service.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    variant="accent"
                    size="lg"
                    className="w-full"
                    disabled={!serviceType}
                    onClick={() => setStep("location")}
                  >
                    Continue
                    <ArrowForwardIcon style={{ fontSize: 20 }} />
                  </Button>
                </div>
              )}

              {/* Step: Location */}
              {step === "location" && (
                <div className="bg-secondary-900/95 backdrop-blur-sm border border-secondary-700 border-t-0 rounded-b-2xl p-6 text-center">
                  {/* Illustration */}
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-secondary-800 border-4 border-secondary-700 flex items-center justify-center relative">
                    <div
                      className={`absolute w-20 h-20 rounded-full bg-accent/20 ${!location ? "animate-ping" : ""}`}
                    />
                    <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center z-10">
                      <LocationOnIcon
                        className="text-dark"
                        style={{ fontSize: 32 }}
                      />
                    </div>
                  </div>

                  <h1 className="text-2xl font-bold text-white mb-2">
                    Where are you?
                  </h1>
                  <p className="text-white/60 mb-8">
                    We need your location to send help.
                  </p>

                  {locationError && (
                    <Alert variant="error" className="mb-4 text-left">
                      {locationError}
                    </Alert>
                  )}

                  {location ? (
                    <div className="space-y-4">
                      <div className="bg-secondary-800 rounded-xl p-4 flex items-start gap-3">
                        <CheckCircleIcon
                          className="text-green-500 flex-shrink-0 mt-0.5"
                          style={{ fontSize: 24 }}
                        />
                        <div className="text-left flex-1 min-w-0">
                          <p className="text-white font-medium text-sm">
                            Location set
                          </p>
                          <p className="text-white/60 text-sm break-words">
                            {location.address}
                          </p>
                        </div>
                      </div>

                      <Button
                        variant="accent"
                        size="lg"
                        className="w-full"
                        isLoading={isLoading}
                        onClick={handleContinue}
                      >
                        Confirm Location
                        <ArrowForwardIcon
                          style={{ fontSize: 20, marginLeft: 8 }}
                        />
                      </Button>

                      <button
                        onClick={() => {
                          setManualAddress(location.address || "");
                          setShowManualInput(true);
                          setLocation(null);
                        }}
                        className="text-white/50 hover:text-white text-sm font-medium"
                      >
                        Edit Location
                      </button>
                    </div>
                  ) : showManualInput ? (
                    // Manual Input UI
                    <form
                      onSubmit={handleManualLocationSubmit}
                      className="space-y-4 animate-fade-in-up"
                    >
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent">
                          <SearchIcon style={{ fontSize: 20 }} />
                        </div>
                        <input
                          ref={manualInputRef}
                          type="text"
                          value={manualAddress}
                          onChange={(e) => setManualAddress(e.target.value)}
                          placeholder="Enter address, highway marker, or landmark..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white placeholder:text-white/30 focus:border-accent focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-lg"
                        />
                      </div>

                      <Button
                        type="submit"
                        variant="accent"
                        size="lg"
                        className="w-full"
                        disabled={!manualAddress.trim()}
                      >
                        Set Location
                      </Button>

                      <button
                        type="button"
                        onClick={() => setShowManualInput(false)}
                        className="text-accent hover:underline font-semibold text-sm"
                      >
                        Use GPS Instead
                      </button>
                    </form>
                  ) : (
                    // Initial Choices UI
                    <div className="space-y-4">
                      <Button
                        variant="accent"
                        size="lg"
                        className="w-full py-4 text-lg mobile:text-sm"
                        isLoading={isGettingLocation}
                        onClick={handleGetCurrentLocation}
                      >
                        <MyLocationIcon style={{ fontSize: 20 }} />
                        USE MY CURRENT LOCATION
                      </Button>

                      <div className="flex items-center gap-4">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-white/40 text-sm">OR</span>
                        <div className="h-px flex-1 bg-white/10" />
                      </div>

                      <button
                        onClick={() => {
                          setShowManualInput(true);
                          setManualAddress("");
                        }}
                        className="w-full bg-white/5 border border-white/10 text-white font-semibold py-4 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2 group mobile:text-sm"
                      >
                        <EditLocationIcon className="text-white/50 group-hover:text-accent transition-colors" />
                        ENTER ADDRESS MANUALLY
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => setStep("service")}
                    className="mt-6 text-white/40 hover:text-white text-sm"
                  >
                    Back to Services
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
