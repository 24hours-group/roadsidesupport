import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Alert, DarkStepper } from "@/components/ui";
import SiteHeader from "@/components/SiteHeader";
import { motoristSchema } from "@/lib/schemas";
import { events } from "@/lib/analytics";
import AnimatedStyles from "@/components/AnimatedStyles";

// MUI Icons
import PhoneIcon from "@mui/icons-material/Phone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

export default function MotoristPage() {
  const router = useRouter();
  const { id } = router.query;
  const [requestData, setRequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(motoristSchema),
    defaultValues: { first_name: "", last_name: "", phone: "", email: "" },
  });

  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem(`rescue_${id}`);
    if (saved) setRequestData(JSON.parse(saved));
    else router.replace("/rescue");
    setIsLoading(false);
  }, [id, router]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    const updatedData = {
      ...requestData,
      motorist: data,
      status: "submitted",
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(`rescue_${id}`, JSON.stringify(updatedData));

    try {
      await fetch(`/api/rescue/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      events.requestSubmittedSuccess(id);
    } catch (e) {
      events.requestSubmittedSuccess(id);
    }
    events.motoristCompleted();
    router.push(`/rescue/${id}/done`);
  };

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
        <title>Contact Info - Roadside Support</title>
      </Head>
      <AnimatedStyles />
      <div className="min-h-screen bg-dark text-white selection:bg-accent selection:text-dark">
        <SiteHeader simple={true} />

        <div className="pt-24 pb-8 px-4">
          <div className="max-w-2xl mx-auto">
            <DarkStepper
              steps={["Situation", "Vehicle", "Contact"]}
              activeStep={2}
            />
          </div>
        </div>

        <main className="px-4 pb-20">
          <div className="max-w-xl mx-auto">
            <div className="space-y-6">
              <div className="text-center md:text-left">
                <h1 className="text-3xl mobile:text-2xl font-bold text-white mb-3">
                  How can we reach you?
                </h1>
                <p className="text-lg mobile:text-base text-white/50 leading-relaxed">
                  We'll call you as soon as possible with your pricing.
                </p>
              </div>

              {error && (
                <Alert variant="error" className="mb-4">
                  {error}
                </Alert>
              )}

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-8 animate-fade-in-up"
              >
                <div className="grid grid-cols-2 gap-6">
                  {/* First Name */}
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-white block">
                      First Name *
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent transition-transform duration-300 group-focus-within:scale-110">
                        <PersonIcon style={{ fontSize: 20 }} />
                      </div>
                      <input
                        {...register("first_name")}
                        placeholder="Anthony"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white placeholder:text-white/30 focus:border-accent focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-lg"
                      />
                    </div>
                    {errors.first_name && (
                      <p className="text-red-400 text-sm mt-1 animate-shake">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-white block">
                      Last Name *
                    </label>
                    <div className="relative group">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent transition-transform duration-300 group-focus-within:scale-110">
                        <PersonIcon style={{ fontSize: 20 }} />
                      </div>
                      <input
                        {...register("last_name")}
                        placeholder="Smith"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white placeholder:text-white/30 focus:border-accent focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-lg"
                      />
                    </div>
                    {errors.last_name && (
                      <p className="text-red-400 text-sm mt-1 animate-shake">
                        {errors.last_name.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-white block">
                    Phone Number *
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent transition-transform duration-300 group-focus-within:scale-110">
                      <ContactPhoneIcon style={{ fontSize: 20 }} />
                    </div>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white placeholder:text-white/30 focus:border-accent focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-lg"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1 animate-shake">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="text-lg font-semibold text-white block">
                    Email *
                  </label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-accent transition-transform duration-300 group-focus-within:scale-110">
                      <EmailIcon style={{ fontSize: 20 }} />
                    </div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="anthony@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 pl-12 text-white placeholder:text-white/30 focus:border-accent focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-accent transition-all duration-300 text-lg"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1 animate-shake">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Info Card */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-start gap-4 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 text-accent">
                    <PhoneIcon style={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg mobile:text-base mb-1">
                      Our team will call you shortly
                    </h3>
                    <p className="text-white/60 leading-relaxed mobile:text-sm">
                      A specialist will call you as soon as possible with
                      pricing and next steps.
                    </p>
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
                    SUBMIT REQUEST{" "}
                    <CheckCircleIcon style={{ fontSize: 20, marginLeft: 8 }} />
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
