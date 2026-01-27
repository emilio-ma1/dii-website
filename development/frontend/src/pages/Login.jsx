import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al iniciar sesión");
            }
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <form 
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6"
            >
                <h1 className="text-2xl font-bold text-[#610b2f] text-center">
                    Login
                </h1>

                {/* Mostramos mensaje de error si existe */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-center">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Correo electrónico
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30"
                        placeholder="admin@userena.cl"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Contraseña
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30"
                        placeholder="••••••••"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#610b2f] text-white py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                    Ingresar
                </button>
                <p className="text-center text-sm text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <Link to="/registro" className="text-[#610b2f] font-semibold hover:underline">
                        Crear Cuenta
                    </Link>
                </p>
            </form>
        </div>
    );
}