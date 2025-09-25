import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WeatherIcon from "../components/WeatherIcon";
import { WeatherData, WeatherService } from "../Service/OpenWeatherAPI";
import { colors, commonStyles } from "../styles/commonStyles";

const CITIES = [
  "Stockholm",
  "Gothenburg",
  "Malmö",
  "Umeå",
  "London",
  "Berlin",
  "Madrid",
];

export default function HomeScreen() {
  const [currentLocation, setCurrentLocation] = useState<string>("");
  const [citiesWeather, setCitiesWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeatherData = async () => {
    try {
      console.log("HomeScreen: Loading weather data...");

      // Get current location
      const location = await WeatherService.getCurrentLocation();
      setCurrentLocation(location);

      // Get weather for all cities
      const weatherData = await WeatherService.getCitiesWeather(CITIES);
      setCitiesWeather(weatherData);

      console.log("HomeScreen: Weather data loaded successfully");
    } catch (error) {
      console.error("HomeScreen: Error loading weather data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWeatherData();
  }, []);

  const handleRefresh = () => {
    console.log("HomeScreen: Refreshing weather data...");
    setRefreshing(true);
    loadWeatherData();
  };

  const handleCityPress = (city: string) => {
    console.log("HomeScreen: Navigating to city details:", city);
    router.push(`/${encodeURIComponent(city)}`);
  };

  const renderCityItem = (weather: WeatherData) => (
    <TouchableOpacity
      key={weather.city}
      style={commonStyles.cityCard}
      onPress={() => handleCityPress(weather.city)}
      activeOpacity={0.7}
    >
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <WeatherIcon
          condition={weather.condition}
          iconCode={weather.icon}
          size={32}
          color={colors.primary}
        />
        <View style={{ marginLeft: 16, flex: 1 }}>
          <Text style={commonStyles.cityName}>{weather.city}</Text>
          <Text style={commonStyles.textLight}>{weather.condition}</Text>
        </View>
      </View>
      <Text style={commonStyles.temperature}>{weather.temperature}°C</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: "center" }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[commonStyles.text, { marginTop: 16 }]}>
            Loading weather data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={{ alignItems: "center", marginBottom: 30 }}>
        <Text style={commonStyles.title}>Weather App</Text>
        {currentLocation && (
          <Text style={commonStyles.currentLocation}>
            📍 Current location: {currentLocation}
          </Text>
        )}
      </View>

      {/* Cities List */}
      <View style={{ marginBottom: 20 }}>
        <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
          Cities
        </Text>
        {citiesWeather.map(renderCityItem)}
      </View>

      {/* Instructions */}
      <View style={commonStyles.card}>
        <Text style={[commonStyles.textLight, { textAlign: "center" }]}>
          Tap on any city to view detailed weather information including current
          conditions, wind speed, humidity, and forecasts for today and
          tomorrow.
        </Text>
      </View>
    </ScrollView>
  );
}
