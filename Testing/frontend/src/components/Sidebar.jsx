import { NavLink } from "react-router-dom";
import { MENU_BY_ROLE, ROLE_LABELS } from "../auth/roles";
import { useAuth } from "../auth/authContext";

/**
 * Obtiene el nombre visible del usuario.
 */
function getUserName(user) {
  return user?.full_name || user?.name || "Usuario";
}

/**
 * Obtiene la etiqueta del rol para mostrar.
 */
function getUserRoleLabel(role) {
  if (role === "admin") return "Secretaria del Departamento";
  if (role === "docente") return "Docente";
  return "Egresado";
}

/**
 * Sidebar del panel administrativo.
 * Muestra datos del usuario y navegación según su rol.
 *
 * @param {Object} props
 * @param {Function} props.onNavigate - Se ejecuta al navegar desde el menú 
 */
export default function Sidebar({ onNavigate }) {
  const { user } = useAuth();

  const role = user?.role || "egresado";

  const currentUser = {
    name: getUserName(user),
    role,
    roleLabel: getUserRoleLabel(role),
    avatar: "/images/foto-docente.png",
  };

  const menuItems = MENU_BY_ROLE[role] || [];

  return (
    <aside className="flex h-full flex-col overflow-y-auto">
      <div className="border-b border-black/5 px-6 py-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#722b4d]/15 shadow-sm">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-full w-full object-cover"
            />
          </div>

          <h2 className="mt-4 text-3xl font-bold leading-tight text-[#722b4d]">
            {currentUser.name}
          </h2>

          <p className="mt-1 text-sm text-gray-500">{currentUser.roleLabel}</p>

          <span className="mt-4 inline-flex items-center rounded-full bg-[#722b4d] px-4 py-2 text-sm font-semibold text-white shadow-sm">
            {ROLE_LABELS[role]}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-3">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#722b4d] text-white shadow-md"
                    : "text-gray-700 hover:bg-[#722b4d]/5 hover:text-[#722b4d]"
                }`
              }
            >
              <span className="leading-snug">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}