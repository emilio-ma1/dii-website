import { useState } from "react";
import { Link } from "react-router-dom";

export default function Registro(){
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");

    const mismatch = confirm.length > 0 && password !== confirm;

    const handleSubmit = (e) => {
        e.preventDefault();
        if(password !== confirm) return;
        alert("Cuenta creada");
    };

    return(
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white/95 rounded-2xl shadow-2xl p-8 space-y-6 border border-white/30">
                <h1 className="text-2xl font-bold text-[#610b2f] text-center">
                    Crear Cuenta
                </h1>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Correo</label>
                    <input type="email" className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30" placeholder="admin@userena.cl" required />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Contraseña</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30" placeholder="••••••••" required />
                </div>
                <div classNAme="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Confirmar Contraseña</label>
                    <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={`w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30 ${ mismatch ? "border-red-400" : "" }`} placeholder="••••••••" required />
                    {mismatch && (
                        <p className="text-xs text-red-600">Las constraseñas no coinciden</p>
                    )}
                </div>
                <button
                type="submit"
                disables={mismatch}
                className="w-full bg-[#610b2f] text-white py-2 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-60">
                    Crear Cuenta
                </button>
                <p className="text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" className="text-[#610b2f] font-semibold hover:underline">
                    Iniciar Sesión
                    </Link>
                </p>
            </form>
        </div>
    );
}