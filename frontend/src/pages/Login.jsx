import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  {/*maneja el envio del formulario */}
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const res = login({ email, password: pass });
    if (!res.ok) {
      setError(res.message);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      {/* formulario */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-[#610b2f] text-center">
          Login
        </h1>

        {error && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl p-3">
            {error}
          </div>
        )}
        {/* campo para el correo y la contraseña */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Correo electrónico
          </label>
          <input type="email" className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30" placeholder="admin@userena.cl" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Contraseña
          </label>
          <input type="password" className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30" placeholder="••••••••" value={pass} onChange={(e) => setPass(e.target.value)} required />
        </div>
        {/* botón para ingresar */}
        <button
          type="submit"
          className="w-full bg-[#610b2f] text-white py-2 rounded-xl font-semibold hover:opacity-90 transition">
          Ingresar
        </button>
      </form>
    </div>
  );
}
