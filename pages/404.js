import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui";
import SiteHeader from "@/components/SiteHeader";

// MUI Icons
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HomeIcon from "@mui/icons-material/Home";
import PhoneIcon from "@mui/icons-material/Phone";

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found - Roadside Support</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-dark text-white">
        <SiteHeader simple={true} />

        <main className="pt-32 pb-20 px-4 flex items-center justify-center min-h-screen">
          <div className="max-w-md mx-auto text-center">
            {/* 404 Illustration */}
            <div className="relative mb-8">
              <div className="text-[150px] font-black text-white/5 leading-none select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-soft">
                  <ErrorOutlineIcon
                    className="text-primary"
                    style={{ fontSize: 48 }}
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <h1 className="text-3xl font-bold text-white mb-4">
              Page Not Found
            </h1>
            <p className="text-white/60 text-lg mb-8 leading-relaxed">
              Looks like you've taken a wrong turn. Don't worry, we'll help you
              get back on track.
            </p>

            {/* Actions */}
            <div className="space-y-4">
              <Link href="/">
                <Button variant="accent" size="lg" className="w-full">
                  <HomeIcon style={{ fontSize: 20 }} />
                  Go Home
                </Button>
              </Link>

              <Link href="/rescue">
                <Button variant="outline" size="lg" className="w-full">
                  <PhoneIcon style={{ fontSize: 20 }} />
                  Get Roadside Help
                </Button>
              </Link>
            </div>

            {/* Support Info */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-white/40 text-sm">
                Need immediate assistance? Call us at{" "}
                <a
                  href="tel:+15551234567"
                  className="text-primary hover:underline font-semibold"
                >
                  (555) 123-4567
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
