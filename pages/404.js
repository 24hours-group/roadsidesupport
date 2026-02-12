import Head from "next/head";
import Link from "next/link";
import { Button } from "@/components/ui";
import SiteHeader from "@/components/SiteHeader";
import styles from "./404.module.css";

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

      <div className={styles.page}>
        <SiteHeader simple={true} />

        <main className={styles.main}>
          <div className={styles.container}>
            {/* 404 Illustration */}
            <div className={styles.illustration}>
              <div className={styles.illustrationText}>404</div>
              <div className={styles.illustrationOverlay}>
                <div className={styles.illustrationIcon}>
                  <ErrorOutlineIcon
                    className="text-primary"
                    style={{ fontSize: 48 }}
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            <h1 className={styles.title}>Page Not Found</h1>
            <p className={styles.subtitle}>
              Looks like you've taken a wrong turn. Don't worry, we'll help you
              get back on track.
            </p>

            {/* Actions */}
            <div className={styles.actions}>
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
            <div className={styles.supportInfo}>
              <p className={styles.supportText}>
                Need immediate assistance? Call us at{" "}
                <a href="tel:+18886811841" className={styles.supportLink}>
                  (888) 681-1841
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
