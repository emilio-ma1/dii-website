import { Link } from "react-router-dom";

export default function Login() {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <form className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
                <h1 className="text-2xl font-bold text-[#610b2f] text-center">
                    Login
                </h1>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Correo electrónico
                    </label>
                    <input
                    type="email"
                    className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30"
                    placeholder="admin@userena.cl"/>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Contraseña
                    </label>
                    <input
                    type="password"
                    className="w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30"
                    placeholder="••••••••"/>
                </div>
                <button
                type="submit"
                className="w-full bg-[#610b2f] text-white py-2 rounded-xl font-semibold hover:opacity-90">
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