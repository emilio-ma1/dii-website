import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { usePublicEvents } from "../hooks/usePublicEvents";

const STATUS_LABELS = {
  current: "Vigente",
  not_current: "No Vigente",
};

/**
 * Calendar icon used to display the project year.
 *
 * @returns {JSX.Element} Rendered calendar icon.
 */
function CalendarIcon() {
  return (
    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z" />
    </svg>
  );
}

/**
 * Filter button component.
 *
 * @param {Object} props
 * @param {boolean} props.active - Indicates if the filter is active.
 * @param {React.ReactNode} props.children - Button label.
 * @param {Function} props.onClick - Click handler.
 * @returns {JSX.Element} Rendered filter button.
 */
function FilterButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-5 py-2.5 text-sm font-medium transition ${
        active
          ? "border-[#722b4d] bg-[#722b4d] text-white shadow-md"
          : "border-[#722b4d]/20 bg-white text-[#722b4d] hover:border-[#722b4d] hover:bg-[#722b4d]/5"
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Project/Event card component.
 *
 * Displays basic information about a project and provides
 * navigation to its detail page.
 *
 * @param {Object} props
 * @param {Object} props.project - Project data.
 * @returns {JSX.Element} Rendered project card.
 */
function ProjectCard({ project }) {
  return (
    <article className="rounded-md border border-[#722b4d]/20 border-t-4 border-t-[#722b4d] bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full">
      <div className="px-5 py-5 flex flex-col flex-grow">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="rounded bg-[#722b4d] px-3 py-1 text-xs font-semibold text-white">
              {STATUS_LABELS[project.status] || "Registrado"}
            </span>
            <span className="rounded border border-[#722b4d]/20 bg-[#722b4d]/10 px-3 py-1 text-xs font-semibold text-[#722b4d]">
              {project.topic}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-500 shrink-0">
            <CalendarIcon />
            <span>{project.year}</span>
          </div>
        </div>

        <h3 className="text-xl font-bold leading-snug text-[#722b4d]">
          {project.title}
        </h3>

        <div className="mt-3 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{project.author}</span>
          <span className="mx-1">—</span>
          <span>{project.role}</span>
        </div>

        {/* Text truncated to 3 lines */}
        <p className="mt-4 text-sm leading-7 text-gray-600 line-clamp-3">
          {project.summary}
        </p>

        {/* Push link to bottom */}
        <div className="mt-auto pt-5">
          <Link
            to={`/vinculacion-con-el-medio-detalle/${project.slug}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#722b4d] transition hover:gap-3"
          >
            Ver detalle
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Hero section for the "Vinculación con el Medio" page.
 *
 * @returns {JSX.Element} Rendered hero section.
 */
function VinculacionHero() {
  return (
    <section className="bg-[#722b4d] text-white">
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-24 lg:pt-32 lg:pb-28">
        <div className="max-w-2xl">
          <span className="inline-block rounded bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
            Área de Vinculación
          </span>
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Vinculación con el Medio
          </h1>
          <p className="mt-6 text-base leading-8 text-white/90 sm:text-lg">
            El Departamento de Ingeniería Industrial mantiene una estrecha relación con el entorno social y productivo...
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Main page for "Vinculación con el Medio".
 *
 * Responsibilities:
 * - Fetch and display public events/projects.
 * - Allow filtering by status.
 * - Render project cards.
 *
 * @returns {JSX.Element} Rendered page.
 */
export default function VinculacionConElMedio() {
  const [activeFilter, setActiveFilter] = useState("all");
  
  const { events, isLoading } = usePublicEvents();

  /**
   * Filters projects based on selected status.
   */
  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return events;
    return events.filter((project) => project.status === activeFilter);
  }, [activeFilter, events]);

  return (
    <div className="min-h-screen bg-white">
      <VinculacionHero />

      <section
        className="bg-[#f7f5f6] py-20 min-h-[50vh]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(114,43,77,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#722b4d]/80">
              Proyectos
            </p>
            <h2 className="mt-3 text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
              Proyectos de Vinculación
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              <FilterButton active={activeFilter === "all"} onClick={() => setActiveFilter("all")}>
                Todos
              </FilterButton>
              <FilterButton active={activeFilter === "current"} onClick={() => setActiveFilter("current")}>
                Vigente
              </FilterButton>
              <FilterButton active={activeFilter === "not_current"} onClick={() => setActiveFilter("not_current")}>
                No vigente
              </FilterButton>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center font-medium text-gray-500">
              Cargando eventos de vinculación...
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3 mt-10">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center font-medium text-gray-500">
              No se encontraron proyectos con el filtro seleccionado.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}