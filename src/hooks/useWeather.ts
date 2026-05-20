// src/hooks/useWeather.ts

import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

import {
  fetchCurrentWeather,
  fetchForecast,
  reverseGeocode,
  geocodeCity,
} from '../utils/weatherApi';

export default function useWeather() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any>(null);
  const [cityInfo, setCityInfo] = useState<any>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ─────────────────────────────────────────────
  // Safe error extractor
  // ─────────────────────────────────────────────
  const getErrorMessage = (e: unknown): string => {
    if (e instanceof Error) return e.message;
    return 'Something went wrong.';
  };

  // ─────────────────────────────────────────────
  // Internal loader (coords)
  // ─────────────────────────────────────────────
  const loadByCoords = useCallback(
    async (lat: number, lon: number) => {
      setLoading(true);
      setError(null);

      try {
        const [w, f, city] = await Promise.all([
          fetchCurrentWeather(lat, lon),
          fetchForecast(lat, lon),
          reverseGeocode(lat, lon),
        ]);

        setWeather(w);
        setForecast(f);
        setCityInfo(city);
      } catch (e: unknown) {
        setError(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ─────────────────────────────────────────────
  // GPS location
  // ─────────────────────────────────────────────
  const loadCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setError(
          'Location permission denied. Please enable it in Settings.'
        );
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      await loadByCoords(
        loc.coords.latitude,
        loc.coords.longitude
      );
    } catch (e: unknown) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [loadByCoords]);

  // ─────────────────────────────────────────────
  // City search
  // ─────────────────────────────────────────────
  const searchCity = useCallback(
    async (cityName: string) => {
      if (!cityName.trim()) return;

      setLoading(true);
      setError(null);

      try {
        const results = await geocodeCity(cityName);

        if (!results || results.length === 0) {
          setError(`City "${cityName}" not found.`);
          return;
        }

        const { lat, lon } = results[0];

        await loadByCoords(lat, lon);
      } catch (e: unknown) {
        setError(getErrorMessage(e));
      } finally {
        setLoading(false);
      }
    },
    [loadByCoords]
  );

  return {
    weather,
    forecast,
    cityInfo,
    loading,
    error,
    loadCurrentLocation,
    searchCity,
  };
}