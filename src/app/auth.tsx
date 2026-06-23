import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/contexts/AuthContext";

export default function AuthScreen() {
  const { user, loading, error, isConfigured, login, register, forgotPassword, logout } =
    useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const requireEmail = () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Enter your email address.");
      return false;
    }

    return true;
  };

  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Account</Text>
        <View style={styles.card}>
          <Text>Signed in as</Text>
          <Text style={styles.value}>{user.email ?? user.id}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>

      {!isConfigured && (
        <Text style={styles.error}>
          Supabase is not configured. Add EXPO_PUBLIC_SUPABASE_URL and
          EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
        </Text>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        disabled={loading}
        onPress={() => login(email, password)}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        disabled={loading}
        onPress={() => register(email, password)}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        disabled={loading}
        onPress={() => {
          if (requireEmail()) {
            forgotPassword(email);
          }
        }}
      >
        <Text style={styles.secondaryButtonText}>Forgot Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  value: { fontSize: 18, fontWeight: "600", marginTop: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: { color: "white", textAlign: "center", fontWeight: "600" },
  secondaryButton: {
    backgroundColor: "#f2f2f2",
    padding: 15,
    borderRadius: 10,
  },
  secondaryButtonText: { textAlign: "center", fontWeight: "600" },
  error: { color: "#B00020", marginBottom: 10 },
});
