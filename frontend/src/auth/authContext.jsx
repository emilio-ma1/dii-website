import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 

  // cargar sesión al iniciar
  useEffect(() => {
    const raw = localStorage.getItem("session");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem("session");
        setUser(null);
      }
    }
  }, []);

  useEffect(() => {
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  {/*usuario de prueba */}
  if (users.length === 0) {
    const demoUser = {
      email: "admin@demo.cl",
      password: "123456",
      role: "admin",
    };

    localStorage.setItem("users", JSON.stringify([demoUser]));
  }
}, []);

  {/*para iniciar sesión */}
  const login = ({ email, password }) => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const ok = users.some((u) => u.email === email && u.password === password);

    if (!ok) return { ok: false, message: "Correo o contraseña incorrectos." };

    const sessionUser = { email };
    localStorage.setItem("session", JSON.stringify(sessionUser));
    setUser(sessionUser);

    return { ok: true };
  };

  {/* para cerrar sesión */}
  const logout = () => {
    localStorage.removeItem("session");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider />");
  return ctx;
}
