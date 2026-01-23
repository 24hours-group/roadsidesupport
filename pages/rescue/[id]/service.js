import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Layout } from "@/components/layout";
import { Button, Card, Alert } from "@/components/ui";
import { MapPreview } from "@/components/rescue";
import { SERVICE_TYPES } from "@/lib/schemas";

export default function ServiceConfirmPage() {
  const router = useRouter();
  const { id } = router.query;
  const [requestData, setRequestData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Load request data from localStorage
    const saved = localStorage.getItem(`rescue_${id}`);
    if (saved) {
      setRequestData(JSON.parse(saved));
    } else {
      // Redirect if no data found
      router.replace("/rescue");
    }
    setIsLoading(false);
  }, [id, router]);

  if (isLoading || !requestData) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  const service = SERVICE_TYPES[requestData.service_type];

  return (
    <>
      <Head>
        <title>Confirm Location - Roadside Support</title>
        <meta
          name="description"
          content="Confirm your service and location details."
        />
      </Head>

      <Layout showFooter={false}>
        <div className="min-h-screen bg-background py-8">
          <div className="container-narrow">
            {/* Back Link */}
            <Link
              href="/rescue"
              className="inline-flex items-center gap-2 text-secondary-600 hover:text-primary transition-colors mb-8"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Change Selection
            </Link>

            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-secondary-900 mb-3">
                Confirm Your Details
              </h1>
              <p className="text-secondary-600">
                Please verify the information below is correct.
              </p>
            </div>

            {/* Map Preview */}
            <Card padding="lg" className="mb-6">
              <MapPreview location={requestData.pickup_location} height={250} />
            </Card>

            {/* Service Details */}
            <Card padding="lg" className="mb-8">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center text-primary">
                  <svg
                    className="w-7 h-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">
                    Service Requested
                  </p>
                  <p className="text-xl font-semibold text-secondary-900">
                    {service?.label || requestData.service_type}
                  </p>
                </div>
              </div>
            </Card>

            {/* Info Alert */}
            <Alert variant="info" className="mb-8">
              <p className="font-medium">What happens next?</p>
              <p className="text-sm opacity-80">
                After completing the form, a specialist will call you within 10
                minutes to provide pricing and dispatch help.
              </p>
            </Alert>

            {/* Actions */}
            <div className="flex flex-col gap-4">
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => router.push(`/rescue/${id}/situation`)}
              >
                Continue to Details
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>

              <Link href="/rescue">
                <Button variant="ghost" className="w-full">
                  Change Selection
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
