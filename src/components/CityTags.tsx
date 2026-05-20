// src/components/CityTags.tsx
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetchCurrentWeather, OWM_API_KEY } from "../utils/weatherApi";

// Fixed coordinates for popular world cities
const CITY_COORDS: { name: string; lat: number; lon: number }[] = [
  { name: "New York", lat: 40.7128, lon: -74.006 },
  { name: "London", lat: 51.5074, lon: -0.1278 },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Paris", lat: 48.8566, lon: 2.3522 },
  { name: "Dubai", lat: 25.2048, lon: 55.2708 },
  { name: "Sydney", lat: -33.8688, lon: 151.2093 },
  { name: "Lahore", lat: 31.5497, lon: 74.3436 },
  { name: "Istanbul", lat: 41.0082, lon: 28.9784 },
  { name: "Singapore", lat: 1.3521, lon: 103.8198 },
  { name: "Cairo", lat: 30.0444, lon: 31.2357 },
];

interface CityWeather {
  name: string;
  temp: number;
  icon: string;
  lat: number;
  lon: number;
}

interface Props {
  onSelect: (city: string) => void;
}

export default function CityTags({ onSelect }: Props) {
  const [cities, setCities] = useState<CityWeather[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCities() {
      try {
        const results = await Promise.allSettled(
          CITY_COORDS.map((c) => fetchCurrentWeather(c.lat, c.lon)),
        );
        const loaded: CityWeather[] = results
          .map((result, i) => {
            if (result.status === "fulfilled") {
              const data = result.value;
              return {
                name: CITY_COORDS[i].name,
                temp: Math.round(data.main.temp),
                icon: data.weather[0].icon,
                lat: CITY_COORDS[i].lat,
                lon: CITY_COORDS[i].lon,
              };
            }
            return null;
          })
          .filter(Boolean) as CityWeather[];
        setCities(loaded);
      } catch {
        // silently fail — tags just won't show
      } finally {
        setLoading(false);
      }
    }
    loadCities();
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Ionicons
          name="globe-outline"
          size={12}
          color="rgba(255,255,255,0.5)"
        />
        <Text style={styles.label}>Popular Cities</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="small"
          color="rgba(255,255,255,0.5)"
          style={{ alignSelf: "flex-start", marginLeft: 4 }}
        />
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {cities.map((city) => (
            <TouchableOpacity
              key={city.name}
              style={styles.tag}
              onPress={() => onSelect(city.name)}
              activeOpacity={0.7}
            >
              <Image
                source={{uri: `https://openweathermap.org/img/wn/${city.icon}.png`,}}
                style={{ width: 24, height: 24 }}
              />
              <Text style={styles.cityName}>{city.name}</Text>
              <Text style={styles.temp}>{city.temp}°</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 10,
    marginHorizontal: 20,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  label: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  scroll: {
    gap: 8,
    paddingRight: 4,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  cityName: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "500",
  },
  temp: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
    marginLeft: 2,
  },
});
