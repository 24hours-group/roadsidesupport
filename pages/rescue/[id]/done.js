import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { SERVICE_TYPES } from "@/lib/schemas";
import AnimatedStyles from "@/components/AnimatedStyles";
import styles from "./done.module.css";

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
      <div className={styles.page}>
        <SiteHeader simple={true} />

        <main className={styles.main}>
          <div className={styles.container}>
            {/* Success Card */}
            <div className={styles.successCard}>
              {/* Animated Phone Icon with Pulse Rings */}
              <div className={styles.iconWrapper}>
                {/* Outer pulse rings */}
                <div className={`${styles.pulseRing} animate-pulse-ring`} />
                <div
                  className={`${styles.pulseRing} animate-pulse-ring-delayed`}
                />

                {/* Main circle */}
                <div className={styles.mainCircle}>
                  <div className={styles.iconBounce}>
                    <PhoneIcon
                      className="text-primary"
                      style={{ fontSize: 40 }}
                    />
                  </div>
                </div>
              </div>

              {/* Main Heading */}
              <h1
                className={`${styles.title} animate-fade-in-up animate-fade-in-up-1`}
              >
                Help Is On The Way
              </h1>

              {/* Subtext */}
              <p
                className={`${styles.subtitle} animate-fade-in-up animate-fade-in-up-2`}
              >
                A specialist will contact you shortly
              </p>

              {/* Request ID Badge */}
              <div
                className={`${styles.requestBadge} animate-fade-in-up animate-fade-in-up-2`}
              >
                <CheckCircleOutlineIcon
                  className="text-green-400"
                  style={{ fontSize: 18 }}
                />
                <span className={styles.requestLabel}>Request</span>
                <span className={styles.requestId}>
                  {id?.substring(0, 8).toUpperCase()}
                </span>
              </div>

              {/* Details Card */}
              {requestData && (
                <div
                  className={`${styles.detailsCard} animate-fade-in-up animate-fade-in-up-3`}
                >
                  <div className={styles.detailsContent}>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Service</span>
                      <span className={styles.detailValue}>
                        {SERVICE_TYPES[requestData.service_type]?.label}
                      </span>
                    </div>
                    <div className={styles.detailDivider} />
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Location</span>
                      <span className={styles.detailValueTruncate}>
                        {requestData.pickup_location?.address?.split(",")[0]}
                      </span>
                    </div>
                    {requestData.motorist && (
                      <>
                        <div className={styles.detailDivider} />
                        <div className={styles.detailRow}>
                          <span className={styles.detailLabel}>Contact</span>
                          <span className={styles.detailValue}>
                            {requestData.motorist.phone}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Wait Time Indicator */}
              <div
                className={`${styles.waitTime} animate-fade-in-up animate-fade-in-up-4`}
              >
                <div className={styles.waitTimeLabel}>
                  <AccessTimeIcon style={{ fontSize: 18 }} />
                  <span className={styles.waitTimeLabelText}>
                    Typical wait time:
                  </span>
                </div>
                <span className={styles.waitTimeValue}>Under 5 minutes</span>
              </div>

              {/* Action Buttons */}
              <div
                className={`${styles.actions} animate-fade-in-up animate-fade-in-up-5`}
              >
                {/* Emergency Call */}
                <a href="tel:+18886811841" className={styles.callButton}>
                  <PhoneIcon style={{ fontSize: 20 }} />
                  <span>Can&apos;t wait? Call (888) 681-1841</span>
                </a>

                {/* Return Home */}
                <Link href="/" className={styles.homeLink}>
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
