import { useState, useCallback, useEffect, useRef } from "react";
import { Button, Alert, Spinner } from "@/components/ui";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "./LocationPicker.module.css";

export default function LocationPicker({ value, onChange, error }) {
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [inputValue, setInputValue] = useState(value?.address || "");
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Google Places Autocomplete - wait for API to load
  useEffect(() => {
    let checkInterval;

    const initAutocomplete = () => {
      if (
        typeof window !== "undefined" &&
        window.google?.maps?.places &&
        inputRef.current &&
        !autocompleteRef.current
      ) {
        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["address"],
            componentRestrictions: { country: "us" },
          },
        );

        autocompleteRef.current.addListener("place_changed", () => {
          const place = autocompleteRef.current.getPlace();
          if (place.geometry) {
            const location = {
              address: place.formatted_address,
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              source: "manual",
            };
            setInputValue(place.formatted_address);
            onChange(location);
            setLocationError(null);
          }
        });

        // Clear interval once initialized
        if (checkInterval) clearInterval(checkInterval);
        return true;
      }
      return false;
    };

    // Try immediately
    if (!initAutocomplete()) {
      // If not ready, poll every 100ms until Google Maps loads
      checkInterval = setInterval(() => {
        if (initAutocomplete()) {
          clearInterval(checkInterval);
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [onChange]);

  // Get current GPS location
  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Reverse geocode to get human-readable address
          let address = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

          // Try Google Maps first if available
          if (window.google) {
            const geocoder = new window.google.maps.Geocoder();
            const result = await new Promise((resolve) => {
              geocoder.geocode(
                { location: { lat: latitude, lng: longitude } },
                (results, status) => {
                  if (status === "OK" && results[0]) {
                    resolve(results[0].formatted_address);
                  } else {
                    resolve(null);
                  }
                },
              );
            });
            if (result) address = result;
          }

          // Fallback to free Nominatim (OpenStreetMap) reverse geocoding
          if (
            address.includes(",") &&
            address.match(/^-?\d+\.\d+,\s*-?\d+\.\d+$/)
          ) {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`,
                { headers: { "User-Agent": "RoadsideSupport/1.0" } },
              );
              const data = await response.json();
              if (data.display_name) {
                address = data.display_name;
              }
            } catch (nominatimError) {
              console.warn("Nominatim geocoding failed, using coordinates");
            }
          }

          const location = {
            address,
            lat: latitude,
            lng: longitude,
            source: "gps",
          };

          setInputValue(address);
          onChange(location);
        } catch (err) {
          setLocationError("Failed to get address for your location");
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setIsLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError(
              "Location permission denied. Please enter address manually.",
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError(
              "Location unavailable. Please enter address manually.",
            );
            break;
          case err.TIMEOUT:
            setLocationError("Location request timed out. Please try again.");
            break;
          default:
            setLocationError(
              "Failed to get your location. Please enter address manually.",
            );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, [onChange]);

  return (
    <div className={styles.wrapper}>
      {/* GPS Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleGetCurrentLocation}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Spinner size="sm" />
            <span>Getting location...</span>
          </>
        ) : (
          <>
            <MyLocationIcon style={{ fontSize: 20 }} />
            <span>Use My Current Location</span>
          </>
        )}
      </Button>

      {/* Divider */}
      <div className={styles.divider}>
        <div className={styles.dividerLine} />
        <span className={styles.dividerText}>or enter address</span>
        <div className={styles.dividerLine} />
      </div>

      {/* Address Input */}
      <div className={styles.inputWrapper}>
        <div className={styles.inputIcon}>
          <SearchIcon style={{ fontSize: 20 }} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for your address..."
          className={styles.addressInput}
        />
      </div>

      {/* Success indicator */}
      {value?.address && !locationError && (
        <Alert variant="success">
          <div className={styles.successContent}>
            <CheckCircleIcon
              className={styles.successIcon}
              style={{ fontSize: 20 }}
            />
            <div>
              <p className={styles.successTitle}>Location set</p>
              <p className={styles.successAddress}>{value.address}</p>
              <p className={styles.successSource}>
                via {value.source === "gps" ? "GPS" : "address search"}
              </p>
            </div>
          </div>
        </Alert>
      )}

      {/* Error States */}
      {(locationError || error) && (
        <Alert variant="error">{locationError || error}</Alert>
      )}
    </div>
  );
}
