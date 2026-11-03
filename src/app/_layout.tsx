import { Stack } from "expo-router";
import React from "react";
import { AuthProvider } from "../hooks/useAuth";

export default function RootLayout(): React.JSX.Element {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#F5FAF6",
          },
          headerTintColor: "#276749",
          contentStyle: {
            backgroundColor: "#F5FAF6",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "FitLife",
            headerShown: false,
          }}
        />

        <Stack.Screen name="register" options={{ title: "Crear cuenta" }} />

        <Stack.Screen
          name="privacy"
          options={{ title: "Aviso de privacidad" }}
        />

        <Stack.Screen
          name="home"
          options={{
            title: "Inicio",
            headerBackVisible: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
