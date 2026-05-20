// src/components/DailyForecast.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { owmIconToIonicon, formatDay } from '../utils/weatherApi';

interface ForecastItem {
  dt: number;
  main: {
    temp_max: number;
    temp_min: number;
  };
  weather: {
    icon: string;
    main: string;
  }[];
}

interface ForecastData {
  list: ForecastItem[];
}

// Reduce the 3-hour forecast list to one entry per day
function groupByDay(list: ForecastItem[], timezone = 0) {
  const days: Record<string, ForecastItem[]> = {};

  for (const item of list) {
    const d = new Date((item.dt + timezone) * 1000);
    const key = d.toISOString().slice(0, 10);

    if (!days[key]) {
      days[key] = [];
    }

    days[key].push(item);
  }

  return Object.entries(days)
    .slice(1, 6) // skip today, show next 5 days
    .map(([, items]) => {
      const noon =
        items.find((i) => {
          const h = new Date((i.dt + timezone) * 1000).getUTCHours();
          return h >= 11 && h <= 13;
        }) ?? items[Math.floor(items.length / 2)];

      const maxTemp = Math.max(
        ...items.map((i) => i.main.temp_max)
      );

      const minTemp = Math.min(
        ...items.map((i) => i.main.temp_min)
      );

      return {
        ...noon,
        dayMax: maxTemp,
        dayMin: minTemp,
      };
    });
}

export default function DailyForecast({
  forecast,
  timezone = 0,
}: {
  forecast: ForecastData;
  timezone: number;
}) {
  if (!forecast?.list) return null;

  const days = groupByDay(forecast.list, timezone);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>5-Day Forecast</Text>

      <View style={styles.card}>
        {days.map((item, idx) => (
          <View
            key={item.dt}
            style={[
              styles.row,
              idx < days.length - 1 && styles.rowBorder,
            ]}
          >
            <Text style={styles.day}>
              {formatDay(item.dt, timezone)}
            </Text>

            <Ionicons
              name={owmIconToIonicon(item.weather[0].icon)}
              size={20}
              color="rgba(255,255,255,0.8)"
              style={styles.icon}
            />

            <Text
              style={styles.desc}
              numberOfLines={1}
            >
              {item.weather[0].main}
            </Text>

            <View style={styles.tempRange}>
              <Text style={styles.high}>
                {Math.round(item.dayMax)}°
              </Text>

              <Text style={styles.low}>
                {Math.round(item.dayMin)}°
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    marginHorizontal: 20,
    marginBottom: 32,
  },

  sectionTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  card: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },

  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },

  day: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    width: 40,
  },

  icon: {
    marginHorizontal: 10,
  },

  desc: {
    flex: 1,
    color: 'rgba(255,255,255,0.65)',
    fontSize: 13,
  },

  tempRange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  high: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'right',
  },

  low: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
    minWidth: 32,
    textAlign: 'right',
  },
});