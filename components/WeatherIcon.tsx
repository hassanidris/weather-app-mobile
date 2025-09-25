import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { colors } from "../styles/commonStyles";

interface WeatherIconProps {
  condition: string;
  iconCode?: string; // OpenWeather icon code, e.g. '01n'
  size?: number;
  color?: string;
}

const OPENWEATHER_ICON_URL = (code: string, scale = 2) =>
  `https://openweathermap.org/img/wn/${code}@${scale}x.png`;

const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  iconCode,
  size = 40,
  color = colors.primary,
}) => {
  const [imageError, setImageError] = useState(false);

  const getIconName = (condition: string): keyof typeof Ionicons.glyphMap => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return "sunny" as any;
      case "partly-sunny":
      case "partly cloudy":
        return "partly-sunny" as any;
      case "cloudy":
        return "cloudy" as any;
      case "rainy":
      case "rain":
        return "rainy" as any;
      case "stormy":
      case "thunderstorm":
        return "thunderstorm" as any;
      case "snowy":
      case "snow":
        return "snow" as any;
      case "moon":
      case "clear":
        return "moon" as any;
      case "cloudy-night":
        return "cloudy-night" as any;
      default:
        return "help-circle" as any;
    }
  };

  if (iconCode && !imageError) {
    const uri = OPENWEATHER_ICON_URL(iconCode, 2);
    return (
      <Image
        source={{ uri }}
        style={[styles.image, { width: size, height: size }]}
        onError={() => setImageError(true)}
        resizeMode="contain"
      />
    );
  }

  return (
    <View>
      <Ionicons name={getIconName(condition)} size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    // keep default background transparent and allow sizing via props
  },
});

export default WeatherIcon;
