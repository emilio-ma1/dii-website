/**
 * @file Sidebar.jsx
 * @description
 * Sidebar navigation component for the administrative dashboard.
 * Renders user profile information and navigation links.
 */
import { NavLink } from "react-router-dom";
import { MENU_BY_ROLE, ROLE_LABELS } from "../auth/roles";
import { useUserProfile } from "../hooks/useUserProfile"; 

export default function Sidebar({ onNavigate }) {
  const { profileData, role } = useUserProfile();
  const menuItems = MENU_BY_ROLE[role] || [];

  return (
    <aside className="flex h-full flex-col overflow-y-auto bg-white border-r border-gray-200 shadow-sm">
      <div className="border-b border-black/5 px-6 py-8">
        <div className="flex flex-col items-center text-center">
          
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[#722b4d]/15 shadow-sm bg-gray-100">
            <img
              src={profileData.avatar}
              alt={`Avatar de ${profileData.name}`}
              className="h-full w-full object-cover"
            />
          </div>

          <h2 className="mt-4 text-2xl font-bold leading-tight text-[#722b4d] capitalize">
            {profileData.name}
          </h2>

          <p className="mt-1 text-sm font-medium text-gray-500">
            {profileData.title}
          </p>

          <span className="mt-4 inline-flex items-center rounded-full bg-[#722b4d] px-4 py-1 text-xs font-semibold text-white shadow-sm uppercase tracking-wider">
            {ROLE_LABELS[role] || "Usuario"}
          </span>
          
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#722b4d] text-white shadow-md"
                    : "text-gray-600 hover:bg-[#722b4d]/10 hover:text-[#722b4d]"
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