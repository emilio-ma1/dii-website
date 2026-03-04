import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/authContext.jsx";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const { isAuthenticated, user, logout } = useAuth();

  {/* cierra sesión y redirige al login */}
  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login", { replace: true });
  };

  {/* detecta clics fuera del menú del celular para cerrarlo */}
  useEffect(() => {
    function handleClickOutside(e) {
      if (!open) return;
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <>
      {/* navbar */}
      <nav className="bg-[#610b2f] text-gray-200 shadow-xl fixed top-0 left-0 w-full z-50 h-20 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full h-full flex items-center justify-between">
          {/* titulo */}
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

          {/* menú desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <Link to="/" className="hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Inicio
            </Link>
            <Link to="/docentes" className="hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Docentes
            </Link>
            <Link to="/estudiantes" className="hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Nuestros Estudiantes
            </Link>
            <Link to="/quienes-somos" className="hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Quienes Somos
            </Link>
            <Link to="/contacto" className="hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
              Contacto
            </Link>

            {/* aparecen si el usuario esta logueado */}
            {isAuthenticated && (
              <div className="ml-2 flex items-center gap-2">
                <Link to="/admin" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors" title={user?.email || "Mi perfil"}>
                Mi perfil
                </Link>
                <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                  Cerrar sesión
                  </button>
                  </div>
                )}
          </div>
          {/* botón hamburguesa */}
          <div className="lg:hidden flex-shrink-0">
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
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

      {/* menú celular */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={[
          "lg:hidden fixed top-20 left-0 w-full bg-white/95 backdrop-blur-sm shadow-2xl border-t border-black/5 z-40",
          "transition-all duration-200 ease-out origin-top",
          open ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-2",
        ].join(" ")}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-2">
          <Link to="/" onClick={() => setOpen(false)} className="block py-3 px-6 text-[#610b2f] font-semibold rounded-xl text-center hover:bg-gray-200 transition-colors">
            Inicio
          </Link>
          <Link to="/estudiantes" onClick={() => setOpen(false)} className="block py-3 px-6 text-[#610b2f] font-semibold rounded-xl text-center hover:bg-gray-200 transition-colors">
            Nuestros Estudiantes
          </Link>
          <Link to="/docentes" onClick={() => setOpen(false)} className="block py-3 px-6 text-[#610b2f] font-semibold rounded-xl text-center hover:bg-gray-200 transition-colors">
            Docentes
          </Link>
          <Link to="/quienes-somos" onClick={() => setOpen(false)} className="block py-3 px-6 text-[#610b2f] font-semibold rounded-xl text-center hover:bg-gray-200 transition-colors">
            Quienes Somos
          </Link>
          <Link to="/contacto" onClick={() => setOpen(false)} className="block py-3 px-6 text-[#610b2f] font-semibold rounded-xl text-center hover:bg-gray-200 transition-colors">
            Contacto
          </Link>

          {/* aparece si el usuario esta logueado  */}
          {isAuthenticated && (
            <>
            <Link to="/admin" onClick={() => setOpen(false)} className="block py-3 px-6 text-[#610b2f] font-semibold rounded-xl text-center hover:bg-gray-200 transition-colors">
            Mi perfil
            </Link>
            <button
            onClick={handleLogout}
            className="w-full block py-3 px-6 text-white bg-[#610b2f] font-semibold rounded-xl text-center hover:opacity-90 transition">
              Cerrar sesión
              </button>
              </>
            )}
        </div>
      </div>
    </>
  );
}
