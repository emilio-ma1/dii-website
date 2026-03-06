import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";

/**
 * Página de inicio de sesión del panel administrativo.
 * Permite a los usuarios autenticarse para acceder a las
 * funciones de administración del sitio.
 */
export default function Login() {
  // hook para navegar entre rutas
  const navigate = useNavigate();
  // función de autenticación desde el contexto
  const { login } = useAuth();

  // estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // mensaje de error si el login falla
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Maneja el envío del formulario de login
   * e intenta autenticar al usuario.
   */
  const handleSubmit = async (event) => {
    // evita que el formulario recargue la página
    event.preventDefault();
    // limpia cualquier error previo
    setErrorMessage("");

    const result = await login({ email, password });
    // si la autenticación falla, mostrar mensaje
    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    // redirige al panel de administración
    navigate("/admin", { replace: true }); 
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        {/* formulario de login */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >
        {/* título */}
        <h1 className="text-2xl font-bold text-[#722b4d] text-center">Login</h1>
        
        {/* mensaje de error */}
        {errorMessage && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            {errorMessage}
          </div>
        )}
        {/* campo correo electrónico */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Correo electrónico</label>
          <input
            type="email"
            className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#722b4d]/30"
            placeholder="admin@userena.cl"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        {/* campo contraseña */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Contraseña</label>
          <input
            type="password"
            className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#722b4d]/30"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#722b4d] text-white py-2 rounded-xl font-semibold hover:opacity-90 transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}