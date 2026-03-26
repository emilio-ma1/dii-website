import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * Password recovery page.
 *
 * Allows the user to submit their institutional email
 * in order to receive password reset instructions.
 *
 * @returns {JSX.Element} Rendered password recovery page.
 */
export default function RecuperarPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

    /**
   * Handles password recovery form submission.
   *
   * Marks the request as submitted and switches the UI
   * to the confirmation state.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
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

        <p className="mt-3 text-center text-sm leading-6 text-gray-600">
          Ingresa tu correo electrónico institucional y te enviaremos
          instrucciones para restablecer tu contraseña.
        </p>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Correo electrónico
              </label>

              <input
                type="email"
                className="w-full rounded-xl border px-4 py-2 outline-none focus:ring-2 focus:ring-[#722b4d]/30"
                placeholder="nombre@userena.cl"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#722b4d] py-2 font-semibold text-white transition hover:opacity-90"
            >
              Enviar
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
        ) : (
          <div className="mt-8 space-y-6">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center text-sm leading-6 text-green-700">
              Recibirás instrucciones para restablecer tu contraseña.
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