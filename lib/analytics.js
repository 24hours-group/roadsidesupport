// Analytics event tracking
// Replace with your preferred analytics provider (GA4, Mixpanel, etc.)

const isProduction = process.env.NODE_ENV === "production";

export const trackEvent = (eventName, properties = {}) => {
  if (!isProduction) {
    // console.log(`[Analytics] ${eventName}`, properties);
    return;
  }

  // Uncomment and configure for your analytics provider
  // window.gtag?.('event', eventName, properties);
  // window.mixpanel?.track(eventName, properties);
};

// Pre-defined events for the rescue flow
export const events = {
  rescueStarted: () => trackEvent("rescue_started"),
  serviceSelected: (serviceType) =>
    trackEvent("service_selected", { service_type: serviceType }),
  locationConfirmed: (source) => trackEvent("location_confirmed", { source }),
  situationCompleted: (serviceType) =>
    trackEvent("situation_completed", { service_type: serviceType }),
  vehicleCompleted: () => trackEvent("vehicle_completed"),
  motoristCompleted: () => trackEvent("motorist_completed"),
  requestSubmittedSuccess: (requestId) =>
    trackEvent("request_submitted_success", { request_id: requestId }),
  requestSubmittedFailure: (error) =>
    trackEvent("request_submitted_failure", { error }),
};
