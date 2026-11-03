import { supabase } from "../lib/supabase";

export async function registrarUsuario(
  nombre: string,
  email: string,
  password: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        nombre: nombre.trim(),
      },
    },
  });

  if (error) throw error;

  return data;
}

export async function iniciarSesion(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });

  if (error) throw error;

  return data;
}

export async function cerrarSesion() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function obtenerPerfil() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("No hay una sesión iniciada.");

  const { data, error } = await supabase
    .from("profiles")
    .select("id, nombre, created_at")
    .eq("id", user.id)
    .single();

  if (error) throw error;

  return data;
}
