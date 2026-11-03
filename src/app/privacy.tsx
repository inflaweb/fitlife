import { router } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../hooks/useAuth";

export default function PrivacyScreen() {
  const [accepted, setAccepted] = useState(false);
  const [saving, setSaving] = useState(false);
  const { pendingUser, acceptPrivacy } = useAuth();

  async function handleAccept() {
    if (!accepted) {
      Alert.alert(
        "Consentimiento requerido",
        "Lee el aviso y marca la casilla si estás de acuerdo para continuar.",
      );
      return;
    }

    if (!pendingUser) {
      Alert.alert("Registro no encontrado", "Vuelve a completar el registro.");
      router.replace("/register");
      return;
    }

    try {
      setSaving(true);
      await acceptPrivacy();

      Alert.alert(
        "¡Registro completado!",
        "Tu cuenta de prueba se creó correctamente. Ahora inicia sesión.",
        [{ text: "Ir al login", onPress: () => router.replace("/") }],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        error instanceof Error ? error.message : "No se pudo crear la cuenta.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.eyebrow}>FITLIFE · PRIVACIDAD</Text>
      <Text style={styles.title}>Aviso de privacidad</Text>

      <Text style={styles.intro}>
        Este aviso es una versión ilustrativa para una práctica escolar. Explica
        qué datos utiliza la versión de demostración y para qué.
      </Text>

      <View style={styles.card}>
        <Text style={styles.heading}>1. Datos que solicitamos</Text>
        <Text style={styles.body}>
          Nombre completo, correo electrónico y contraseña de prueba.
        </Text>

        <Text style={styles.heading}>2. Finalidad</Text>
        <Text style={styles.body}>
          Crear una cuenta de demostración, identificar al usuario durante el
          inicio de sesión y mostrar la pantalla principal.
        </Text>

        <Text style={styles.heading}>3. Almacenamiento</Text>
        <Text style={styles.body}>
          En esta versión los datos se guardan localmente en el dispositivo. No
          se utiliza un servidor remoto.
        </Text>

        <Text style={styles.heading}>4. Compartición</Text>
        <Text style={styles.body}>
          La aplicación de prueba no envía estos datos a terceros. Utiliza
          únicamente información ficticia.
        </Text>

        <Text style={styles.heading}>5. Tu decisión</Text>
        <Text style={styles.body}>
          Puedes regresar al registro sin aceptar. Si aceptas, se guarda
          localmente la fecha y la versión del aviso como evidencia académica.
        </Text>

        <Text style={styles.heading}>6. Responsable y contacto</Text>
        <Text style={styles.body}>
          Este ejemplo no identifica a un responsable real ni proporciona datos
          de contacto. Esos datos y los mecanismos para ejercer los derechos
          aplicables deben añadirse antes de usar la aplicación con usuarios
          reales.
        </Text>
      </View>

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: accepted }}
        onPress={() => setAccepted(!accepted)}
        style={styles.consentRow}
      >
        <View style={[styles.checkbox, accepted && styles.checked]}>
          {accepted ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
        <Text style={styles.consentText}>
          He leído el aviso de privacidad de demostración y acepto el uso de los
          datos descrito para crear mi cuenta de prueba.
        </Text>
      </Pressable>

      <PrimaryButton
        title={saving ? "Guardando..." : "Aceptar y crear cuenta"}
        onPress={handleAccept}
      />
      <PrimaryButton
        title="Regresar al registro"
        onPress={() => router.back()}
        secondary
      />

      <Text style={styles.footer}>
        Aviso ilustrativo · FitLife · Versión 1.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 36 },
  eyebrow: {
    color: "#2F855A",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 10,
  },
  title: {
    color: "#183A28",
    fontSize: 28,
    fontWeight: "800",
    marginTop: 10,
  },
  intro: {
    color: "#63756A",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCE9DF",
    padding: 17,
    marginTop: 20,
  },
  heading: {
    color: "#276749",
    fontWeight: "800",
    fontSize: 15,
    marginTop: 9,
  },
  body: {
    color: "#405348",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 5,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 20,
    padding: 4,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#7E9A87",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checked: { backgroundColor: "#2F855A", borderColor: "#2F855A" },
  checkmark: { color: "#FFFFFF", fontWeight: "900" },
  consentText: {
    flex: 1,
    color: "#304B3A",
    fontSize: 14,
    lineHeight: 21,
  },
  footer: {
    color: "#829188",
    textAlign: "center",
    fontSize: 11,
    marginTop: 20,
  },
});
