import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext.jsx";

/**
 * Clases reutilizables para enlaces de navegación en escritorio.
 * Se separan en constantes para evitar duplicación y facilitar mantenimiento visual.
 */
const DESKTOP_LINK_BASE ="relative px-4 py-2  font-semibold text-sm tracking-wide transition-all duration-200 rounded-sm";

/**
 * Estilo para enlace activo en escritorio.
 */
const DESKTOP_LINK_ACTIVE =`${DESKTOP_LINK_BASE} text-white bg-white/15`;

/**
 * Estilo para enlace inactivo en escritorio.
 */
const DESKTOP_LINK_INACTIVE =`${DESKTOP_LINK_BASE} text-white/75 hover:text-white hover:bg-white/10`;

/**
 * Estilo para enlace activo en menú móvil.
 */
const MOBILE_LINK_ACTIVE ="block py-3 px-6 text-white  font-semibold text-sm tracking-wide rounded-sm bg-white/15 border-l-2 border-[#0f70b7] transition-colors";

/**
 * Estilo para enlace inactivo en menú móvil.
 */
const MOBILE_LINK_INACTIVE ="block py-3 px-6 text-white/75  font-semibold text-sm tracking-wide rounded-sm hover:text-white hover:bg-white/10 transition-colors";

/**
 * Renderiza el indicador visual del enlace activo en la navegación.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isActive - Indica si el enlace actual está activo.
 * @returns {JSX.Element|null} La línea indicadora si el enlace está activo; en caso contrario, null.
 */
function ActiveIndicator({ isActive }) {
  if (!isActive) return null;
  return (
    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#0f70b7] rounded-full animate-[fadeIn_0.3s_ease-out]" />
  );
}

/**
 * Renderiza el menú de navegación para dispositivos móviles.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Controla si el menú está visible.
 * @param {React.RefObject<HTMLDivElement>} props.menuRef - Referencia al contenedor del menú para detectar clics externos.
 * @param {{to: string, label: string}[]} props.items - Lista de enlaces de navegación.
 * @param {string} props.currentPath - Ruta actual usada para resaltar el enlace activo.
 * @param {Function} props.onNavigate - Función que se ejecuta al navegar desde el menú.
 * @param {boolean} props.showAuthLinks - Indica si se deben mostrar opciones para usuario autenticado.
 * @param {Function} props.onLogout - Función que se ejecuta al cerrar sesión.
 * @returns {JSX.Element} El menú móvil renderizado.
 */
function MobileMenu({ isOpen, menuRef, items, currentPath, onNavigate, showAuthLinks, onLogout }) {
  return (
    <div
      id="mobile-menu"
      ref={menuRef}
      className={["lg:hidden fixed top-20 left-0 w-full bg-[#722b4d] border-t border-white/10 shadow-2xl z-40","transition-all duration-200 ease-out origin-top overflow-hidden",
        isOpen ? "opacity-100 translate-y-0 max-h-[500px]" : "pointer-events-none opacity-0 -translate-y-2 max-h-0",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-1">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={currentPath === item.to ? MOBILE_LINK_ACTIVE : MOBILE_LINK_INACTIVE}
          >
            {item.label}
          </Link>
        ))}

        {/* Opciones de usuario autenticado */}
        {showAuthLinks && (
          <>
            <Link
              to="/admin"
              onClick={onNavigate}
              className={currentPath === "/admin" ? MOBILE_LINK_ACTIVE : MOBILE_LINK_INACTIVE}
            >
              Mi perfil
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="w-full block py-3 px-6 text-white bg-[#0f70b7] font-semibold rounded-sm text-center hover:bg-[#0d5f9e] transition-colors mt-2"
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
 * Renderiza la barra de navegación principal
 *
 * Responsabilidades:
 * - Mostrar identidad visual institucional.
 * - Renderizar navegación para escritorio y móvil.
 * - Resaltar la ruta activa.
 * - Mostrar opciones de autenticación cuando corresponda.
 * - Cerrar automáticamente el menú móvil en cambios de ruta o clics fuera del menú.
 *
 * @returns {JSX.Element} La barra de navegación principal junto con el menú móvil.
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef(null);

  /**
   * Se memoriza la lista de enlaces para mantener una referencia estable
   * entre renders y evitar recreaciones innecesarias del arreglo.
   */
  const navItems = useMemo(
    () => [
      { to: "/", label: "Inicio" },
      { to: "/docentes", label: "Docentes" },
      { to: "/estudiantes", label: "Nuestros Estudiantes" },
      { to: "/quienes-somos", label: "Quiénes Somos" },
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
   * Activa un estilo visual distinto cuando la página tiene desplazamiento vertical.
   * Esto mejora la legibilidad del navbar sobre el contenido al hacer scroll.
   */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Cierra menú móvil 
   */
  useEffect(() => {
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

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
      <nav
        className={[
          "fixed top-0 left-0 w-full z-50 h-20 flex items-center transition-all duration-300", scrolled? "bg-[#722b4d]/95 backdrop-blur-md shadow-lg": "bg-[#722b4d] shadow-xl",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 min-w-0 flex-shrink-0 group">
            
            <img
              src="/images/Dii-navbar2.jpeg"
              alt="Departamento de Ingeniería Industrial"
              className="h-10 lg:h-12 object-contain"
            />
            <img
              src="/images/Dii-navbar.png"
              alt="Universidad de La Serena"
              className="h-10 lg:h-12 object-contain"
            />
          </Link>

          {/* Navegación Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={location.pathname === item.to ? DESKTOP_LINK_ACTIVE : DESKTOP_LINK_INACTIVE}
              >
                {item.label}
                <ActiveIndicator isActive={location.pathname === item.to} />
              </Link>
            ))}

            {/* Opciones de usuario autenticado */}
            {isAuthenticated && (
              <div className="ml-2 flex items-center gap-2">
                <Link
                  to="/admin"
                  className={`${DESKTOP_LINK_BASE} bg-white/10 hover:bg-white/20 text-white`}
                  title={user?.email || "Mi perfil"}
                >
                  Mi perfil
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-[#0f70b7] hover:bg-[#0d5f9e] px-4 py-2 rounded-sm text-sm font-semibold text-white transition-colors"
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
              className="p-2 rounded-sm text-white hover:bg-white/10 transition-all duration-200"
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
        currentPath={location.pathname}
        onNavigate={closeMobileMenu}
        showAuthLinks={isAuthenticated}
        onLogout={handleLogout}
      />
    </>
  );
}
