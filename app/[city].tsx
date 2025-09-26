import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WeatherIcon from "../components/WeatherIcon";
import {
  DetailedWeather,
  ForecastItem,
  WeatherService,
} from "../Service/OpenWeatherAPI";
import { colors, commonStyles } from "../styles/commonStyles";

export default function CityDetailsScreen() {
  const { city } = useLocalSearchParams<{ city: string }>();
  const [weatherData, setWeatherData] = useState<DetailedWeather | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (city) {
      loadDetailedWeather();
    }
  }, [city]);

  const loadDetailedWeather = async () => {
    try {
      console.log("CityDetailsScreen: Loading detailed weather for:", city);
      setLoading(true);

      const decodedCity = decodeURIComponent(city || "");
      const data = await WeatherService.getDetailedWeather(decodedCity);
      setWeatherData(data);

      console.log("CityDetailsScreen: Detailed weather loaded successfully");
    } catch (error) {
      console.error(
        "CityDetailsScreen: Error loading detailed weather:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackPress = () => {
    console.log("CityDetailsScreen: Navigating back to home");
    router.back();
  };

  const renderForecastItem = (item: ForecastItem, index: number) => (
    <View key={`${item.hour}-${index}`} style={commonStyles.forecastCard}>
      <Text style={[commonStyles.textLight, { fontSize: 12, marginBottom: 8 }]}>
        {item.hour}
      </Text>
      <WeatherIcon
        condition={item.condition}
        iconCode={item.icon}
        size={24}
        color={colors.primary}
      />
      <Text
        style={[
          commonStyles.text,
          { fontSize: 14, fontWeight: "600", marginTop: 8 },
        ]}
      >
        {item.temperature}°C
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: "center" }]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[commonStyles.text, { marginTop: 16 }]}>
            Loading detailed weather...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!weatherData) {
    return (
      <SafeAreaView style={commonStyles.container}>
        <View style={[commonStyles.content, { justifyContent: "center" }]}>
          <Text style={commonStyles.text}>
            Unable to load weather data for {city}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: colors.primary,
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8,
              marginTop: 20,
            }}
            onPress={handleBackPress}
          >
            <Text style={{ color: colors.backgroundAlt, fontWeight: "600" }}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* Header with Back Button */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={handleBackPress}
          style={{
            padding: 8,
            marginRight: 12,
            borderRadius: 8,
            backgroundColor: colors.backgroundAlt,
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        {/* <Text style={commonStyles.title}>{weatherData.city}</Text> */}
      </View>

      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        {/* Current Weather */}
        <View
          style={[
            commonStyles.card,
            { alignItems: "center", marginBottom: 20 },
          ]}
        >
          <Text style={commonStyles.title}>{weatherData.city}</Text>
          <WeatherIcon
            condition={weatherData.condition}
            iconCode={weatherData.icon}
            size={80}
            color={colors.primary}
          />
          <Text style={[commonStyles.temperatureLarge, { marginVertical: 16 }]}>
            {weatherData.temperature}°C
          </Text>
          <Text style={[commonStyles.subtitle, { marginBottom: 8 }]}>
            {weatherData.condition}
          </Text>
        </View>

        {/* Weather Details */}
        <View style={[commonStyles.card, { marginBottom: 20 }]}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Current Conditions
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="speedometer" size={20} color={colors.primary} />
              <Text style={[commonStyles.text, { marginLeft: 8 }]}>
                Wind Speed
              </Text>
            </View>
            <Text style={[commonStyles.text, { fontWeight: "600" }]}>
              {weatherData.windSpeed} km/h
            </Text>
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="water" size={20} color={colors.primary} />
              <Text style={[commonStyles.text, { marginLeft: 8 }]}>
                Humidity
              </Text>
            </View>
            <Text style={[commonStyles.text, { fontWeight: "600" }]}>
              {weatherData.humidity}%
            </Text>
          </View>
        </View>

        {/* Today's Forecast */}
        {weatherData.todayForecast.length > 0 && (
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
              Today's Forecast
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            >
              {weatherData.todayForecast.map(renderForecastItem)}
            </ScrollView>
          </View>
        )}

        {/* Tomorrow's Forecast */}
        {weatherData.tomorrowForecast.length > 0 && (
          <View style={[commonStyles.card, { marginBottom: 20 }]}>
            <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
              Tomorrow's Forecast
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4 }}
            >
              {weatherData.tomorrowForecast.map(renderForecastItem)}
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
