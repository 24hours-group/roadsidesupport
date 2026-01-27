import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, DarkStepper } from "@/components/ui";
import SiteHeader from "@/components/SiteHeader";
import { vehicleSchema } from "@/lib/schemas";
import { events } from "@/lib/analytics";
import { VEHICLE_MAKES, POPULAR_MODELS } from "@/lib/vehicleMakes";
import AnimatedStyles from "@/components/AnimatedStyles";

// MUI Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PaletteIcon from "@mui/icons-material/Palette";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function VehiclePage() {
  const router = useRouter();
  const { id } = router.query;
  const [requestData, setRequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State to track manual input modes
  const [isManualMake, setIsManualMake] = useState(false);
  const [isManualModel, setIsManualModel] = useState(false);

  // Refs for auto-focusing
  const makeInputRef = useRef(null);
  const modelInputRef = useRef(null);

  useEffect(() => {
    if (isManualMake && makeInputRef.current) {
      makeInputRef.current.focus();
    }
  }, [isManualMake]);

  useEffect(() => {
    if (isManualModel && modelInputRef.current) {
      modelInputRef.current.focus();
    }
  }, [isManualModel]);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1979 + 1 },
    (_, i) => currentYear + 1 - i,
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      year: currentYear,
      color: "",
      is_awd: false,
    },
  });

  const isAwd = watch("is_awd");
  const selectedMake = watch("make");

  const availableModels =
    !isManualMake && selectedMake ? POPULAR_MODELS[selectedMake] : [];

  const handleMakeChange = (e) => {
    const val = e.target.value;
    if (val === "Other") {
      setIsManualMake(true);
      setIsManualModel(true);
      setValue("make", "");
      setValue("model", "");
    } else {
      setIsManualMake(false);
      setIsManualModel(false);
      // If make changes, clear model unless it's just initializing
      if (watch("model") !== "") setValue("model", "");
    }
  };

  const handleModelChange = (e) => {
    const val = e.target.value;
    if (val === "__manual__") {
      setIsManualModel(true);
      setValue("model", "");
    } else {
      setIsManualModel(false);
    }
  };

  // Effect: Ensure manual model is enforced if make is manual
  useEffect(() => {
    if (isManualMake && !isManualModel) {
      setIsManualModel(true);
    }
  }, [isManualMake, isManualModel]);

  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem(`rescue_${id}`);
    if (saved) setRequestData(JSON.parse(saved));
    else router.replace("/rescue");
    setIsLoading(false);
  }, [id, router]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const updatedData = {
      ...requestData,
      vehicle: data,
      updated_at: new Date().toISOString(),
    };
    // Only save to localStorage - database submission happens on final step
    localStorage.setItem(`rescue_${id}`, JSON.stringify(updatedData));

    events.vehicleCompleted();
    router.push(`/rescue/${id}/motorist`);
  };

  // Register refs for react-hook-form to share with our manual refs
  const { ref: makeRef, ...makeRest } = register("make");
  const { ref: modelRef, ...modelRest } = register("model");

  if (isLoading || !requestData) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Vehicle Info - Roadside Support</title>
      </Head>
      <AnimatedStyles />

      <div className="min-h-screen bg-dark text-white selection:bg-accent selection:text-dark">
        <SiteHeader simple={true} />

        {/* Progress */}
        <div className="pt-24 pb-8 px-4">
          <div className="max-w-2xl mx-auto">
            <DarkStepper
              steps={["Situation", "Vehicle", "Contact"]}
              activeStep={1}
            />
          </div>
        </div>

        {/* Content */}
        <main className="px-4 pb-20">
          <div className="max-w-xl mx-auto space-y-8">
            {/* Form Container */}
            <div className="space-y-6 ">
              <div className="text-center md:text-left">
                <h1 className="text-3xl mobile:text-2xl font-bold text-white mb-3">
                  Tell us about your vehicle
                </h1>
                <p className="text-lg mobile:text-base text-white/50 leading-relaxed">
                  This helps our technician prepare the right tools.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8 mobile:space-y-6 animate-fade-in-up"
              >
                {/* Make Input */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-lg font-semibold text-white block">
                      Make *
                    </label>
                    {isManualMake && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsManualMake(false);
                          setIsManualModel(false);
                          setValue("make", "");
                          setValue("model", "");
                        }}
                        className="text-accent text-sm font-medium hover:underline flex items-center gap-1"
                      >
                        Show List
                      </button>
                    )}
                  </div>

                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent transition-transform duration-300 group-focus-within:scale-110 pointer-events-none">
                      <DriveEtaIcon style={{ fontSize: 24 }} />
                    </div>

                    {!isManualMake ? (
                      <>
                        <select
                          {...makeRest}
                          ref={makeRef}
                          onChange={(e) => {
                            makeRest.onChange(e);
                            handleMakeChange(e);
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-14 text-white focus:border-accent focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-lg appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-dark text-white/50">
                            Select vehicle make...
                          </option>
                          {VEHICLE_MAKES.map((make) => (
                            <option
                              key={make}
                              value={make}
                              className="bg-dark text-white"
                            >
                              {make}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ArrowForwardIcon
                            className="text-white/30 rotate-90"
                            style={{ fontSize: 20 }}
                          />
                        </div>
                      </>
                    ) : (
                      <input
                        {...makeRest}
                        ref={(e) => {
                          makeRef(e);
                          makeInputRef.current = e;
                        }}
                        key="manual-make-input"
                        placeholder="Type vehicle make (e.g. Pontiac)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-14 text-white placeholder:text-white/30 focus:border-accent focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-lg"
                      />
                    )}
                  </div>
                  {errors.make && (
                    <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-shake">
                      <ErrorOutlineIcon style={{ fontSize: 16 }} />
                      <span>{errors.make.message}</span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/10" />

                {/* Model Input */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-lg font-semibold text-white block">
                      Model *
                    </label>
                    {isManualModel && !isManualMake && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsManualModel(false);
                          setValue("model", "");
                        }}
                        className="text-accent text-sm font-medium hover:underline flex items-center gap-1"
                      >
                        Show List
                      </button>
                    )}
                  </div>

                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent transition-transform duration-300 group-focus-within:scale-110 pointer-events-none">
                      <DirectionsCarIcon style={{ fontSize: 24 }} />
                    </div>

                    {!isManualModel &&
                    availableModels &&
                    availableModels.length > 0 ? (
                      <div className="relative">
                        <select
                          {...modelRest}
                          ref={modelRef}
                          onChange={(e) => {
                            modelRest.onChange(e);
                            handleModelChange(e);
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-14 text-white focus:border-accent focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-lg appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-dark text-white/50">
                            Select model...
                          </option>
                          {availableModels.map((model) => (
                            <option
                              key={model}
                              value={model}
                              className="bg-dark text-white"
                            >
                              {model}
                            </option>
                          ))}
                          <option
                            value="__manual__"
                            className="bg-dark text-accent font-semibold"
                          >
                            + Type Manual Model
                          </option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                          <ArrowForwardIcon
                            className="text-white/30 rotate-90"
                            style={{ fontSize: 20 }}
                          />
                        </div>
                      </div>
                    ) : (
                      <input
                        {...modelRest}
                        ref={(e) => {
                          modelRef(e);
                          modelInputRef.current = e;
                        }}
                        key="manual-model-input"
                        placeholder={
                          selectedMake ? "Type model name" : "Select make first"
                        }
                        disabled={!selectedMake && !isManualMake}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-14 text-white placeholder:text-white/30 focus:border-accent focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    )}
                  </div>
                  {errors.model && (
                    <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-shake">
                      <ErrorOutlineIcon style={{ fontSize: 16 }} />
                      <span>{errors.model.message}</span>
                    </div>
                  )}
                </div>

                <div className="h-px bg-white/10" />

                <div className="grid grid-cols-2 gap-6">
                  {/* Year Select */}
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-white block">
                      Year *
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent transition-transform duration-300 group-focus-within:scale-110 pointer-events-none">
                        <CalendarTodayIcon style={{ fontSize: 20 }} />
                      </div>
                      <select
                        {...register("year", { valueAsNumber: true })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white focus:border-accent focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-lg appearance-none cursor-pointer"
                      >
                        {years.map((y) => (
                          <option
                            key={y}
                            value={y}
                            className="bg-dark text-white"
                          >
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Color Input */}
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-white block">
                      Color *
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent transition-transform duration-300 group-focus-within:scale-110">
                        <PaletteIcon style={{ fontSize: 20 }} />
                      </div>
                      <input
                        {...register("color")}
                        placeholder="e.g. Black"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white placeholder:text-white/30 focus:border-accent focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-lg"
                      />
                    </div>
                    {errors.color && (
                      <div className="flex items-center gap-2 text-red-400 text-sm mt-2 animate-shake">
                        <ErrorOutlineIcon style={{ fontSize: 16 }} />
                        <span>{errors.color.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* AWD Checkbox Card */}
                <div
                  onClick={() => setValue("is_awd", !isAwd)}
                  className={`relative cursor-pointer group rounded-xl border-2 transition-all duration-300 overflow-hidden flex items-center p-4 gap-4 ${
                    isAwd
                      ? "border-accent bg-accent/5 shadow-[0_0_20px_rgba(212,160,23,0.1)]"
                      : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-colors ${isAwd ? "bg-accent border-accent" : "border-white/30"}`}
                  >
                    {isAwd && (
                      <CheckCircleIcon
                        className="text-dark"
                        style={{ fontSize: 16 }}
                      />
                    )}
                  </div>
                  <div>
                    <span
                      className={`block font-bold text-lg ${isAwd ? "text-white" : "text-white/80"}`}
                    >
                      AWD / 4WD
                    </span>
                    <span className="text-sm text-white/40">
                      Vehicle has All-Wheel Drive or 4-Wheel Drive
                    </span>
                  </div>
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
