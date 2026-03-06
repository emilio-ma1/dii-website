import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // Cargar sesion al iniciar si se refrescas la pagina
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error al restaurar sesión:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  // Funcion de Login
  const login = async ({ email, password }) => {
    try {
      const response = await fetch(`http://localhost:3000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si el backend devuelve error (400, 401, 500)
        return { 
          ok: false, 
          message: data.error || data.message || "Error al iniciar sesión" 
        };
      }

      // Si hay exito: Guardamos Token y Usuario
      const { token, user: userData } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      
      return { ok: true };

    } catch (error) {
      console.error("Error de red:", error);
      return { ok: false, message: "Error de conexión con el servidor." };
    }
  };

  // Funcion de Registro
  const register = async (userData) => {

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/api/auth/register`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(userData), 
      });

      const data = await response.json();

      if (!response.ok) {
        return { ok: false, message: data.error || data.message || "Error al registrarse" };
      }

      return { ok: true, message: "Usuario creado exitosamente" };
    } catch (error) {
      console.error("Error en register:", error);
      return { ok: false, message: "Error de conexión" };
    }
  };

  // Cerrar sesion
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Se borra el token
    setUser(null);
    window.location.href = "/login"; // Forzar redireccion limpia
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