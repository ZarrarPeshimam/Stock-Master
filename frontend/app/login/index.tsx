import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { useTheme } from "@/providers/ThemeProvider";
import { api } from "@/utils/api";

export default function LoginScreen() {
  const theme = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
    ]).start();
  }, []);

  // LOGIN FUNCTION
  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter username and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/login/", {
        username,
        password,
      });

      console.log("LOGIN SUCCESS:", res.data);

      router.push("/dashboard");
    } catch (err: any) {
      console.log("LOGIN ERROR:", err?.response?.data || err);
      alert("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 80,
      useNativeDriver: true,
    }).start();
    handleLogin();
  };

  return (
    <View
      style={{
        flex: 1,
        padding: theme.spacing.lg,
        justifyContent: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      {/* Animated Card */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: theme.colors.card,
          padding: theme.spacing.lg,
          borderRadius: theme.radius * 1.2,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <Text
          style={{
            fontSize: 32,
            fontWeight: "800",
            color: theme.colors.textDark,
            marginBottom: theme.spacing.sm,
          }}
        >
          Welcome Back
        </Text>

        {/* Username */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: theme.colors.textDark,
            marginBottom: 6,
          }}
        >
          Username
        </Text>

        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="your username"
          placeholderTextColor={theme.colors.textLight}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: 14,
            borderRadius: theme.radius,
            marginBottom: theme.spacing.md,
          }}
        />

        {/* Password */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: theme.colors.textDark,
            marginBottom: 6,
          }}
        >
          Password
        </Text>

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          placeholderTextColor={theme.colors.textLight}
          style={{
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: 14,
            borderRadius: theme.radius,
            marginBottom: theme.spacing.lg,
          }}
        />

        {/* Login Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            disabled={loading}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={{
              backgroundColor: theme.colors.primary,
              padding: 16,
              borderRadius: theme.radius,
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text
            style={{
              marginTop: theme.spacing.md,
              fontSize: 14,
              color: theme.colors.primary,
              textAlign: "center",
              textDecorationLine: "underline",
            }}
          >
            Don’t have an account? Create one
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
