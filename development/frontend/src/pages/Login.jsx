import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const { login } = useAuth();

    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        setError(null); 
        const resultado = await login({ email, password}); 
        if(resultado.ok){ 
            navigate("/"); 
        }else{ 
            setError(resultado.message); 
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
                    className="w-full bg-[#610b2f] text-white py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                    Ingresar
                </button>
            </form>
        </div>
    );
}