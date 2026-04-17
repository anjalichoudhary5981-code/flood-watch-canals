import { useEffect, useState } from "react";
import { getWeather, parseCoordinates, type LiveWeather } from "@/utils/weatherApi";

interface State {
  data: LiveWeather | null;
  loading: boolean;
  error: string | null;
}

/** Fetch live weather for a region's coordinates; refetches when coords change. */
export function useLiveWeather(coordinates: string): State {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    const [lat, lon] = parseCoordinates(coordinates);
    getWeather(lat, lon)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          setState({ data: null, loading: false, error: msg });
        }
      });

    return () => { cancelled = true; };
  }, [coordinates]);

  return state;
}
