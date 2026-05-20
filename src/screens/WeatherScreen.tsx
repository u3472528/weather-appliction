// src/screens/WeatherScreen.js
import React, { useEffect } from 'react';
import {View,ScrollView,StyleSheet,ActivityIndicator,SafeAreaView,RefreshControl,Platform,} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import useWeather from '../hooks/useWeather';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import { ErrorState, WelcomeState } from '../components/EmptyState';
import { conditionToGradient } from '../utils/weatherApi';
import CityTags from '../components/CityTags';

export default function WeatherScreen() {
  const {weather,forecast,cityInfo,loading,error,loadCurrentLocation,searchCity,} = useWeather();
  useEffect(() => {loadCurrentLocation();}, []);
  const gradientColors = weather ? conditionToGradient(weather.weather[0].id,weather.weather[0].icon?.endsWith('d')) : ['#0f2027', '#203a43', '#2c5364'];

  return (
    <LinearGradient
      colors={gradientColors}
      style={styles.gradient}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
    >
      <SafeAreaView style={styles.safe}>
        <SearchBar
          onSearch={searchCity}
          onLocationPress={loadCurrentLocation}
          loading={loading && !weather}
        />
        <CityTags onSelect={searchCity} />
        {loading && !weather ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="rgba(255,255,255,0.8)" />
          </View>
        ) : error && !weather ? (
          <ErrorState message={error} onRetry={loadCurrentLocation} />
        ) : !weather ? (
          <WelcomeState onLocationPress={loadCurrentLocation} onSearch={searchCity} />
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={loadCurrentLocation}
                tintColor="rgba(255,255,255,0.8)"
                colors={['rgba(255,255,255,0.8)']}
              />
            }
          >
            <CurrentWeather weather={weather} cityInfo={cityInfo} />
            <HourlyForecast forecast={forecast} timezone={weather.timezone} />
            <DailyForecast  forecast={forecast} timezone={weather.timezone} />
            <View style={{ height: Platform.OS === 'ios' ? 20 : 8 }} />
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 36 : 0,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 12,
  },
});
