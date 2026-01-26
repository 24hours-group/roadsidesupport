import { useEffect, useRef, useState } from "react";

/**
 * Default map component that shows a US-centered map
 * and updates to show user location when provided
 */
export default function DefaultMap({ location, className = "" }) {
  const mapRef = useRef(null);
  const googleMapRef = useRef(null);
  const markerRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Default center: United States
  const defaultCenter = { lat: 39.8283, lng: -98.5795 };
  const defaultZoom = 4;
  const locationZoom = 15;

  useEffect(() => {
    const initMap = () => {
      if (!window.google || !mapRef.current) return;

      const center =
        location?.lat && location?.lng
          ? { lat: location.lat, lng: location.lng }
          : defaultCenter;

      const zoom = location?.lat ? locationZoom : defaultZoom;

      // Create map if it doesn't exist
      if (!googleMapRef.current) {
        googleMapRef.current = new window.google.maps.Map(mapRef.current, {
          center,
          zoom,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: "none",
          styles: [
            // Dark mode style
            { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
            {
              elementType: "labels.text.stroke",
              stylers: [{ color: "#1a1a2e" }],
            },
            {
              elementType: "labels.text.fill",
              stylers: [{ color: "#8892b0" }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [{ color: "#4a5568" }],
            },
            {
              featureType: "administrative.country",
              elementType: "geometry.stroke",
              stylers: [{ color: "#6366f1" }],
            },
            {
              featureType: "administrative.province",
              elementType: "geometry.stroke",
              stylers: [{ color: "#4a5568" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#2d3748" }],
            },
            {
              featureType: "road",
              elementType: "geometry.stroke",
              stylers: [{ color: "#1a1a2e" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry",
              stylers: [{ color: "#4a5568" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#0f172a" }],
            },
            {
              featureType: "poi",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              stylers: [{ visibility: "off" }],
            },
          ],
        });
        setIsMapReady(true);
      } else {
        // Update existing map
        googleMapRef.current.setCenter(center);
        googleMapRef.current.setZoom(zoom);
      }

      // Handle marker
      if (location?.lat && location?.lng) {
        if (markerRef.current) {
          markerRef.current.setPosition(center);
        } else {
          markerRef.current = new window.google.maps.Marker({
            position: center,
            map: googleMapRef.current,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: "#f59e0b",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3,
            },
          });
        }
      } else if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };

    // Check if Google Maps is loaded
    if (window.google) {
      initMap();
    } else {
      const checkInterval = setInterval(() => {
        if (window.google) {
          clearInterval(checkInterval);
          initMap();
        }
      }, 100);

      // Cleanup and timeout
      const timeout = setTimeout(() => clearInterval(checkInterval), 10000);
      return () => {
        clearInterval(checkInterval);
        clearTimeout(timeout);
      };
    }
  }, [location]);

  return (
    <div className={`w-full h-full ${className}`}>
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: "200px" }}
      />
      {/* Loading fallback */}
      {!isMapReady && (
        <div className="absolute inset-0 bg-secondary-900 flex items-center justify-center">
          <div className="text-white/40 text-sm">Loading map...</div>
        </div>
      )}
    </div>
  );
}
