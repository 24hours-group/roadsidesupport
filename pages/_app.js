import "@/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsKey}&libraries=places`}
          strategy="lazyOnload"
        />
      )}

      <main className={`${inter.variable} font-sans`}>
        <Component {...pageProps} />
      </main>
    </>
  );
}
