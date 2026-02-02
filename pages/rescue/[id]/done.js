import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { SERVICE_TYPES } from "@/lib/schemas";
import AnimatedStyles from "@/components/AnimatedStyles";
import PhoneIcon from "@mui/icons-material/Phone";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function DonePage() {
  const router = useRouter();
  const { id } = router.query;
  const [requestData, setRequestData] = useState(null);

  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem(`rescue_${id}`);
    if (saved) setRequestData(JSON.parse(saved));
  }, [id]);

  return (
    <>
      <Head>
        <title>Request Submitted - Roadside Support</title>
      </Head>
      <AnimatedStyles />
      <div className="min-h-screen bg-dark text-white selection:bg-primary selection:text-white">
        <SiteHeader simple={true} />

        <main className="pt-24 px-4 pb-8 flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto w-full">
            {/* Success Card */}
            <div className="text-center">
              {/* Animated Phone Icon with Pulse Rings */}
              <div className="relative w-32 h-32 mx-auto mb-8 animate-fade-in-up">
                {/* Outer pulse rings */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-pulse-ring" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-ring-delayed" />

                {/* Main circle */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
                  <div className="animate-gentle-bounce">
                    <PhoneIcon
                      className="text-primary"
                      style={{ fontSize: 40 }}
                    />
                  </div>
                </div>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl font-bold text-white mb-3 tracking-tight animate-fade-in-up animate-fade-in-up-1">
                Help Is On The Way
              </h1>

              {/* Subtext */}
              <p className="text-white/60 text-lg mb-8 animate-fade-in-up animate-fade-in-up-2">
                A specialist will contact you shortly
              </p>

              {/* Request ID Badge */}
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 mb-10 animate-fade-in-up animate-fade-in-up-2">
                <CheckCircleOutlineIcon
                  className="text-green-400"
                  style={{ fontSize: 18 }}
                />
                <span className="text-white/50 text-sm">Request</span>
                <span className="font-mono font-semibold text-white tracking-wider">
                  {id?.substring(0, 8).toUpperCase()}
                </span>
              </div>

              {/* Details Card */}
              {requestData && (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 mb-6 text-left animate-fade-in-up animate-fade-in-up-3">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-sm">Service</span>
                      <span className="text-white font-medium">
                        {SERVICE_TYPES[requestData.service_type]?.label}
                      </span>
                    </div>
                    <div className="h-px bg-white/[0.06]" />
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-sm">Location</span>
                      <span className="text-white font-medium text-right max-w-[60%] truncate">
                        {requestData.pickup_location?.address?.split(",")[0]}
                      </span>
                    </div>
                    {requestData.motorist && (
                      <>
                        <div className="h-px bg-white/[0.06]" />
                        <div className="flex items-center justify-between">
                          <span className="text-white/40 text-sm">Contact</span>
                          <span className="text-white font-medium">
                            {requestData.motorist.phone}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Wait Time Indicator */}
              <div className="flex items-center justify-center gap-3 mb-10 animate-fade-in-up animate-fade-in-up-4">
                <div className="flex items-center gap-2 text-white/40">
                  <AccessTimeIcon style={{ fontSize: 18 }} />
                  <span className="text-sm">Typical wait time:</span>
                </div>
                <span className="text-primary font-semibold text-sm">
                  Under 5 minutes
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 animate-fade-in-up animate-fade-in-up-5">
                {/* Emergency Call */}
                <a
                  href="tel:+15551234567"
                  className="flex items-center justify-center gap-3 w-full bg-white text-dark font-semibold py-4 px-6 rounded-xl hover:bg-white/90 transition-all duration-200 shadow-lg shadow-white/5"
                >
                  <PhoneIcon style={{ fontSize: 20 }} />
                  <span>Can&apos;t wait? Call (555) 123-4567</span>
                </a>

                {/* Return Home */}
                <Link
                  href="/"
                  className="flex items-center justify-center gap-2 w-full text-white/50 font-medium py-3 px-6 rounded-xl hover:text-white/80 hover:bg-white/5 transition-all duration-200"
                >
                  <HomeIcon style={{ fontSize: 18 }} />
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
