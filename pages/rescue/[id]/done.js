import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui";
import SiteHeader from "@/components/SiteHeader";
import { SERVICE_TYPES } from "@/lib/schemas";
import PhoneIcon from "@mui/icons-material/Phone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";

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
      <div className="min-h-screen bg-dark text-white selection:bg-accent selection:text-dark">
        <SiteHeader simple={true} />

        <main className="pt-24 px-4 pb-8 flex items-center justify-center min-h-screen">
          <div className="max-w-lg mx-auto w-full">
            <div className="bg-secondary-900/80 backdrop-blur-md border border-white/5 rounded-2xl p-8 mobile:p-4 text-center shadow-2xl relative overflow-hidden">
              {/* Glow Effect */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

              {/* Success Icon */}
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 border-4 border-green-500/20 flex items-center justify-center relative z-10">
                <div className="absolute inset-0 rounded-full border border-green-500 animate-ping-slow opacity-20" />
                <CheckCircleIcon
                  className="text-green-500 drop-shadow-md"
                  style={{ fontSize: 48 }}
                />
              </div>

              <h1 className="text-3xl font-bold text-white mb-2">
                Request Submitted!
              </h1>
              <p className="text-white/70 text-lg mb-8">
                Help has been alerted.
              </p>

              {/* Request ID */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm">
                <p className="text-white/50 text-sm mb-1 uppercase tracking-widest font-semibold">
                  Request ID
                </p>
                <p className="text-2xl font-mono font-bold text-accent tracking-widest">
                  {id?.substring(0, 8).toUpperCase()}
                </p>
              </div>

              {/* Details */}
              {requestData && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 text-left space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/50">Service</span>
                    <span className="text-white font-medium">
                      {SERVICE_TYPES[requestData.service_type]?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Location</span>
                    <span className="text-white font-medium text-right max-w-[60%] truncate">
                      {requestData.pickup_location?.address?.split(",")[0]}
                    </span>
                  </div>
                  {requestData.motorist && (
                    <div className="flex justify-between">
                      <span className="text-white/50">Phone</span>
                      <span className="text-white font-medium">
                        {requestData.motorist.phone}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Callback Info */}
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-5 mobile:p-4 mb-8 text-left flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-accent text-dark flex items-center justify-center flex-shrink-0 font-bold shadow-lg">
                  <PhoneIcon style={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="text-white font-bold text-lg mobile:text-base mb-1">
                    Wait for our call
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed mobile:text-sm">
                    A specialist will call you as soon as possible to confirm
                    pricing and dispatch.
                  </p>
                </div>
              </div>

              {/* Support Call */}
              <div className="flex mobile:flex-col mobile:gap-4 items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 mobile:p-3 mb-6">
                <div className="text-left mobile:text-center">
                  <p className="text-white/50 text-xs uppercase tracking-wide font-semibold">
                    Emergency?
                  </p>
                  <p className="text-white font-semibold">Call us directly</p>
                </div>
                <a
                  href="tel:+15551234567"
                  className="bg-white/10 text-white font-bold px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-white/20 transition-colors border border-white/10"
                >
                  <PhoneIcon style={{ fontSize: 18 }} />
                  (555) 123-4567
                </a>
              </div>

              {/* Return Home */}
              <Link href="/">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full bg-secondary-800/50 border-white/10 text-white hover:bg-secondary-800 hover:border-white/20"
                >
                  <HomeIcon style={{ fontSize: 20 }} />
                  Return to Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
