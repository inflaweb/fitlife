import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import FormField from "../components/FormField";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert("Campos incompletos", "Escribe tu correo y contraseña.");
      return;
    }

    try {
      const success = await login(email, password);

      if (success) {
        router.replace("/home");
      }
    } catch (error) {
      Alert.alert(
        "No se pudo iniciar sesión",
        error instanceof Error ? error.message : "Inténtalo nuevamente.",
      );
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2F855A" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.emoji}>💪</Text>
        <Text style={styles.brand}>FitLife</Text>
        <Text style={styles.title}>¡Qué bueno verte!</Text>
        <Text style={styles.subtitle}>
          Inicia sesión para continuar con tu bienestar.
        </Text>

        <FormField
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          placeholder="tu@correo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <FormField
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          placeholder="Escribe tu contraseña"
          secureTextEntry
        />

        <PrimaryButton title="Iniciar sesión" onPress={handleLogin} />
        <PrimaryButton
          title="Crear una cuenta"
          onPress={() => router.push("/register")}
          secondary
        />

        <Text style={styles.note}>
          Para entrar, primero debes crear una cuenta de prueba y aceptar el
          aviso de privacidad.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    paddingBottom: 36,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emoji: { fontSize: 45, textAlign: "center" },
  brand: {
    fontSize: 26,
    fontWeight: "900",
    color: "#276749",
    textAlign: "center",
    marginTop: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#183A28",
    marginTop: 30,
  },
  subtitle: { color: "#63756A", marginTop: 7, fontSize: 15 },
  note: {
    color: "#829188",
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 20,
  },
});
