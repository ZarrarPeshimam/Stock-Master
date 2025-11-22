import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { api } from "@/utils/api";
import { router } from "expo-router";
import { useTheme } from "@/providers/ThemeProvider";

export default function ProfileScreen() {
  const theme = useTheme();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    fetchProfile();
  }, []);

  // Fetch profile with session cookie
  const fetchProfile = async () => {
    try {
      const res = await api.get("/api/auth/profile/");
      setProfile(res.data.user); // <<< IMPORTANT FIX
    } catch (err: any) {
      console.log("PROFILE ERROR:", err?.response?.data || err);
      alert("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout/");
    } catch (e) {
      console.log("LOGOUT ERROR:", e);
    }

    router.replace("/login");
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        padding: theme.spacing.lg,
        backgroundColor: theme.colors.background,
        justifyContent: "center",
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          backgroundColor: theme.colors.card,
          padding: theme.spacing.lg,
          borderRadius: theme.radius * 1.2,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: "800", color: theme.colors.textDark }}>
          Profile
        </Text>

        <Text style={{ marginTop: 10, fontSize: 16, color: theme.colors.textBody }}>
          Username:
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "700", color: theme.colors.textDark }}>
          {profile.username}
        </Text>

        <Text style={{ marginTop: 10, fontSize: 16, color: theme.colors.textBody }}>
          Email:
        </Text>
        <Text style={{ fontSize: 20, fontWeight: "700", color: theme.colors.textDark }}>
          {profile.email}
        </Text>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            marginTop: 20,
            backgroundColor: theme.colors.primary,
            padding: 14,
            borderRadius: theme.radius,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 17, fontWeight: "700" }}>
            Logout
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
