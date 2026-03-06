import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext.jsx";

/**
 * Clases reutilizables para links en versión desktop
 */
const DESKTOP_LINK_CLASS =
  "hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold transition-colors";

  /**
 * Clases reutilizables para links en versión mobile
 */
const MOBILE_LINK_CLASS =
  "block py-3 px-6 text-[#722b4d] font-semibold rounded-xl text-center hover:bg-gray-200 transition-colors";

  /**
 * Menú móvil desplegable.
 *
 * @param {boolean} isOpen - Controla si el menú está visible
 * @param {ref} menuRef - Referencia del menú para detectar clicks externos
 * @param {Array} items - Lista de links de navegación
 * @param {function} onNavigate - Callback al navegar
 * @param {boolean} showAuthLinks - Indica si mostrar opciones de usuario autenticado
 * @param {function} onLogout - Función para cerrar sesión
 */

function MobileMenu({ isOpen, menuRef, items, onNavigate, showAuthLinks, onLogout }) {
  return (
    <div
      id="mobile-menu"
      ref={menuRef}
      className={[
        "lg:hidden fixed top-20 left-0 w-full bg-white/95 backdrop-blur-sm shadow-2xl border-t border-black/5 z-40",
        "transition-all duration-200 ease-out origin-top",
        isOpen ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-2",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-2">
        {/* Links de navegación */}
        {items.map((item) => (
          <Link key={item.to} to={item.to} onClick={onNavigate} className={MOBILE_LINK_CLASS}>
            {item.label}
          </Link>
        ))}
        
        {/* Opciones de usuario autenticado */}
        {showAuthLinks && (
          <>
            <Link to="/admin" onClick={onNavigate} className={MOBILE_LINK_CLASS}>
              Mi perfil
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="w-full block py-3 px-6 text-white bg-[#722b4d] font-semibold rounded-xl text-center hover:opacity-90 transition"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * Navbar principal del sitio.
 *
 * Funcionalidades:
 * - Navegación entre páginas
 * - Menú responsive (desktop / mobile)
 * - Opciones de usuario autenticado
 * - Cierre automático del menú al hacer click fuera
 */

export default function Navbar() {
  // hook de navegación de React Router
  const navigate = useNavigate();
  // contexto de autenticación
  const { isAuthenticated, user, logout } = useAuth();
  // estado del menú móvil
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // referencia al menú móvil para detectar clicks externos
  const menuRef = useRef(null);

  /**
   * Links principales del navbar.
   * useMemo evita recrear el array en cada render.
   */
  const navItems = useMemo(
    () => [
      { to: "/", label: "Inicio" },
      { to: "/docentes", label: "Docentes" },
      { to: "/estudiantes", label: "Nuestros Estudiantes" },
      { to: "/quienes-somos", label: "Quienes Somos" },
      { to: "/contacto", label: "Contacto" },
    ],
    []
  );

  // cierra el menú móvil
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  // alterna estado del menú móvil
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  /**
   * Maneja cierre de sesión del usuario
   */
  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/login", { replace: true });
  };

  /**
   * Detecta click fuera del menú móvil
   * para cerrarlo automáticamente
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (!isMobileMenuOpen) return;
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMobileMenu();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <>
    {/* Navbar principal */}
      <nav className="bg-[#722b4d] text-gray-200 shadow-xl fixed top-0 left-0 w-full z-50 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full h-full flex items-center justify-between">
          {/* Logo / identidad del departamento */}
          <div className="flex items-center gap-3 min-w-0 flex-shrink-0">
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm sm:text-base md:text-lg font-bold tracking-tight text-gray-200 truncate">
                DEPARTAMENTO DE INGENIERÍA INDUSTRIAL
              </h1>
              <p className="text-xs sm:text-sm font-medium opacity-90 text-gray-300 truncate">
                UNIVERSIDAD DE LA SERENA
              </p>
            </div>
          </div>

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to} className={DESKTOP_LINK_CLASS}>
                {item.label}
              </Link>
            ))}

            {/* Opciones de usuario autenticado */}
            {isAuthenticated && (
              <div className="ml-2 flex items-center gap-2">
                <Link
                  to="/admin"
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  title={user?.email || "Mi perfil"}
                >
                  Mi perfil
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>

          {/* Botón menú móvil */}
          <div className="lg:hidden flex-shrink-0">
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-label="Abrir menú"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 18h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        menuRef={menuRef}
        items={navItems}
        onNavigate={closeMobileMenu}
        showAuthLinks={isAuthenticated}
        onLogout={handleLogout}
      />
    </>
  );
}