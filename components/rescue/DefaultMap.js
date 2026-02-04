import { useEffect, useRef, useState } from "react";
import styles from "./DefaultMap.module.css";

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
      if (!window.google?.maps?.Map || !mapRef.current) return;

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
          disableDefaultUI: false,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          gestureHandling: "auto",
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
              // Location pin SVG path
              path: "M12 0C7.31 0 3.5 3.81 3.5 8.5C3.5 14.88 12 24 12 24S20.5 14.88 20.5 8.5C20.5 3.81 16.69 0 12 0ZM12 11.5C10.34 11.5 9 10.16 9 8.5C9 6.84 10.34 5.5 12 5.5C13.66 5.5 15 6.84 15 8.5C15 10.16 13.66 11.5 12 11.5Z",
              fillColor: "#f59e0b",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
              scale: 1.5,
              anchor: new window.google.maps.Point(12, 24),
            },
          });
        }
      } else if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
    };

    // Check if Google Maps is fully loaded (with async loading, we need to wait for the Map constructor)
    if (window.google?.maps?.Map) {
      initMap();
    } else {
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.Map) {
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
    <div className={`${styles.wrapper} ${className}`}>
      <div ref={mapRef} className={styles.mapContainer} />
      {/* Loading fallback */}
      {!isMapReady && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingText}>Loading map...</div>
        </div>
      )}
    </div>
  );
}
