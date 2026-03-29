/**
 * @file Login.jsx
 * @description
 * Administrative panel login page with 2FA email verification.
 * * Responsibilities:
 * - Manages the 2-step authentication flow (Credentials -> 2FA Code).
 * - Uses conditional rendering to switch between login phases without reloading.
 * - Handles and displays controlled user-friendly error messages.
 */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function Login() {
  const navigate = useNavigate();
  const { setSession } = useAuth(); 

  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados del 2FA
  const [code, setCode] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  
  // Estados de UI
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * Handles initial credentials submission and triggers 2FA email.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event.
   */
  const handlePhase1 = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 206 && data.requires2FA) {
        setTempToken(data.tempToken);
        setRequires2FA(true);
      } else if (!response.ok) {
        throw new Error(data.message || "Error al iniciar sesión.");
      } else {
        setSession(data.token, data.user);
        navigate("/admin/investigaciones", { replace: true });
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   *
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  const handlePhase2 = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-2fa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Código inválido o expirado.");
      }

      setSession(data.token, data.user);
      navigate("/admin/investigaciones", { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        
        <div className="flex justify-center">
          <img
            src="/images/Dii todo color.jpeg"
            alt="Logo Departamento"
            className="h-34 object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-[#722b4d] text-center">
          {requires2FA ? "Verificación de Seguridad" : "Iniciar Sesión"}
        </h1>

        {errorMessage && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            {errorMessage}
          </div>
        )}

        {!requires2FA ? (
          <form onSubmit={handlePhase1} className="space-y-6">
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
                disabled={isLoading}
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
                disabled={isLoading}
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
              disabled={isLoading}
              className="w-full bg-[#722b4d] text-white py-2 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? "Validando..." : "Ingresar"}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePhase2} className="space-y-6">
            <p className="text-sm text-gray-600 text-center">
              Hemos enviado un código de 6 dígitos a <br/><strong>{email}</strong>.
            </p>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 text-center block">
                Código de Verificación
              </label>
              <input
                type="text"
                maxLength="6"
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#722b4d]/30 text-center text-2xl tracking-widest font-bold text-[#722b4d]"
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full bg-[#722b4d] text-white py-2 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50"
            >
              {isLoading ? "Verificando..." : "Confirmar Acceso"}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setRequires2FA(false);
                setErrorMessage("");
              }}
              className="w-full text-sm text-gray-500 hover:text-gray-800 font-medium text-center"
              disabled={isLoading}
            >
              Volver atrás
            </button>
          </form>
        )}
      </div>
    </div>
  );
}