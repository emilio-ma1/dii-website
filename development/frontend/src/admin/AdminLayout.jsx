import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useAuth } from "../auth/authContext.jsx";

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getNavLinkClassName = ({ isActive }) =>
    `block px-4 py-3 rounded-xl transition ${
      isActive ? "bg-[#722b4d] text-white" : "text-gray-700 hover:bg-[#722b4d]/10"
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <header className="bg-[#722b4d] text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Panel de Administración</h1>
            <p className="text-sm text-white/80">Gestiona contenido y crea cuentas</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow p-4 space-y-2">
            <NavLink to="/admin" end className={getNavLinkClassName}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/usuarios" className={getNavLinkClassName}>
              Crear cuentas
            </NavLink>
          </div>
        </aside>

        <main className="lg:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
