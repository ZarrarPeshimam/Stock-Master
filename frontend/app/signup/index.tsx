import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { useTheme } from "@/providers/ThemeProvider";
import { api } from "@/utils/api";

export default function SignupScreen() {
  const theme = useTheme();

  // Form fields
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");   // NEW
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState(""); // NEW
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

  const handleSignup = async () => {
    if (!name || !username || !email || !password || !passwordConfirm) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/api/auth/signup/", {
        name: name,
        username: username,
        email: email,
        password: password,
        password_confirm: passwordConfirm,
      });

      alert("Account created!");
      router.push("/login");
    } catch (err: any) {
      console.log("SIGNUP ERROR:", err.response?.data);
      alert("Signup failed. Check details.");
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
      useNativeDriver: true,
    }).start();

    handleSignup();
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
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          backgroundColor: theme.colors.card,
          padding: theme.spacing.lg,
          borderRadius: theme.radius * 1.2,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadow,
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
          Create Account
        </Text>

        {/* Name */}
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles(theme)}
        />

        {/* Username REQUIRED by backend */}
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles(theme)}
        />

        {/* Email */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles(theme)}
        />

        {/* Password */}
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles(theme)}
        />

        {/* Confirm Password */}
        <TextInput
          placeholder="Confirm Password"
          secureTextEntry
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          style={styles(theme)}
        />

        {/* Button */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={loading}
            style={{
              backgroundColor: theme.colors.primary,
              padding: 16,
              borderRadius: theme.radius,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "700", fontSize: 17 }}>
              {loading ? "Creating..." : "Sign Up"}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text
            style={{
              marginTop: theme.spacing.md,
              textAlign: "center",
              color: theme.colors.primary,
            }}
          >
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// Reusable input style
const styles = (theme: any) => ({
  borderWidth: 1,
  borderColor: theme.colors.border,
  padding: 14,
  borderRadius: theme.radius,
  backgroundColor: theme.colors.card,
  color: theme.colors.textDark,
  marginBottom: theme.spacing.md,
});
