// src/components/HourlyForecast.tsx

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
  owmIconToIonicon,
  formatTime,
} from '../utils/weatherApi';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface ForecastItem {
  dt: number;
  main: {
    temp: number;
  };
  weather: {
    icon: string;
  }[];
  pop?: number;
}

interface Props {
  forecast: {
    list: ForecastItem[];
  };
  timezone?: number;
}

export default function HourlyForecast({
  forecast,
  timezone = 0,
}: Props) {
  if (!forecast?.list) return null;

  const items = forecast.list.slice(0, 12);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Hourly Forecast</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {items.map((item, idx) => {
          const temp = Math.round(item.main.temp);

          const icon = owmIconToIonicon(
            item.weather[0].icon
          ) as IoniconName;

          const time = idx === 0
            ? 'Now'
            : formatTime(item.dt, timezone);

          const pop = Math.round((item.pop ?? 0) * 100);

          return (
            <View
              key={item.dt}
              style={[
                styles.card,
                idx === 0 && styles.cardActive,
              ]}
            >
              <Text style={styles.time}>{time}</Text>

              <Ionicons
                name={icon}
                size={24}
                color="#fff"
                style={styles.icon}
              />

              <Text style={styles.temp}>{temp}°</Text>

              {pop > 10 && (
                <View style={styles.popRow}>
                  <Ionicons
                    name={'rainy-outline' as IoniconName}
                    size={10}
                    color="rgba(255,255,255,0.7)"
                  />
                  <Text style={styles.pop}>{pop}%</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

/* ─────────────────────────────
   Styles
───────────────────────────── */

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    marginHorizontal: 20,
  },

  sectionTitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },

  scroll: {
    gap: 8,
    paddingRight: 4,
  },

  card: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    minWidth: 62,
    gap: 4,
  },

  cardActive: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderColor: 'rgba(255,255,255,0.35)',
  },

  time: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontWeight: '500',
  },

  icon: {
    marginVertical: 2,
  },

  temp: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  popRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },

  pop: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 9,
  },
});