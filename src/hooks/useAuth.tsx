import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "../lib/supabase";

const NOTICE_VERSION = "2.0-demo";

export type User = {
  id: string;
  name: string;
  email: string;
  consentAccepted: boolean;
};

type NewUser = {
  name: string;
  email: string;
  password: string;
};

type AuthContextType = {
  currentUser: User | null;
  pendingUser: NewUser | null;
  loading: boolean;
  prepareRegistration: (user: NewUser) => Promise<void>;
  acceptPrivacy: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [pendingUser, setPendingUser] = useState<NewUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener el perfil del usuario autenticado.
  async function loadCurrentUser(userId: string): Promise<void> {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError || !authData.user || authData.user.id !== userId) {
      setCurrentUser(null);
      return;
    }

    const authUser = authData.user;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, nombre, privacy_accepted")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error al cargar el perfil:", error.message);
      console.error("Detalles:", error);
      setCurrentUser(null);
      return;
    }

    setCurrentUser({
      id: authUser.id,
      name:
        profile?.nombre || authUser.user_metadata?.nombre || "Usuario FitLife",
      email: authUser.email || "",
      consentAccepted: profile?.privacy_accepted === true,
    });
  }

  // Recuperar y observar la sesión de Supabase.
  useEffect(() => {
    let mounted = true;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      if (session?.user) {
        // No esperar una consulta de Supabase dentro del callback.
        setTimeout(() => {
          if (mounted) {
            void loadCurrentUser(session.user.id);
          }
        }, 0);
      } else {
        setCurrentUser(null);
      }
    });

    async function initializeSession() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (mounted && session?.user) {
          await loadCurrentUser(session.user.id);
        }
      } catch {
        if (mounted) setCurrentUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void initializeSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Preparar el registro, sin crear la cuenta todavía.
  async function prepareRegistration(user: NewUser): Promise<void> {
    const name = user.name.trim();
    const email = user.email.trim().toLowerCase();

    if (name.length < 2 || name.length > 80) {
      throw new Error("El nombre debe tener entre 2 y 80 caracteres.");
    }

    if (/[\u0000-\u001F\u007F]/.test(name)) {
      throw new Error("El nombre contiene caracteres no permitidos.");
    }

    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Escribe un correo electrónico válido.");
    }

    if (user.password.length < 8 || user.password.length > 72) {
      throw new Error("La contraseña debe tener entre 8 y 72 caracteres.");
    }

    setPendingUser({
      name,
      email,
      password: user.password,
    });
  }

  // Crear la cuenta únicamente después de aceptar privacidad.
  async function acceptPrivacy(): Promise<void> {
    if (!pendingUser) {
      throw new Error("No hay un registro pendiente.");
    }

    const { data, error } = await supabase.auth.signUp({
      email: pendingUser.email,
      password: pendingUser.password,
      options: {
        data: {
          nombre: pendingUser.name,
          privacy_accepted: true,
          privacy_notice_version: NOTICE_VERSION,
        },
      },
    });

    if (error) {
      throw new Error(
        error.message === "User already registered"
          ? "Ya existe una cuenta con ese correo."
          : "No fue posible crear la cuenta. Verifica tus datos e inténtalo nuevamente.",
      );
    }

    if (!data.user) {
      throw new Error("Supabase no devolvió los datos del usuario.");
    }

    setPendingUser(null);
  }

  // Inicio de sesión real mediante Supabase Auth.
  async function login(email: string, password: string): Promise<boolean> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      console.log("Error de inicio de sesión:", error.message);
      throw new Error(error.message);
    }

    return Boolean(data.user);
  }

  // Cerrar sesión en Supabase.
  async function logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error("No se pudo cerrar la sesión.");
    }
  }

  const contextValue: AuthContextType = {
    currentUser,
    pendingUser,
    loading,
    prepareRegistration,
    acceptPrivacy,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe utilizarse dentro de AuthProvider.");
  }

  return context;
}
