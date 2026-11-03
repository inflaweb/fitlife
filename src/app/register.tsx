import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import FormField from "../components/FormField";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../hooks/useAuth";

export default function RegisterScreen() {
  const { prepareRegistration } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Datos incompletos", "Completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setSaving(true);

    try {
      await prepareRegistration({
        name,
        email,
        password,
      });

      router.push("/privacy");
    } catch (error) {
      Alert.alert(
        "No se pudo continuar",
        error instanceof Error
          ? error.message
          : "Verifica los datos e inténtalo nuevamente.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crea tu cuenta</Text>

        <Text style={styles.subtitle}>
          Regístrate para comenzar a utilizar FitLife.
        </Text>

        <FormField
          label="Nombre completo"
          value={name}
          onChangeText={setName}
          placeholder="Ej. Alex García"
        />

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
          placeholder="Mínimo 8 caracteres"
          secureTextEntry
          autoCapitalize="none"
        />

        <FormField
          label="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Repite tu contraseña"
          secureTextEntry
          autoCapitalize="none"
        />

        <Text style={styles.note}>
          En el siguiente paso podrás leer el aviso de privacidad. Tu cuenta se
          creará únicamente después de aceptar el aviso.
        </Text>

        <PrimaryButton
          title={saving ? "Procesando..." : "Continuar"}
          onPress={handleRegister}
        />

        <PrimaryButton
          title="Volver al login"
          onPress={() => router.back()}
          secondary
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingBottom: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#183A28",
    marginTop: 15,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#63756A",
    marginTop: 7,
  },
  note: {
    color: "#63756A",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 18,
  },
});
