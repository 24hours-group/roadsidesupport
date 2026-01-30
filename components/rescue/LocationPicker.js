import { useState, useCallback, useEffect, useRef } from "react";
import { Button, Alert, Spinner } from "@/components/ui";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
    <div className="w-full space-y-4">
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
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-secondary-300" />
        <span className="text-sm text-secondary-600 font-medium">
          or enter address
        </span>
        <div className="flex-1 h-px bg-secondary-300" />
      </div>

      {/* Address Input */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-500">
          <SearchIcon style={{ fontSize: 20 }} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for your address..."
          className="input-field pl-12"
        />
      </div>

      {/* Success indicator */}
      {value?.address && !locationError && (
        <Alert variant="success">
          <div className="flex items-start gap-2">
            <CheckCircleIcon
              className="text-success flex-shrink-0 mt-0.5"
              style={{ fontSize: 20 }}
            />
            <div>
              <p className="font-semibold">Location set</p>
              <p className="text-sm opacity-80">{value.address}</p>
              <p className="text-xs opacity-60 mt-1">
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
