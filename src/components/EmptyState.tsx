// src/components/EmptyState.tsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

interface WelcomeStateProps {
  onLocationPress?: () => void;
  onSearch?: (cityName: string) => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.center}>
      <Ionicons
        name={'cloud-offline-outline' as IoniconName}
        size={64}
        color="rgba(255,255,255,0.4)"
      />

      <Text style={styles.errorText}>{message}</Text>

      {onRetry && (
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={onRetry}
          activeOpacity={0.75}
        >
          <Ionicons
            name={'refresh-outline' as IoniconName}
            size={16}
            color="#fff"
          />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export function WelcomeState({
  onLocationPress,
  onSearch,
}: WelcomeStateProps) {
  return (
    <View style={styles.center}>
      <Ionicons
        name={'partly-sunny-outline' as IoniconName}
        size={80}
        color="rgba(255,255,255,0.3)"
      />

      <Text style={styles.welcomeTitle}>Weather</Text>

      <Text style={styles.welcomeSub}>
        Search a city or use your location
      </Text>

      <TouchableOpacity
        style={styles.locationBtn}
        onPress={onLocationPress}
        activeOpacity={0.8}
      >
        <Ionicons
          name={'locate-outline' as IoniconName}
          size={18}
          color="#fff"
        />
        <Text style={styles.locationBtnText}>
          Use My Location
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ─────────────────────────────
   Styles
───────────────────────────── */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },

  errorText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  welcomeTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: 2,
    marginTop: 16,
  },

  welcomeSub: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    textAlign: 'center',
  },

  locationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  locationBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});