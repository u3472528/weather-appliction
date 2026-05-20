// src/components/SearchBar.tsx

import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = keyof typeof Ionicons.glyphMap;

interface Props {
  onSearch: (query: string) => void;
  onLocationPress: () => void;
  loading: boolean;
}

export default function SearchBar({
  onSearch,
  onLocationPress,
  loading,
}: Props) {
  const [query, setQuery] = useState<string>('');

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Ionicons
          name={'search-outline' as IoniconName}
          size={18}
          color="rgba(255,255,255,0.6)"
          style={styles.icon}
        />

        <TextInput
          style={styles.input}
          placeholder="Search city…"
          placeholderTextColor="rgba(255,255,255,0.45)"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCorrect={false}
        />

        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => setQuery('')}
            style={styles.clear}
          >
            <Ionicons
              name={'close-circle-outline' as IoniconName}
              size={16}
              color="rgba(255,255,255,0.5)"
            />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.locationBtn}
        onPress={onLocationPress}
        disabled={loading}
        activeOpacity={0.75}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Ionicons
            name={'locate-outline' as IoniconName}
            size={20}
            color="#fff"
          />
        )}
      </TouchableOpacity>
    </View>
  );
}

/* ─────────────────────────────
   Styles
───────────────────────────── */

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 10,
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    height: 46,
  },

  icon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontFamily: 'System',
    height: '100%',
  },

  clear: {
    padding: 4,
  },

  locationBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});