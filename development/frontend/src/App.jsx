import { useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";

import ProtectedRoute from "./auth/ProtectedRoute.jsx";

import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";
import ScrollToTopButton from "./components/ScrollToTopButton.jsx";

import AdminLayout from "./admin/AdminLayout.jsx";
//import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminUsuarios from "./admin/AdminUsuarios.jsx";
import GestionInvestigaciones from "./admin/GestionInvestigaciones.jsx";
import GestionCuentas from "./admin/GestionCuentas.jsx";
import GestionVinculacion from "./admin/GestionVinculacion.jsx";
import GestionDocentes from "./admin/GestionDocentes.jsx";
import GestionEstudiantes from "./admin/GestionEstudiantes.jsx";
import GestionContacto from "./admin/GestionContacto.jsx";
import GestionEquipamiento from "./admin/GestionEquipamiento.jsx";
import Trazabilidad from "./admin/Trazabilidad.jsx";

import Home from "./pages/home.jsx";
import Academico from "./pages/Academico.jsx";
import Contacto from "./pages/Contacto.jsx";
import Investigaciones from "./pages/Investigaciones.jsx";
import QuienesSomos from "./pages/QuienesSomos.jsx";
import Noticias from "./pages/Noticias.jsx";
import Estudiantes from "./pages/Estudiantes.jsx";
import Docentes from "./pages/Docentes.jsx";
import Login from "./pages/Login.jsx";
import VinculacionConElMedio from "./pages/VinculacionconelMedio.jsx";
import VinculacionDetalle from "./pages/VinculacionDetalle.jsx";
import InvestigacionDetalle from "./pages/InvestigacionDetalle.jsx";
import RecuperarPassword from "./pages/RecuperarContrasena.jsx";
import { AuthProvider } from "./auth/authContext.jsx";


/**
 * Layout principal del sitio.
 *
 * Este componente define la estructura base de todas las páginas públicas,
 * incluyendo:
 * - Navbar superior
 * - Contenido dinámico mediante <Outlet>
 * - Footer inferior
 */
function Layout() {
  // obtiene la ubicación actual de la ruta
  const location = useLocation();

  /**
   * Cada vez que cambia la ruta se desplaza automáticamente
   * la página hacia la parte superior.
   */
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <ScrollToTopButton />
      <main className="flex-1 pt-20 pb-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}



/**
 * Componente principal de la aplicación.
 *
 * Define todas las rutas del sitio utilizando React Router.
 * Incluye:
 * - rutas públicas
 * - rutas protegidas (panel administrador)
 */
export default function App() {
  return (
    <AuthProvider>
    <Routes>
      {/* rutas públicas del sitio */}
      <Route path="/" element={<Layout />}>
      {/* página principal */}
        <Route index element={<Home />} />
        {/* secciones informativas */}
        <Route path="quienes-somos" element={<QuienesSomos />} />
        <Route path="contacto" element={<Contacto />} />
        {/* áreas del departamento */}
        <Route path="academico" element={<Academico />} />
        <Route path="investigaciones" element={<Investigaciones />} />
        {/* noticias */}
        <Route path="noticias" element={<Noticias />} />
        {/* comunidad académica */}
        <Route path="estudiantes" element={<Estudiantes />} />
        <Route path="docentes" element={<Docentes />} />
        {/* autenticación */}
        <Route path="login" element={<Login />} />
        {/* detalle de proyecto de vinculación */}
        <Route path="vinculacion-con-el-medio" element={<VinculacionConElMedio />} />
        <Route path="vinculacion-con-el-medio-detalle/:id" element={<VinculacionDetalle />} />
        <Route path="investigacion/:id" element={<InvestigacionDetalle />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />
      </Route>

        {/* rutas protegidas del panel administrativo */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
          {/* dashboard principal del administrador 
            <Route index element={<AdminDashboard />} />*/}
            {/* gestión de usuarios */}
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="investigaciones" element={<GestionInvestigaciones />} />
            <Route path="cuentas" element={<GestionCuentas />} />
            <Route path="vinculacion" element={<GestionVinculacion />} />
            <Route path="docentes" element={<GestionDocentes />} />
            <Route path="estudiantes" element={<GestionEstudiantes />} />
            <Route path="contacto" element={<GestionContacto />} />
            <Route path="equipamiento" element={<GestionEquipamiento />} />
            <Route path="trazabilidad" element={<Trazabilidad />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}