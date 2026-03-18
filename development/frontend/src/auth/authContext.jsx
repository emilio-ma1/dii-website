import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

/**
 * Usuarios mock para desarrollo frontend
 */
const MOCK_USERS = [
  {
    id: 1,
    full_name: "Nombre Secretaria",
    email: "admin@example.cl",
    password: "admin123",
    role: "admin",
  },
  {
    id: 2,
    full_name: "Nombre Egresado",
    email: "egresado@example.cl",
    password: "egresado123",
    role: "egresado",
  },
    {
    id: 3,
    full_name: "Nombre Docente",
    email: "docente@example.cl",
    password: "docente123",
    role: "docente",
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Variable de entorno para la URL base de la API
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // frontend
  const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === "true";

  // Cargar sesión al iniciar si se refresca la página
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("[ERROR] Failed to parse stored user session:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login mock para desarrollo frontend
   */
  const loginWithMock = async ({ email, password }) => {
    const foundUser = MOCK_USERS.find(
      (mockUser) => mockUser.email === email && mockUser.password === password
    );

    if (!foundUser) {
      return {
        ok: false,
        message: "Correo o contraseña incorrectos.",
      };
    }

    const mockToken = "mock-token-frontend";
    const { password: _password, ...safeUser } = foundUser;

    localStorage.setItem("token", mockToken);
    localStorage.setItem("user", JSON.stringify(safeUser));

    setUser(safeUser);

    return { ok: true };
  };

  /**
   * Authenticates a user, stores the session token, and updates the context state.
   *
   * @param {object} credentials - Objeto con las credenciales del usuario.
   * @param {string} credentials.email - Correo electrónico del usuario.
   * @param {string} credentials.password - Contraseña del usuario.
   * @returns {Promise<{ok: boolean, message?: string}>} Resultado de la operación con mensaje de contexto.
   */
  const login = async ({ email, password }) => {
    // frontend
    if (USE_MOCK_AUTH) {
      return loginWithMock({ email, password });
    }

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
        // Devuelve el mensaje de error contextualizado desde el backend
        return { 
          ok: false, 
          message: data.error || data.message || "Invalid credentials provided." 
        };
      }

      // Si hay exito: Guardamos Token y Usuario
      const { token, user: userData } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      
      setUser(userData);
      
      return { ok: true };

    } catch (error) {
      console.error("[ERROR] Network failure during login attempt:", error);
      // Mensaje al consumidor con contexto útil
      return { ok: false, message: "Network error: Unable to reach the authentication service." };
    }
  };

  /**
   * Registers a new user in the system (Admin only access).
   *
   * @param {object} userData - Datos del usuario a crear (full_name, email, password).
   * @returns {Promise<{ok: boolean, message?: string}>} Resultado de la operación.
   */
  const register = async (userData) => {
    const token = localStorage.getItem("token");
    
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

      return { ok: true, message: "Usuario creado exitosamente" };
    } catch (error) {
      console.error("[ERROR] Network failure during registration attempt:", error);
      return { ok: false, message: "Network error: Unable to reach the registration service." };
    }
  };

  /**
   * Clears the current user session, removes tokens, and redirects to login.
   */
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login"; // Redirección limpia
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