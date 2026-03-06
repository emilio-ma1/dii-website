import { useState } from "react"; 
import { useAuth } from "../auth/authContext";

export default function AdminUsuarios() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);

  //detecta si las contraseñas no coinciden
  const mismatch = confirm.length > 0 && pass !== confirm;
  const { register } = useAuth();
  //envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (pass !== confirm) return;
    const result =  await register({full_name: name, email: email, password: pass});
    if(result.ok){
      alert(`Cuenta creada: ${email}`);
      //limpia el formulario
      setName("");
      setEmail("");
      setPass("");
      setConfirm("");
    }else{ 
      alert(`Error: ${result.message}`) 
    } 
  }
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Crear cuentas</h2>
      {/* tarjeta del formulario */}
      <div className="bg-white rounded-2xl shadow border border-gray-200 p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* campo nombre */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Nombre Completo</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30" required />
          </div>
            {/* campo correo */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Correo</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30"  required />
          </div>
          {/* campo contraseña */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Contraseña</label>
            <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} className="mt-1 w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30" required />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700">
              Confirmar contraseña
            </label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={`mt-1 w-full border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#610b2f]/30 
            ${mismatch ? "border-red-400" : "" }`} required />
            {mismatch && (
              <p className="text-xs text-red-600 mt-1">
                Las contraseñas no coinciden.
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={mismatch}
            className="w-full bg-[#610b2f] text-white py-2 rounded-xl font-semibold hover:opacity-90 disabled:opacity-60"
          >
            Crear cuenta
          </button>
        </form>
      </div>
    </div>
  );
}
