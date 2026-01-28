import { useEffect, useRef } from "react";

export default function MapPreview({ location, className = "", height = 300 }) {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!location?.lat || !location?.lng) return;

    const initMap = () => {
      if (!window.google?.maps?.Map || !mapRef.current) return;

      const position = { lat: location.lat, lng: location.lng };

      // Create map if it doesn't exist
      if (!googleMapRef.current) {
        googleMapRef.current = new window.google.maps.Map(mapRef.current, {
          center: position,
          zoom: 15,
          disableDefaultUI: false,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: "auto",
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
      } else {
        googleMapRef.current.setCenter(position);
      }

      // Update or create marker
      if (markerRef.current) {
        markerRef.current.setPosition(position);
      } else {
        markerRef.current = new window.google.maps.Marker({
          position,
          map: googleMapRef.current,
          animation: window.google.maps.Animation.DROP,
          icon: {
            // Location pin SVG path
            path: "M12 0C7.31 0 3.5 3.81 3.5 8.5C3.5 14.88 12 24 12 24S20.5 14.88 20.5 8.5C20.5 3.81 16.69 0 12 0ZM12 11.5C10.34 11.5 9 10.16 9 8.5C9 6.84 10.34 5.5 12 5.5C13.66 5.5 15 6.84 15 8.5C15 10.16 13.66 11.5 12 11.5Z",
            fillColor: "#1E3A8A",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
            scale: 1.5,
            anchor: new window.google.maps.Point(12, 24),
          },
        });
      }
    };

    // Check if Google Maps is fully loaded (with async loading, we need to wait for the Map constructor)
    if (window.google?.maps?.Map) {
      initMap();
    } else {
      // Wait for Google Maps to load
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.Map) {
          clearInterval(checkInterval);
          initMap();
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }
  }, [location]);

  if (!location?.lat || !location?.lng) {
    return (
      <div
        className={`bg-secondary-100 rounded-2xl flex items-center justify-center ${className}`}
        style={{ height }}
      >
        <div className="text-center text-secondary-500">
          <svg
            className="w-12 h-12 mx-auto mb-2 opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p>No location selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        ref={mapRef}
        className="w-full rounded-2xl overflow-hidden shadow-card"
        style={{ height }}
      />
      <div className="mt-3 flex items-start gap-2 text-sm text-secondary-600">
        <svg
          className="w-4 h-4 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
        </svg>
        <span>{location.address}</span>
      </div>
    </div>
  );
}
