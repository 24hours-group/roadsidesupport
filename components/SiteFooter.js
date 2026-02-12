import Link from "next/link";
import Image from "next/image";
import PhoneIcon from "@mui/icons-material/Phone";
import { SERVICE_TYPES } from "@/lib/schemas";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className="container-app">
        <div className={styles.gridLayout}>
          {/* Brand */}
          <div className={styles.brandSection}>
            <Link href="/" className={styles.brandLink}>
              <div className={styles.logoWrapper}>
                <Image
                  src="/RSS-logo.png"
                  alt="Roadside Support Logo"
                  width={160}
                  height={160}
                  className={styles.logoImage}
                />
              </div>
              <span className={styles.brandName}>Roadside Support</span>
            </Link>
            <p className={styles.tagline}>
              The modern way to get roadside assistance. Fast, transparent, and
              membership-free.
            </p>
            <div className={styles.socialLinks}>
              {/* Social placeholders */}
            </div>
          </div>

          {/* Links */}
          <div className={styles.linksSection}>
            <h4 className={styles.sectionTitle}>Services</h4>
            <ul className={styles.linksList}>
              {Object.values(SERVICE_TYPES)
                .slice(0, 4)
                .map((service) => (
                  <li key={service.id}>
                    <Link href="/rescue" className={styles.serviceLink}>
                      {service.label}
                    </Link>
                  </li>
                ))}
              <li>
                <Link href="/rescue" className={styles.viewAllLink}>
                  View All
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className={styles.sectionTitle}>Contact</h4>
            <ul className={styles.linksList}>
              <li>
                <a href="tel:+18886811841" className={styles.contactLink}>
                  <PhoneIcon style={{ fontSize: 18 }} />
                  (888) 681-1841
                </a>
              </li>
              <li>
                <a
                  href="mailto:roadside-support@24hours-group.com"
                  className={styles.emailLink}
                >
                  roadside-support@24hours-group.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottomBar}>
          <p>© {new Date().getFullYear()} Roadside Support.</p>
        </div>
      </div>
    </footer>
  );
}
