import { useMemo, useState } from "react";
import { useAuth } from "../auth/authContext";

/**
 * Valida si el campo de contraseña y el de confirmación coinciden exactamente.
 *
 * @param {string} password La contraseña original ingresada.
 * @param {string} confirmPassword La contraseña de confirmación ingresada.
 * @returns {boolean} Verdadero (true) si coinciden, falso (false) en caso contrario.
 */
function arePasswordsMatching(password, confirmPassword) {
  return password === confirmPassword;
}

export default function AdminUsuarios() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Estados para el feedback visual en la interfaz
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { register } = useAuth(); 

  // Detecta si hay texto en la confirmación y las contraseñas no son iguales
  const isPasswordMismatch = confirmPassword.length > 0 && !arePasswordsMatching(password, confirmPassword);

  // Memoriza las clases de Tailwind para no recalcularlas en cada render
  const confirmInputClassName = useMemo(() => {
    const baseClassName =
      "mt-1 w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#722b4d]/30";
    return isPasswordMismatch ? `${baseClassName} border-red-400` : baseClassName;
  }, [isPasswordMismatch]);

  /**
   * Limpia todos los campos del formulario y los mensajes de error.
   */
  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrorMessage("");
  };

  /**
   * Maneja el envío del formulario, valida las contraseñas y consume la API de registro.
   *
   * @param {object} event El evento de envío (submit) del formulario.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Retorno temprano de seguridad por si el botón fue vulnerado [cite: 759, 760]
    if (isPasswordMismatch) return;

    const result = await register({ full_name: fullName, email: email, password: password });
    
    if (result.ok) {
      setSuccessMessage(`Cuenta creada exitosamente para: ${email}`);
      resetForm();
    } else {
      setErrorMessage(`Error: ${result.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Crear cuentas</h2>

      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700">Nombre Completo</label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="mt-1 w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#722b4d]/30"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#722b4d]/30"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#722b4d]/30"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className={confirmInputClassName}
              required
            />
            {isPasswordMismatch && (
              <p className="text-xs text-red-600 mt-1">Las contraseñas no coinciden.</p>
            )}
          </div>

          {/* Mensajes de Feedback */}
          {successMessage && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isPasswordMismatch}
            className="w-full bg-[#722b4d] text-white py-2 rounded-xl font-semibold hover:opacity-90 disabled:opacity-60"
          >
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  );
}