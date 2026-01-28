import "@/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
});

export default function App({ Component, pageProps }) {
  const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1E3A8A" />
      </Head>

      {/* Google Maps API */}
      {googleMapsKey && (
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
