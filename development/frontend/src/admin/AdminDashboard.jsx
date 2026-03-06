import { Link } from "react-router-dom";

{/* tarjeta */}
function Card({ title, desc, to }) {
  return (
    <div className="bg-white rounded-2xl shadow border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-2">{desc}</p>
      <Link to="/admin/adminusuarios" className="inline-block mt-4 text-[#610b2f] font-semibold hover:underline">
        Ir al módulo →
      </Link>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Crear cuentas"
          desc="Crea cuentas para editores o administradores."
          to="/admin/usuarios"
        />
      </div>
    </div>
  );
}
