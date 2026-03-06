import { Link } from "react-router-dom";

/**
 * Datos de ejemplo de los proyectos de Vinculación con el Medio.
 */
const PROJECTS = [
  {
    id: "proyecto-1",
    imgSrc: "/images/Ambiente.png",
    title: "Título del Proyecto",
    summary: "Resumen del proyecto",
    author: "Autor",
  },
  {
    id: "proyecto-2",
    imgSrc: "/images/Ambiente.png",
    title: "Título del Proyecto",
    summary: "Resumen del proyecto",
    author: "Autor",
  },
  {
    id: "proyecto-3",
    imgSrc: "/images/Ambiente.png",
    title: "Título del Proyecto",
    summary: "Resumen del proyecto",
    author: "Autor",
  },
  {
    id: "proyecto-4",
    imgSrc: "/images/Ambiente.png",
    title: "Título del Proyecto",
    summary: "Resumen del proyecto",
    author: "Autor",
  },
  {
    id: "proyecto-5",
    imgSrc: "/images/Ambiente.png",
    title: "Título del Proyecto",
    summary: "Resumen del proyecto",
    author: "Autor",
  },
  {
    id: "proyecto-6",
    imgSrc: "/images/Ambiente.png",
    title: "Título del Proyecto",
    summary: "Resumen del proyecto",
    author: "Autor",
  },
];

/**
 * Tarjeta que representa un proyecto de Vinculación con el Medio.
 *
 * @param {string} to - Ruta hacia el detalle del proyecto
 * @param {string} imgSrc - Imagen representativa del proyecto
 * @param {string} title - Título del proyecto
 * @param {string} summary - Breve descripción del proyecto
 * @param {string} author - Autor o responsable del proyecto
 */
function ProjectCard({ to, imgSrc, title, summary, author }) {
  return (
    <Link
      to={to}
      className="group block bg-white border-2 border-[#722b4d] transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl focus-visible:-translate-y-2 focus-visible:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {/* imagen del proyecto */}
      <div className="h-28 sm:h-32 flex items-center justify-center">
        <img src={imgSrc} alt={title} className="h-16 w-16 sm:h-20 sm:w-20 object-contain" />
      </div>

      {/* información del proyecto */}
      <div className="bg-[#722b4d] text-white px-3 py-3 min-h-[92px] relative">
        <h3 className="font-bold text-sm sm:text-base leading-snug">{title}</h3>
        <p className="text-xs sm:text-sm text-white/90 mt-1">{summary}</p>
        {/* autor del proyecto */}
        <span className="absolute bottom-2 right-3 text-[11px] sm:text-xs text-white/90">
          {author}
        </span>
      </div>
    </Link>
  );
}

/**
 * Página de Vinculación con el Medio.
 * Presenta proyectos o iniciativas donde el departamento
 * interactúa con la comunidad o el entorno.
 */

export default function VinculacionConElMedio() {
  return (
    <div className="bg-gray-100 min-h-screen pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* encabezado de la página */}
        <div className="text-center">
          {/* título principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">VINCULACIÓN CON EL MEDIO</h1>
          {/* línea decorativa */}
          <div className="w-24 h-1 bg-[#722b4d] mx-auto rounded-full" />

          {/* descripción del área */}
          <div className="max-w-3xl mx-auto mt-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">Descripción del Área</h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed">Esto es ...</p>
          </div>
        </div>

        {/* listado de proyectos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              to={`/vinculacion-con-el-medio-detalle/${project.id}`}
              imgSrc={project.imgSrc}
              title={project.title}
              summary={project.summary}
              author={project.author}
            />
          ))}
        </div>
      </div>
    </div>
  );
}