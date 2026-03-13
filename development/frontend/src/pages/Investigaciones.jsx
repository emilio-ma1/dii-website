import { Link } from "react-router-dom";

/**
 * Lista de proyectos de investigación
 */
const RESEARCH_PROJECTS = [
  {
    id: "ejemplo-1",
    category: "categoria",
    year: "2025",
    title:"Ejemplo 1",
    researcher: "nombre investigador",
    role: "rol",
    Cardsummary:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "ejemplo-2",
    category: "categoria",
    year: "2025",
    title:"Ejemplo 2",
    researcher: "nombre investigador",
    role: "rol",
    Cardsummary:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "ejemplo-3",
    category: "categoria",
    year: "2024",
    title:"Ejemplo 3",
    researcher: "nombre investigador",
    role: "rol",
    Cardsummary:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];

/**
 * Renderiza el ícono de calendario utilizado para mostrar el año del proyecto.
 *
 * @returns {JSX.Element} El ícono de calendario renderizado.
 */
function CalendarIcon() {
  return (
    <svg
      className="h-4 w-4 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z"
      />
    </svg>
  );
}
/**
 * Renderiza una tarjeta con la información resumida de un proyecto de investigación.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.project - Información del proyecto.
 * @param {string} props.project.id - Identificador único del proyecto.
 * @param {string} props.project.category - Categoría del proyecto.
 * @param {string} props.project.year - Año asociado al proyecto.
 * @param {string} props.project.title - Título del proyecto.
 * @param {string} props.project.researcher - Nombre del investigador responsable.
 * @param {string} props.project.role - Rol del investigador en el proyecto.
 * @param {string} props.project.cardSummary - Resumen breve del proyecto para la tarjeta.
 * @returns {JSX.Element} La tarjeta del proyecto renderizada.
 */
function ResearchCard({ project }) {
  return (
    <article className="rounded-md border border-[#722b4d]/20 border-t-4 border-t-[#722b4d] bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="px-5 py-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded bg-[#722b4d]/10 px-3 py-1 text-xs font-semibold text-[#722b4d]">
            {project.category}
          </span>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <CalendarIcon />
            <span>{project.year}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold leading-snug text-[#722b4d]">
          {project.title}
        </h3>

        <div className="mt-3 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{project.researcher}</span>
          <span className="mx-1">—</span>
          <span>{project.role}</span>
        </div>

        <p className="mt-4 text-sm leading-7 text-gray-600">
          {project.Cardsummary}
        </p>

        <div className="mt-5">
          <Link
            to={`/investigacion/${project.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#722b4d] transition hover:gap-3"
          >
            Ver detalle →
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Renderiza el hero principal de la página de investigaciones.
 *
 * @returns {JSX.Element} La sección superior de investigaciones renderizada.
 */
function ResearchHero() {
  return (
    <section className="bg-[#722b4d] text-white">
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-24 lg:pt-32 lg:pb-28">
        <div className="max-w-2xl">
          <span className="inline-block rounded bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
            Área de Investigación
          </span>

          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Investigaciones
          </h1>

          <p className="mt-6 text-base leading-8 text-white/90 sm:text-lg">
            El Departamento de Ingeniería Industrial desarrolla...
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Renderiza la página principal de investigaciones del departamento.
 *
 * Responsabilidades:
 * - Mostrar el encabezado principal de la sección.
 * - Presentar la lista de proyectos de investigación disponibles.
 * - Permitir la navegación al detalle de cada proyecto.
 *
 * @returns {JSX.Element} La página de investigaciones renderizada.
 */
export default function Investigaciones() {
  return (
    <div className="min-h-screen bg-white">
      <ResearchHero />

      <section
        className="bg-[#f7f5f6] py-20"
        style={{
          backgroundImage:"radial-gradient(circle at 1px 1px, rgba(114,43,77,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#722b4d]/80">
              Proyectos
            </p>

            <h2 className="mt-3 text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
              Proyectos de Investigación
            </h2>

            <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
              Investigaciones en curso y finalizadas desarrolladas por los
              académicos del departamento.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
            {RESEARCH_PROJECTS.map((project) => (
              <ResearchCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}