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
   * La movemos arriba para que el useEffect pueda usarla.
   */
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    window.location.href = "/login"; // Redirección limpia
  };

  //EFECTO DE VIGILANCIA: Lee el token y programa el cierre de sesión
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      //Rompemos el candado del JWT para leer sus datos (sin alterarlo)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));

      //Calculamos el tiempo (JWT guarda la fecha en segundos, JS usa milisegundos)
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      const timeUntilExpiry = expirationTime - currentTime;

      //i el token ya venció, cerramos sesión inmediatamente por seguridad
      if (timeUntilExpiry <= 0) {
        logout();
      } else {
        //Si el token es válido, restauramos al usuario y ponemos la alarma
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
   * Authenticates a user, stores the session token, and updates the context state.
   */
  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { 
          ok: false, 
          message: data.error || data.message || "Invalid credentials provided." 
        };
      }

      const { token: newToken, user: userData } = data;

      // Guardamos en memoria local
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      
      // Actualizamos los estados (esto dispara el useEffect de vigilancia automáticamente)
      setUser(userData);
      setToken(newToken);
      
      return { ok: true };

    } catch (error) {
      console.error("[ERROR] Network failure during login attempt:", error);
      return { ok: false, message: "Network error: Unable to reach the authentication service." };
    }
  };

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
      login,
      logout,
      register,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider />");
  return ctx;
}