/**
 * @file authContext.js
 * @description
 * Global authentication state manager.
 * * Responsibilities:
 * - Persists and manages the final user session.
 * - Monitors JWT expiration and automatically logs out the user for security.
 * - Exposes setSession to allow components to orchestrate multi-step logins (e.g., 2FA).
 */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Agregamos el token al estado para que React reaccione si cambia
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Variable de entorno para la URL base de la API
  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * Clears the current user session, removes tokens, and redirects to login.
   */
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.location.href = "/login"; // Redirección limpia
  };

  /**
   * Saves the final authenticated session into the global state and storage.
   * Called by the Login component only AFTER the 2FA process is successfully completed.
   */
  const setSession = (newToken, userData) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
  };

//Lee el token y programa el cierre de sesión
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // Rompemos el candado del JWT para leer sus datos (sin alterarlo)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      // Calculamos el tiempo (JWT guarda la fecha en segundos, JS usa milisegundos)
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      // Si el token ya venció, cerramos sesión inmediatamente por seguridad
      if (timeUntilExpiry <= 0) {
        logout();
      } else {
        // Si el token es válido, restauramos al usuario y ponemos la alarma
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const timer = setTimeout(() => {
          console.warn("[AUTH] El token ha expirado. Cerrando sesión automáticamente.");
          alert("Tu sesión ha expirado por seguridad. Por favor, ingresa nuevamente.");
          logout();
        }, timeUntilExpiry);

        setLoading(false);

        // Limpiamos el reloj si el componente se desmonta o el usuario cierra sesión manual
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error("[ERROR] Failed to parse token:", error);
      logout(); // Si el token está corrupto o alterado, lo expulsamos por seguridad
    }
  }, [token]);

  /**
   * Registers a new user in the system (Admin only access).
   */
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(userData), 
      });

      const data = await response.json();

      if (!response.ok) {
        return { ok: false, message: data.error || data.message || "Registration failed due to invalid data." };
      }

      return { ok: true, message: "Usuario creado exitosamente", user: data.user };
    } catch (error) {
      console.error("[ERROR] Network failure during registration attempt:", error);
      return { ok: false, message: "Network error: Unable to reach the registration service." };
    }
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      setSession,
      logout,
      register,
    }),
    [user, loading, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider />");
  return ctx;
}