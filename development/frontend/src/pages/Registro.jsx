import { useState } from "react";
import { Link } from "react-router-dom";

export default function Registro() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const mismatch = confirm.length > 0 && password !== confirm;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password !== confirm) return;

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Error de seguridad: No hay sesión activa.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    full_name: fullName,
                    email,
                    password,
                    role: "egresado"
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al crear la cuenta");
            }

            setSuccess("¡Egresado registrado exitosamente!");
            setFullName("");
            setEmail("");
            setPassword("");
            setConfirm("");

        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 space-y-4 border border-white/30"
            >
                <h1 className="text-2xl font-bold text-[#610b2f] text-center">
                    Registrar Egresado
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-center text-sm">
                        {success}
                    </div>
                )}

                {/* NOMBRE COMPLETO */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Nombre Completo</label>
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30"
                        placeholder="Juan Pérez"
                        required
                    />
                </div>

                {/* EMAIL */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Correo</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30"
                        placeholder="juan@alumni.cl"
                        required
                    />
                </div>

                {/* CONTRASEÑA */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Contraseña Provisoria</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30"
                        placeholder="••••••••"
                        required
                    />
                </div>

                {/* CONFIRMAR CONTRASEÑA */}
                <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-700">Confirmar Contraseña</label>
                    <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className={`w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30 ${mismatch ? "border-red-400 focus:ring-red-200" : ""}`}
                        placeholder="••••••••"
                        required
                    />
                    {mismatch && (
                        <p className="text-xs text-red-600">Las contraseñas no coinciden</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={mismatch || !fullName || !email || !password}
                    className="w-full bg-[#610b2f] text-white py-2 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                >
                    Crear Egresado
                </button>

                <p className="text-center text-sm text-gray-600 mt-4">
                    <Link to="/" className="text-[#610b2f] font-semibold hover:underline">
                        Volver al Inicio
                    </Link>
                </p>
            </form>
        </div>
    );
}