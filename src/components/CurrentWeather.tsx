// src/components/CurrentWeather.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  owmIconToIonicon,
  msToKmh,
  formatTime,
} from '../utils/weatherApi';

type IoniconName = keyof typeof Ionicons.glyphMap;

export default function CurrentWeather({
  weather,
  cityInfo,
}: {
  weather: any;
  cityInfo: any;
}) {
  if (!weather) return null;

  const { main, weather: conditions, wind, visibility, sys, timezone } = weather;
  const cond = conditions[0];

  const ionicon = owmIconToIonicon(cond.icon) as IoniconName;

  const city = cityInfo?.name ?? weather.name;
  const country = cityInfo?.country ?? sys?.country ?? '';

  return (
    <View style={styles.container}>
      {/* City */}
      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color="rgba(255,255,255,0.8)" />
        <Text style={styles.city}>
          {city}
          {country ? `, ${country}` : ''}
        </Text>
      </View>

      {/* Big icon + temp */}
      <View style={styles.heroRow}>
        <Ionicons name={ionicon} size={90} color="#fff" style={styles.heroIcon} />
        <View style={styles.tempBlock}>
          <Text style={styles.temp}>{Math.round(main.temp)}°</Text>
          <Text style={styles.feelsLike}>
            Feels {Math.round(main.feels_like)}°
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text style={styles.description}>
        {cond.description.charAt(0).toUpperCase() +
          cond.description.slice(1)}
      </Text>

      {/* Min / Max */}
      <View style={styles.minMax}>
        <Text style={styles.minMaxText}>↑ {Math.round(main.temp_max)}°</Text>
        <View style={styles.divider} />
        <Text style={styles.minMaxText}>↓ {Math.round(main.temp_min)}°</Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <Stat icon="water-outline" label="Humidity" value={`${main.humidity}%`} />
        <Stat icon="speedometer-outline" label="Wind" value={`${msToKmh(wind.speed)} km/h`} />
        <Stat icon="eye-outline" label="Visibility" value={`${(visibility / 1000).toFixed(1)} km`} />
        <Stat icon="umbrella-outline" label="Pressure" value={`${main.pressure} hPa`} />
      </View>

      {/* Sunrise / Sunset */}
      <View style={styles.sunRow}>
        <SunTime
          label="Sunrise"
          icon="sunny-outline"
          time={formatTime(sys.sunrise, timezone)}
        />
        <SunTime
          label="Sunset"
          icon="moon-outline"
          time={formatTime(sys.sunset, timezone)}
        />
      </View>
    </View>
  );
}

/* ─────────────────────────────
   Sub Components
───────────────────────────── */

function Stat({
  icon,
  label,
  value,
}: {
  icon: IoniconName;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={20} color="rgba(255,255,255,0.7)" />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SunTime({
  label,
  icon,
  time,
}: {
  label: string;
  icon: IoniconName;
  time: string;
}) {
  return (
    <View style={styles.sunItem}>
      <Ionicons name={icon} size={16} color="rgba(255,255,255,0.7)" />
      <Text style={styles.sunLabel}>{label}</Text>
      <Text style={styles.sunTime}>{time}</Text>
    </View>
  );
}

/* ─────────────────────────────
   Styles
───────────────────────────── */

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  city: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 10,
  },
  heroIcon: {
    opacity: 0.95,
  },
  tempBlock: {
    alignItems: 'flex-start',
  },
  temp: {
    color: '#fff',
    fontSize: 80,
    fontWeight: '200',
    lineHeight: 84,
  },
  feelsLike: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 14,
    marginTop: -4,
    marginLeft: 4,
  },
  description: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 16,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  minMax: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  minMaxText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  stat: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  statValue: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sunRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sunLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  sunTime: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});