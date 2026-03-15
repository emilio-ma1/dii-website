import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

/**
 * Página de inicio de sesión del panel administrativo.
 * Permite a los usuarios autenticarse para acceder a las
 * funciones de administración del sitio.
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Maneja el envío del formulario de login
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    const result = await login({ email, password });

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >

        <div className="flex justify-center">
          <img
            src="/images/Dii todo color.jpeg"
            alt="Logo Departamento"
            className="h-34 object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-[#722b4d] text-center">
          Iniciar Sesión
        </h1>

        {errorMessage && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            {errorMessage}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Correo electrónico
          </label>

          <input
            type="email"
            className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#722b4d]/30"
            placeholder="admin@userena.cl"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Contraseña
          </label>

          <input
            type="password"
            className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#722b4d]/30"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <div className="text-right">
            <Link
              to="/recuperar-password"
              className="text-sm text-[#722b4d] hover:underline font-medium"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
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