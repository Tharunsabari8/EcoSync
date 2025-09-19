import { useState, useEffect } from "react";

export function useLocation() {
  const [location, setLocation] = useState({
    lat: 19.7515,
    lng: 75.7139
  });

  const [error, setError] = useState<string | null>(null);

  const refreshLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: parseFloat(position.coords.latitude.toFixed(4)),
            lng: parseFloat(position.coords.longitude.toFixed(4))
          });
          setError(null);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          // Keep using default location for demo
          setError("Using default location for demo");
        }
      );
    } else {
      setError("Geolocation not supported");
    }
  };

  useEffect(() => {
    refreshLocation();
  }, []);

  return { location, error, refreshLocation };
}
