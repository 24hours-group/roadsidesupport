import Link from "next/link";
import Image from "next/image";
import PhoneIcon from "@mui/icons-material/Phone";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import styles from "./SiteHeader.module.css";

export default function SiteHeader({ simple = false }) {
  return (
    <header className={styles.header}>
      <div className="container-app">
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logoLink}>
            <div className={`${styles.logoWrapper}`}>
              <Image
                src="/RSS-logo.png"
                alt="Roadside Support Logo"
                width={160}
                height={160}
                priority
                className={styles.logoImage}
              />
            </div>
            <div className={styles.brandText}>
              <span className={`${styles.brandName}`}>Roadside Support</span>
              {!simple && (
                <span className={styles.brandTagline}>Roadside Assistance</span>
              )}
            </div>
          </Link>

          {/* Actions */}
          <div className={styles.actions}>
            <a href="tel:+18886811841" className={styles.phoneLink}>
              <div className={styles.phoneIcon}>
                <PhoneIcon style={{ fontSize: 18 }} />
              </div>
              <span className={styles.phoneNumber}>(888) 681-1841</span>
            </a>

            {!simple && (
              <Link href="/rescue" className={`${styles.ctaButton}`}>
                <SupportAgentIcon style={{ fontSize: 20 }} />
                <span>Get Help Now</span>
              </Link>
            )}

            {/* Simple Mobile Phone Button for Rescue Flow */}
            {simple && (
              <a href="tel:+18886811841" className={styles.mobilePhoneButton}>
                <PhoneIcon style={{ fontSize: 18 }} />
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
