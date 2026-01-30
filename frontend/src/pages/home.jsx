import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Noticias from "./NoticiasHome.jsx";

function TriangleCard({ to, imgSrc, alt, title, desc, className = "" }) {
  return (
    <Link to={to} className={`group block ${className}`}>
      <div className="relative transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
        {/* svg para la forma */}
        <svg viewBox="0 0 100 120" className="w-full h-auto block" aria-hidden="true" >
          {/* borde del triángulo */}
          <polygon points="50,0 0,60 100,60" fill="#610b2f" />
          {/* triángulo blanco */}
          <polygon points="50,5 6,57 94,57" fill="#ffffff" />
          {/* imagen */}
          <image
            href={imgSrc}
            x="30"
            y="16"
            width="40"
            height="32"
            preserveAspectRatio="xMidYMid meet" />
          {/* "paralelogramo" */}
          <polygon points="0,60 100,60 92,120 8,120" fill="#610b2f" />
        </svg>
        {/* texto */}
        <div className="absolute inset-x-0 bottom-6 px-6 pb-6 text-center text-white pointer-events-none">
          <h3 className="text-lg sm:text-xl font-bold mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-white/90 leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
    //para mostrar u ocultar el botón de volver arriba
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white px-4 sm:px-6 py-2 pt-16">
      <div className="max-w-6xl mx-auto text-center">

        {/* titulo */}
        <h1 className="font-bold text-gray-900 leading-tight mb-4 text-2xl sm:text-3xl md:text-4xl break-words">
          DEPARTAMENTO DE INGENIERÍA INDUSTRIAL
        </h1>

        {/* descripción */}
        <div className="max-w-3xl mx-auto space-y-3 mb-12">
          <p className="font-light text-gray-600 text-base sm:text-lg">
            Somos el departamento académico del Departamento de Ingeniería
            Industrial de la Universidad de La Serena, comprometidos con...
          </p>
          <p className="text-gray-500 text-sm sm:text-base">
            Descripción del departamento. Líneas de investigación principales y
            objetivos institucionales.
          </p>
        </div>

        {/* tarjetas */}
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {/* tarjeta investigación */}
            <div className="md:translate-y-10">
              <TriangleCard
                to="/investigaciones"
                imgSrc="/images/investigacion.png"
                alt="Investigaciones"
                title="Investigaciones"
                desc="Resumen del área de investigación, líneas principales, proyectos y publicaciones." />
            </div>
            {/* tarjeta academico */}
            <div className="md:-translate-y-6">
              <TriangleCard
                to="/academico"
                imgSrc="/images/Academico.png"
                alt="Académico / Docencia"
                title="Académico / Docencia"
                desc="Resumen del área académica, formación integral y programas de estudio." />
            </div>
            {/* tarjeta vinculación con el medio */}
            <div className="md:translate-y-10">
              <TriangleCard
                to="/vinculacion-con-el-medio"
                imgSrc="/images/Ambiente.png"
                alt="Vinculación con el Medio"
                title="Vinculación con el Medio"
                desc="Relación con el entorno, extensión universitaria y actividades con la comunidad." />
            </div>
          </div>
        </div>
      </div>
      {/* noticias */}
      <div className="mt-16">
        <Noticias />
      </div>

      {/* botón para volver arriba */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#610b2fde] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 ${ showScrollTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none" }`} aria-label="Volver arriba">
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}
