import { useState } from "react";
import { Link } from "react-router-dom";

export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ocurrió un error al procesar la solicitud.");
      }

      setIsSubmitted(true);
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
          Recuperar contraseña
        </h1>

        {!isSubmitted ? (
          <>
            <p className="mt-3 text-center text-sm leading-6 text-gray-600">
              Ingresa tu correo electrónico institucional y te enviaremos
              instrucciones para restablecer tu contraseña.
            </p>

            {error && (
              <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200 text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-[#722b4d]/30 disabled:opacity-50"
                  placeholder="nombre@userena.cl"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-xl bg-[#722b4d] py-2 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? "Enviando..." : "Enviar instrucciones"}
              </button>

              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm font-medium text-[#722b4d] hover:underline"
                >
                  Volver al inicio de sesión
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm leading-6 text-green-700 font-medium">
              Si el correo institucional existe en nuestros registros, recibirás instrucciones para restablecer tu contraseña.
            </div>

            <div className="text-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl bg-[#722b4d] px-5 py-2 font-semibold text-white transition hover:opacity-90"
              >
                Volver al login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}