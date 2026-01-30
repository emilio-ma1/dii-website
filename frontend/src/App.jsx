import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

import ProtectedRoute from "./auth/ProtectedRoute.jsx";

import Navbar from "./components/navbar.jsx";
import Footer from "./components/footer.jsx";

import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminUsuarios from "./admin/AdminUsuarios.jsx";

import Home from "./pages/home.jsx";
import Academico from "./pages/Academico.jsx";
import Contacto from "./pages/Contacto.jsx";
import Investigaciones from "./pages/Investigaciones.jsx";
import QuienesSomos from "./pages/QuienesSomos.jsx";
import Noticias from "./pages/Noticias.js";
import Estudiantes from "./pages/Estudiantes.jsx";
import Docentes from "./pages/Docentes.jsx";
import Industrial from "./pages/Industrial.jsx";
import Computacion from "./pages/Computacion.jsx";
import Login from "./pages/Login.jsx";
import VinculacionconelMedio from "./pages/VinculacionconelMedio.jsx";
import VinculacionDetalle from "./pages/Vinculaciondetalle.jsx";
function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12">
        <Outlet /> {/* renderiza la pagina */}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="quienes-somos" element={<QuienesSomos />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="academico" element={<Academico />} />
        <Route path="investigaciones" element={<Investigaciones />} />
        <Route path="noticias" element={<Noticias />} />
        <Route path="estudiantes" element={<Estudiantes />} />
        <Route path="docentes" element={<Docentes />} />
        <Route path="industrial" element={<Industrial />} />
        <Route path="computacion" element={<Computacion />} />
        <Route path="login" element={<Login />} />
        <Route path="vinculacion-con-el-medio" element={<VinculacionconelMedio />} />
        <Route path="vinculacion-con-el-medio-detalle/:id" element={<VinculacionDetalle />} />
      </Route>

      {/* rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="adminusuarios" element={<AdminUsuarios />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

