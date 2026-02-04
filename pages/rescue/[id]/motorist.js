import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Alert, DarkStepper } from "@/components/ui";
import SiteHeader from "@/components/SiteHeader";
import { motoristSchema } from "@/lib/schemas";
import { events } from "@/lib/analytics";
import AnimatedStyles from "@/components/AnimatedStyles";
import styles from "./motorist.module.css";

// MUI Icons
import PhoneIcon from "@mui/icons-material/Phone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";

export default function MotoristPage() {
  const router = useRouter();
  const { id } = router.query;
  const [requestData, setRequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(motoristSchema),
    defaultValues: { first_name: "", last_name: "", phone: "", email: "" },
  });

  useEffect(() => {
    if (!id) return;
    const saved = localStorage.getItem(`rescue_${id}`);
    if (saved) setRequestData(JSON.parse(saved));
    else router.replace("/rescue");
    setIsLoading(false);
  }, [id, router]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError(null);
    const updatedData = {
      ...requestData,
      motorist: data,
      status: "submitted",
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(`rescue_${id}`, JSON.stringify(updatedData));

    try {
      await fetch(`/api/rescue/${id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      events.requestSubmittedSuccess(id);
    } catch (e) {
      events.requestSubmittedSuccess(id);
    }
    events.motoristCompleted();
    router.push(`/rescue/${id}/done`);
  };

  if (isLoading || !requestData) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Contact Info - Roadside Support</title>
      </Head>
      <AnimatedStyles />
      <div className={styles.page}>
        <SiteHeader simple={true} />

        <div className={styles.progressContainer}>
          <div className={styles.progressInner}>
            <DarkStepper
              steps={["Situation", "Vehicle", "Contact"]}
              activeStep={2}
            />
          </div>
        </div>

        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.content}>
              <div className={styles.header}>
                <h1 className={styles.title}>How can we reach you?</h1>
                <p className={styles.subtitle}>
                  We'll call you as soon as possible with your pricing.
                </p>
              </div>

              {error && (
                <Alert variant="error" className="mb-4">
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.gridCols2}>
                  {/* First Name */}
                  <div className={styles.fieldContainer}>
                    <label className={styles.fieldLabel}>First Name *</label>
                    <div className={styles.inputWrapper}>
                      <div className={styles.inputIcon}>
                        <PersonIcon style={{ fontSize: 20 }} />
                      </div>
                      <input
                        {...register("first_name")}
                        placeholder="Anthony"
                        className={styles.input}
                      />
                    </div>
                    {errors.first_name && (
                      <p className={styles.error}>
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className={styles.fieldContainer}>
                    <label className={styles.fieldLabel}>Last Name *</label>
                    <div className={styles.inputWrapper}>
                      <div className={styles.inputIcon}>
                        <PersonIcon style={{ fontSize: 20 }} />
                      </div>
                      <input
                        {...register("last_name")}
                        placeholder="Smith"
                        className={styles.input}
                      />
                    </div>
                    {errors.last_name && (
                      <p className={styles.error}>{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className={styles.fieldContainer}>
                  <label className={styles.fieldLabel}>Phone Number *</label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputIcon}>
                      <ContactPhoneIcon style={{ fontSize: 20 }} />
                    </div>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="(555) 123-4567"
                      className={styles.input}
                    />
                  </div>
                  {errors.phone && (
                    <p className={styles.error}>{errors.phone.message}</p>
                  )}
                </div>

                {/* Email */}
                <div className={styles.fieldContainer}>
                  <label className={styles.fieldLabel}>Email *</label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputIcon}>
                      <EmailIcon style={{ fontSize: 20 }} />
                    </div>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="anthony@email.com"
                      className={styles.input}
                    />
                  </div>
                  {errors.email && (
                    <p className={styles.error}>{errors.email.message}</p>
                  )}
                </div>

                {/* Info Card */}
                <div className={styles.infoCard}>
                  <div className={styles.infoIconWrapper}>
                    <PhoneIcon style={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <h3 className={styles.infoTitle}>
                      Our team will call you shortly
                    </h3>
                    <p className={styles.infoText}>
                      A specialist will call you as soon as possible with
                      pricing and next steps.
                    </p>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <Button
                    type="submit"
                    variant="accent"
                    size="lg"
                    className="w-full py-4 text-lg shadow-accent-glow hover:shadow-accent-glow-lg transition-all duration-300"
                    isLoading={isSubmitting}
                  >
                    SUBMIT REQUEST{" "}
                    <CheckCircleIcon style={{ fontSize: 20, marginLeft: 8 }} />
                  </Button>

                  <button
                    type="button"
                    onClick={() => router.back()}
                    className={styles.backBtn}
                  >
                    GO BACK
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
