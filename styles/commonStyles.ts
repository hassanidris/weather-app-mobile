import { StyleSheet } from "react-native";

export const colors = {
  primary: "#4A90E2", // Calming blue
  secondary: "#87CEEB", // Sky blue
  accent: "#FFD700", // Bright yellow
  background: "#F0F8FF", // Alice blue (very light blue)
  backgroundAlt: "#FFFFFF", // White
  text: "#2C3E50", // Dark blue-gray
  textLight: "#7F8C8D", // Light gray
  card: "#FFFFFF", // White cards
  shadow: "rgba(0, 0, 0, 0.1)",
  border: "#E1E8ED", // Light border
  success: "#27AE60", // Green
  warning: "#F39C12", // Orange
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: "center",
    width: "100%",
  },
  backButton: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 800,
    width: "100%",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    color: colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: "center",
  },
  textLight: {
    fontSize: 14,
    fontWeight: "400",
    color: colors.textLight,
    lineHeight: 20,
  },
  section: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    width: "100%",
    boxShadow: `0px 4px 12px ${colors.shadow}`,
    elevation: 4,
  },
  cityCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    width: "100%",
    boxShadow: `0px 2px 8px ${colors.shadow}`,
    elevation: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forecastCard: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    minWidth: 80,
    alignItems: "center",
    boxShadow: `0px 2px 6px ${colors.shadow}`,
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
  weatherIcon: {
    width: 40,
    height: 40,
  },
  temperature: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  temperatureLarge: {
    fontSize: 48,
    fontWeight: "700",
    color: colors.text,
  },
  cityName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  currentLocation: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.primary,
    marginBottom: 20,
  },
});
