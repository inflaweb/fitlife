import { router } from "expo-router";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../components/PrimaryButton";
import { useAuth } from "../hooks/useAuth";

const features = [
  { emoji: "🏋️", title: "Rutinas", description: "Generador de ejercicios" },
  { emoji: "📒", title: "Bitácora", description: "Registro de entrenamientos" },
  { emoji: "🥑", title: "Snacks", description: "Recetas saludables" },
  { emoji: "📅", title: "Calendario", description: "Organiza tus sesiones" },
];

export default function HomeScreen() {
  const { currentUser, logout } = useAuth();

  function handleLogout() {
    Alert.alert("Cerrar sesión", "¿Quieres salir de FitLife?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        onPress: () => {
          logout();
          router.replace("/");
        },
      },
    ]);
  }

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Inicia sesión para continuar</Text>
        <PrimaryButton
          title="Ir al login"
          onPress={() => router.replace("/")}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.brand}>FitLife 💪</Text>
      <Text style={styles.title}>¡Hola, {currentUser.name.split(" ")[0]}!</Text>
      <Text style={styles.subtitle}>
        Tu bienestar comienza con pequeños pasos.
      </Text>

      <View style={styles.highlight}>
        <Text style={styles.highlightLabel}>TU OBJETIVO DE HOY</Text>
        <Text style={styles.highlightTitle}>Muévete a tu ritmo</Text>
        <Text style={styles.highlightText}>
          Pronto podrás generar rutinas, registrar tus avances y organizar tus
          entrenamientos.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Explora FitLife</Text>

      <View style={styles.grid}>
        {features.map((feature) => (
          <View style={styles.featureCard} key={feature.title}>
            <Text style={styles.featureEmoji}>{feature.emoji}</Text>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
            <Text style={styles.comingSoon}>Próximamente</Text>
          </View>
        ))}
      </View>

      <View style={styles.profile}>
        <Text style={styles.profileTitle}>Sesión iniciada correctamente</Text>
        <Text style={styles.profileEmail}>{currentUser.email}</Text>
        <Text style={styles.profileNote}>
          Consentimiento de demostración registrado.
        </Text>
      </View>

      <PrimaryButton title="Cerrar sesión" onPress={handleLogout} secondary />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, paddingBottom: 36 },
  brand: {
    fontSize: 23,
    fontWeight: "900",
    color: "#276749",
    marginTop: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#183A28",
    marginTop: 20,
  },
  subtitle: { color: "#63756A", fontSize: 15, marginTop: 6 },
  highlight: {
    backgroundColor: "#276749",
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
  },
  highlightLabel: {
    color: "#BEE6C9",
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1,
  },
  highlightTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 9,
  },
  highlightText: {
    color: "#E2F4E7",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
  sectionTitle: {
    color: "#183A28",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 26,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "48%",
    minHeight: 150,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCE9DF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  featureEmoji: { fontSize: 26 },
  featureTitle: {
    color: "#244333",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 9,
  },
  featureDescription: {
    color: "#63756A",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  comingSoon: {
    color: "#2F855A",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
  },
  profile: {
    backgroundColor: "#E6F4EA",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  profileTitle: { color: "#276749", fontWeight: "800", fontSize: 14 },
  profileEmail: { color: "#244333", marginTop: 5, fontSize: 14 },
  profileNote: { color: "#63756A", marginTop: 5, fontSize: 12 },
});
