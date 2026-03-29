import { useState } from "react";
import { useParams, Link } from "react-router-dom";

/**
 * Component for rendering the final password reset screen.
 * Extracts the single-use token from the URL parameters and submits the new password.
 * * @returns {JSX.Element} Rendered Reset Password view.
 */
export default function ResetPassword() {
  const { token } = useParams(); // Extrae el parámetro dinámico de la URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  /**
   * Handles the submission of the new password.
   * Performs client-side validation before making the API request.
   * * @param {React.FormEvent<HTMLFormElement>} event 
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden. Por favor, verifica.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al intentar actualizar la contraseña.");
      }

      setIsSuccess(true);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex justify-center">
          <img
            src="/images/Dii todo color.jpeg"
            alt="Logo Departamento"
            className="h-34 object-contain"
          />
        </div>

        <h1 className="mt-2 text-center text-2xl font-bold text-[#722b4d]">
          Crear nueva contraseña
        </h1>

        {!isSuccess ? (
          <>
            <p className="mt-3 text-center text-sm leading-6 text-gray-600">
              Ingresa y confirma tu nueva contraseña de acceso.
            </p>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-[#722b4d]/30 disabled:opacity-50"
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Confirmar contraseña
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-[#722b4d]/30 disabled:opacity-50"
                    placeholder="Repite la nueva contraseña"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-[#722b4d] py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? "Actualizando..." : "Guardar contraseña"}
              </button>
            </form>
          </>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm leading-6 text-green-700 font-medium">
              ¡Tu contraseña ha sido actualizada exitosamente! Ya puedes iniciar sesión con tus nuevas credenciales.
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center w-full rounded-xl bg-[#722b4d] px-5 py-2 font-semibold text-white transition hover:opacity-90"
              >
                Ir a iniciar sesión
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}