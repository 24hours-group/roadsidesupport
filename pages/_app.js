import "@/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
  display: "swap",
  preload: true,
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;
  const isRescuePage = router.pathname.startsWith("/rescue");

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1E3A8A" />
      </Head>

      {/* Google Tag Manager (Non-blocking) */}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-K56RHDB3');
          `,
        }}
      />

      {/* Google Maps API - Only load when navigating to rescue pages */}
      {googleMapsKey && isRescuePage && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places&loading=async`}
          strategy="afterInteractive"
        />
      )}

      <main className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
