import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext.jsx";

/**
 * Reusable classes for desktop navigation links.
 * Separated into constants to avoid duplication and simplify visual maintenance.
 */
const DESKTOP_LINK_BASE ="relative px-4 py-2  font-semibold text-sm tracking-wide transition-all duration-200 rounded-sm";

/**
 * Style for active desktop link.
 */
const DESKTOP_LINK_ACTIVE =`${DESKTOP_LINK_BASE} text-white bg-white/15`;

/**
 * Style for inactive desktop link.
 */
const DESKTOP_LINK_INACTIVE =`${DESKTOP_LINK_BASE} text-white/75 hover:text-white hover:bg-white/10`;

/**
 * Style for active mobile menu link.
 */
const MOBILE_LINK_ACTIVE ="block py-3 px-6 text-white  font-semibold text-sm tracking-wide rounded-sm bg-white/15 border-l-2 border-[#0f70b7] transition-colors";

/**
 * Style for inactive mobile menu link.
 */
const MOBILE_LINK_INACTIVE ="block py-3 px-6 text-white/75  font-semibold text-sm tracking-wide rounded-sm hover:text-white hover:bg-white/10 transition-colors";

/**
 * Renders the visual indicator for the active navigation link.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isActive - Indicates whether the current link is active.
 * @returns {JSX.Element|null} The indicator line if active; otherwise null.
 */
function ActiveIndicator({ isActive }) {
  if (!isActive) return null;
  return (
    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#0f70b7] rounded-full animate-[fadeIn_0.3s_ease-out]" />
  );
}

/**
 * Renders the navigation menu for mobile devices.
 *
 * @param {Object} props - Component props.
 * @param {boolean} props.isOpen - Controls whether the menu is visible.
 * @param {React.RefObject<HTMLDivElement>} props.menuRef - Reference to the menu container to detect outside clicks.
 * @param {{to: string, label: string}[]} props.items - List of navigation links.
 * @param {string} props.currentPath - Current route used to highlight the active link.
 * @param {Function} props.onNavigate - Function executed when navigating from the menu.
 * @param {boolean} props.showAuthLinks - Indicates whether authenticated user options should be shown.
 * @param {Function} props.onLogout - Function executed when logging out.
 * @returns {JSX.Element} The rendered mobile menu.
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

        {/* Authenticated user options */}
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
              className="w-full block py-3 px-6 text-white bg-[#990012] font-semibold rounded-sm text-center hover:bg-[#951f3e] transition-colors mt-2"
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
 * Renders the main navigation bar.
 *
 * Responsibilities:
 * - Display institutional branding.
 * - Render desktop and mobile navigation.
 * - Highlight the active route.
 * - Show authentication-related options when applicable.
 * - Automatically close the mobile menu on route changes or outside clicks.
 *
 * @returns {JSX.Element} The main navigation bar along with the mobile menu.
 */
export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef(null);

  /**
   * Memoizes the navigation links list to keep a stable reference
   * between renders and avoid unnecessary array recreations.
   */
  const navItems = useMemo(
    () => [
      { to: "/", label: "Inicio" },
      { to: "/quienes-somos", label: "Conócenos" },
      { to: "/docentes", label: "Docentes" },
      { to: "/estudiantes", label: "Nuestros Estudiantes" },
      { to: "/contacto", label: "Contacto" },
    ],
    []
  );

  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  /**
   * Handles user logout
   */

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    navigate("/login", { replace: true });
  };

  /**
   * Applies a different visual style when the page is scrolled.
   * This improves navbar readability over content.
   */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMobileMenu();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  /**
   * Detects clicks outside the mobile menu
   * to close it automatically
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
      <nav
        className={[
          "fixed top-0 left-0 w-full z-50 h-20 flex items-center transition-all duration-300", scrolled? "bg-[#722b4d]/95 backdrop-blur-md shadow-lg": "bg-[#722b4d] shadow-xl",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 min-w-0 flex-shrink-0 group">
            <img
              src="/images/test_hor.png"
              alt="Departamento de Ingeniería Industrial"
              className="h-16 lg:h-20 object-contain"
            />
          </Link>

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

            {/* Authenticated user options */}
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
                  className="bg-[#990012] hover:bg-[#951f3e] px-4 py-2 rounded-sm text-sm font-semibold text-white transition-colors"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>

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
