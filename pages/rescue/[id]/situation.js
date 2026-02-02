import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DarkStepper } from "@/components/ui";
import SiteHeader from "@/components/SiteHeader";
import { SERVICE_TYPES, getSituationSchema } from "@/lib/schemas";
import { events } from "@/lib/analytics";
import AnimatedStyles from "@/components/AnimatedStyles";

// MUI Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TireRepairIcon from "@mui/icons-material/TireRepair";
import BatteryChargingFullIcon from "@mui/icons-material/BatteryChargingFull";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const serviceIcons = {
  tire: TireRepairIcon,
  battery: BatteryChargingFullIcon,
  key: VpnKeyIcon,
  fuel: LocalGasStationIcon,
  tow: LocalShippingIcon,
  winch: OfflineBoltIcon,
};

export default function SituationPage() {
  const router = useRouter();
  const { id } = router.query;
  const [requestData, setRequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem(`rescue_${id}`);
    if (saved) {
      setRequestData(JSON.parse(saved));
    } else {
      router.replace("/rescue");
    }
    setIsLoading(false);
  }, [id, router]);

  const serviceType = requestData?.service_type;
  const schema = serviceType ? getSituationSchema(serviceType) : null;
  const service = serviceType ? SERVICE_TYPES[serviceType] : null;
  const IconComponent = service ? serviceIcons[service.icon] : null;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    defaultValues: getDefaultValues(serviceType),
  });

  const needsRide = watch("needs_ride");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const updatedData = {
      ...requestData,
      situation: data,
      updated_at: new Date().toISOString(),
    };
    // Only save to localStorage - database submission happens on final step
    localStorage.setItem(`rescue_${id}`, JSON.stringify(updatedData));

    events.situationCompleted(serviceType);
    router.push(`/rescue/${id}/vehicle`);
  };

  if (isLoading || !requestData) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Situation Details - Roadside Support</title>
      </Head>
      <AnimatedStyles />

      <div className="min-h-screen bg-dark text-white selection:bg-primary selection:text-white">
        <SiteHeader simple={true} />

        {/* Progress */}
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-2xl mx-auto">
            <DarkStepper
              steps={["Situation", "Vehicle", "Contact"]}
              activeStep={0}
            />
          </div>
        </div>

        {/* Content */}
        <main className="px-4 pb-20">
          <div className="max-w-xl mx-auto space-y-8">
            {/* Service Badge */}
            <div className="relative overflow-hidden bg-gradient-to-br from-secondary-800 to-secondary-900 border border-white/10 rounded-2xl p-6 shadow-2xl mobile:p-4">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                {IconComponent && <IconComponent style={{ fontSize: 120 }} />}
              </div>
              <div className="relative flex items-center gap-5 z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-primary-900/20 border border-primary-500/30 flex items-center justify-center backdrop-blur-sm shadow-inner">
                  {IconComponent && (
                    <IconComponent
                      className="text-primary-300 drop-shadow-md"
                      style={{ fontSize: 36 }}
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">
                    {service?.label}
                  </h2>
                  <p className="text-white/60 font-medium">
                    {service?.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Form Container */}
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h1 className="text-3xl mobile:text-2xl font-bold text-white mb-3">
                  Describe the situation
                </h1>
                <p className="text-lg mobile:text-base text-white/50 leading-relaxed">
                  Help us prepare the right tools for your rescue.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-8 animate-fade-in-up">
                  {serviceType === "flat_tire" && (
                    <FlatTireFields control={control} errors={errors} />
                  )}
                  {serviceType === "jump_start" && (
                    <JumpStartFields control={control} errors={errors} />
                  )}
                  {serviceType === "lockout" && (
                    <LockoutFields control={control} errors={errors} />
                  )}
                  {serviceType === "fuel_delivery" && (
                    <FuelDeliveryFields control={control} errors={errors} />
                  )}
                  {serviceType === "basic_tow" && (
                    <BasicTowFields
                      control={control}
                      errors={errors}
                      needsRide={needsRide}
                    />
                  )}
                  {serviceType === "winch_out" && (
                    <WinchOutFields control={control} errors={errors} />
                  )}
                </div>

                <div className="pt-8 space-y-4">
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full py-4 text-lg shadow-accent-glow hover:shadow-accent-glow-lg transition-all duration-300"
                    isLoading={isSubmitting}
                  >
                    CONTINUE
                    <ArrowForwardIcon className="ml-2" />
                  </Button>

                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="w-full text-center text-white/40 hover:text-white font-semibold text-sm py-3 transition-colors duration-200"
                  >
                    GO BACK
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// Improved Selection Components

function SelectionCard({ selected, onClick, children, className = "" }) {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer group rounded-xl border-2 transition-all duration-300 overflow-hidden ${
        selected
          ? "border-primary bg-primary/5 shadow-[0_0_20px_rgba(255,109,0,0.1)]"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
      } ${className}`}
    >
      <div className="relative z-10">{children}</div>
      {selected && (
        <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center animate-scale-in">
          <CheckCircleIcon className="text-white" style={{ fontSize: 14 }} />
        </div>
      )}
    </div>
  );
}

function YesNoRadio({ label, value, onChange, error }) {
  return (
    <div className="space-y-3">
      <label className="text-lg font-semibold text-white block">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        {[true, false].map((optValue) => {
          const isYes = optValue === true;
          return (
            <SelectionCard
              key={isYes ? "yes" : "no"}
              selected={value === optValue}
              onClick={() => onChange(optValue)}
              className="py-4 px-6 mobile:py-2 mobile:px-4 flex items-center justify-center text-center"
            >
              <span
                className={`font-bold text-lg ${
                  value === optValue ? "text-primary" : "text-white/80"
                }`}
              >
                {isYes ? "Yes" : "No"}
              </span>
            </SelectionCard>
          );
        })}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-shake">
          <ErrorOutlineIcon style={{ fontSize: 16 }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

function NumberSelector({ label, value, onChange, max = 4, error }) {
  return (
    <div className="space-y-3">
      <label className="text-lg font-semibold text-white block">{label}</label>
      <div className="flex gap-2">
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <SelectionCard
            key={n}
            selected={value === n}
            onClick={() => onChange(n)}
            className="flex-1 py-3 mobile:py-2 flex items-center justify-center"
          >
            <span
              className={`font-bold text-lg ${
                value === n ? "text-primary" : "text-white/80"
              }`}
            >
              {n}
              {n === max && max >= 5 ? "+" : ""}
            </span>
          </SelectionCard>
        ))}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-shake">
          <ErrorOutlineIcon style={{ fontSize: 16 }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

function OptionGrid({ label, options, value, onChange, error }) {
  return (
    <div className="space-y-3">
      <label className="text-lg font-semibold text-white block">{label}</label>
      <div className="grid grid-cols-2 gap-3">
        {options.map((opt) => (
          <SelectionCard
            key={opt.value}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
            className="py-3 px-4 mobile:py-2 mobile:px-2 flex items-center justify-center text-center"
          >
            <span
              className={`font-medium capitalize ${
                value === opt.value ? "text-primary" : "text-white/80"
              }`}
            >
              {opt.label}
            </span>
          </SelectionCard>
        ))}
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-shake">
          <ErrorOutlineIcon style={{ fontSize: 16 }} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Form Fields

function FlatTireFields({ control, errors }) {
  return (
    <div className="space-y-8 mobile:space-y-4">
      <Controller
        name="tire_count"
        control={control}
        render={({ field }) => (
          <NumberSelector
            label="How many tires are flat?"
            value={field.value}
            onChange={field.onChange}
            max={4}
            error={errors.tire_count?.message}
          />
        )}
      />
      <div className="h-px bg-white/10" />
      <Controller
        name="has_spare"
        control={control}
        render={({ field }) => (
          <YesNoRadio
            label="Do you have a spare tire?"
            value={field.value}
            onChange={field.onChange}
            error={errors.has_spare?.message}
          />
        )}
      />
      <div className="h-px bg-white/10" />
      <Controller
        name="safe_location"
        control={control}
        render={({ field }) => (
          <YesNoRadio
            label="Are you in a safe location?"
            value={field.value}
            onChange={field.onChange}
            error={errors.safe_location?.message}
          />
        )}
      />
    </div>
  );
}

function JumpStartFields({ control, errors }) {
  return (
    <div className="space-y-8 mobile:space-y-4">
      <Controller
        name="battery_accessible"
        control={control}
        render={({ field }) => (
          <YesNoRadio
            label="Is the battery accessible?"
            value={field.value}
            onChange={field.onChange}
            error={errors.battery_accessible?.message}
          />
        )}
      />
      <div className="h-px bg-white/10" />
      <Controller
        name="safe_location"
        control={control}
        render={({ field }) => (
          <YesNoRadio
            label="Are you in a safe location?"
            value={field.value}
            onChange={field.onChange}
            error={errors.safe_location?.message}
          />
        )}
      />
    </div>
  );
}

function LockoutFields({ control, errors }) {
  return (
    <div className="space-y-8 mobile:space-y-4">
      <Controller
        name="keys_inside"
        control={control}
        render={({ field }) => (
          <YesNoRadio
            label="Are your keys locked inside?"
            value={field.value}
            onChange={field.onChange}
            error={errors.keys_inside?.message}
          />
        )}
      />
      <div className="h-px bg-white/10" />
      <Controller
        name="key_fob_inside"
        control={control}
        render={({ field }) => (
          <YesNoRadio
            label="Is a key fob inside?"
            value={field.value}
            onChange={field.onChange}
            error={errors.key_fob_inside?.message}
          />
        )}
      />
      <div className="h-px bg-white/10" />
      <Controller
        name="safe_location"
        control={control}
        render={({ field }) => (
          <YesNoRadio
            label="Are you in a safe location?"
            value={field.value}
            onChange={field.onChange}
            error={errors.safe_location?.message}
          />
        )}
      />
    </div>
  );
}

function FuelDeliveryFields({ control, errors }) {
  return (
    <div className="space-y-8 mobile:space-y-4">
      <Controller
        name="fuel_type"
        control={control}
        render={({ field }) => (
          <OptionGrid
            label="Fuel type needed?"
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: "gasoline", label: "Gasoline" },
              { value: "diesel", label: "Diesel" },
            ]}
            error={errors.fuel_type?.message}
          />
        )}
      />
      <div className="h-px bg-white/10" />
      <Controller
        name="gallons_needed"
        control={control}
        render={({ field }) => (
          <NumberSelector
            label="How many gallons?"
            value={field.value}
            onChange={field.onChange}
            max={5}
            error={errors.gallons_needed?.message}
          />
        )}
      />
      <div className="h-px bg-white/10" />
      <Controller
        name="safe_location"
        control={control}
        render={({ field }) => (
          <YesNoRadio
            label="Are you in a safe location?"
            value={field.value}
            onChange={field.onChange}
            error={errors.safe_location?.message}
          />
        )}
      />
    </div>
  );
}

function BasicTowFields({ control, errors, needsRide }) {
  return (
    <div className="space-y-8 mobile:space-y-4">
      <Controller
        name="tow_destination"
        control={control}
        render={({ field }) => (
          <div className="space-y-3">
            <label className="text-lg font-semibold text-white block">
              Where do you want your vehicle towed?
            </label>
            <p className="text-white/50 text-sm">
              Tow to a trusted repair shop, dealership, body shop, or your home.
            </p>
            <AddressInput
              value={field.value}
              onChange={field.onChange}
              placeholder="Enter address..."
            />
            {errors.tow_destination && (
              <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-shake">
                <ErrorOutlineIcon style={{ fontSize: 16 }} />
                <span>{errors.tow_destination.message}</span>
              </div>
            )}
          </div>
        )}
      />
      <div className="h-px bg-white/10" />
      <Controller
        name="keys_with_you"
        control={control}
        render={({ field }) => (
          <YesNoRadio
            label="Do you have your keys with you?"
            value={field.value}
            onChange={field.onChange}
            error={errors.keys_with_you?.message}
          />
        )}
      />
      <div className="h-px bg-white/10" />
      <Controller
        name="can_shift_neutral"
        control={control}
        render={({ field }) => (
          <YesNoRadio
            label="Is your vehicle able to shift into neutral?"
            value={field.value}
            onChange={field.onChange}
            error={errors.can_shift_neutral?.message}
          />
        )}
      />
      <div className="h-px bg-white/10" />
      <Controller
        name="needs_ride"
        control={control}
        render={({ field }) => (
          <YesNoRadio
            label="Do you need a ride?"
            value={field.value}
            onChange={field.onChange}
            error={errors.needs_ride?.message}
          />
        )}
      />
      {needsRide && (
        <div className="animate-fade-in-up">
          <div className="h-px bg-white/10 mb-8" />
          <Controller
            name="passenger_count"
            control={control}
            render={({ field }) => (
              <NumberSelector
                label="How many passengers need a ride?"
                value={field.value}
                onChange={field.onChange}
                max={5}
                error={errors.passenger_count?.message}
              />
            )}
          />
        </div>
      )}
    </div>
  );
}

// Address Input with Google Places Autocomplete
function AddressInput({ value, onChange, placeholder }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    let checkInterval;

    const initAutocomplete = () => {
      if (
        typeof window !== "undefined" &&
        window.google?.maps?.places &&
        inputRef.current &&
        !autocompleteRef.current
      ) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["address"],
            componentRestrictions: { country: "us" },
          },
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          if (place.formatted_address) {
            onChange(place.formatted_address);
          } else if (place.name) {
            onChange(place.name);
          }
        });

        if (checkInterval) clearInterval(checkInterval);
        return true;
      }
      return false;
    };

    if (!initAutocomplete()) {
      checkInterval = setInterval(() => {
        if (initAutocomplete()) {
          clearInterval(checkInterval);
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [onChange]);

  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary transition-transform duration-300 group-focus-within:scale-110 pointer-events-none">
        <LocationOnIcon style={{ fontSize: 24 }} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-14 text-white placeholder:text-white/30 focus:border-primary focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-primary transition-all duration-300 text-lg"
      />
    </div>
  );
}

function WinchOutFields({ control, errors }) {
  return (
    <div className="space-y-8 mobile:space-y-4">
      <Controller
        name="stuck_in"
        control={control}
        render={({ field }) => (
          <OptionGrid
            label="What is your vehicle stuck in?"
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: "mud", label: "Mud" },
              { value: "snow", label: "Snow" },
              { value: "sand", label: "Sand" },
              { value: "ditch", label: "Ditch" },
              { value: "other", label: "Other" },
            ]}
            error={errors.stuck_in?.message}
          />
        )}
      />
      <div className="h-px bg-white/10" />
      <Controller
        name="drivable_after"
        control={control}
        render={({ field }) => (
          <OptionGrid
            label="Will vehicle be drivable after recovery?"
            value={field.value}
            onChange={field.onChange}
            options={[
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "unknown", label: "I'm Not Sure" },
            ]}
            error={errors.drivable_after?.message}
          />
        )}
      />
      <div className="h-px bg-white/10" />
      <Controller
        name="safe_location"
        control={control}
        render={({ field }) => (
          <YesNoRadio
            label="Are you in a safe location?"
            value={field.value}
            onChange={field.onChange}
            error={errors.safe_location?.message}
          />
        )}
      />
    </div>
  );
}

function getDefaultValues(serviceType) {
  switch (serviceType) {
    case "flat_tire":
      return { tire_count: 1, has_spare: undefined, safe_location: undefined };
    case "jump_start":
      return {
        vehicle_wont_start: true,
        battery_accessible: undefined,
        safe_location: undefined,
      };
    case "lockout":
      return {
        keys_inside: undefined,
        key_fob_inside: undefined,
        safe_location: undefined,
      };
    case "fuel_delivery":
      return { fuel_type: "", gallons_needed: 2, safe_location: undefined };
    case "basic_tow":
      return {
        tow_destination: "",
        keys_with_you: undefined,
        can_shift_neutral: undefined,
        needs_ride: undefined,
      };
    case "winch_out":
      return { stuck_in: "", drivable_after: "", safe_location: undefined };
    default:
      return {};
  }
}
