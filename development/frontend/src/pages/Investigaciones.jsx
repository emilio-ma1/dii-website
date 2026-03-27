import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { usePublicProjects } from "../hooks/usePublicProjects";

const STATUS_LABELS = {
  in_progress: "En ejecución",
  completed: "Terminado",
};

const DEFAULT_PROJECT_IMAGE = "/images/Inve-ejemplo1.png";

/**
 * Calendar icon component used to display the project year.
 */
function CalendarIcon() {
  return (
    <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-13 9h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v11a2 2 0 002 2z" />
    </svg>
  );
}

/**
 * Reusable filter button for project status selection.
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
 * Renders a research project card.
 */
function ResearchCard({ project }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="rounded-md border border-[#722b4d]/20 border-t-4 border-t-[#722b4d] bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full overflow-hidden">
      
      <div className="h-48 w-full shrink-0 bg-gray-100">
        <img
          src={imageError ? DEFAULT_PROJECT_IMAGE : project.imageUrl}
          alt={`Portada de ${project.title}`}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      </div>

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
          <span className="font-medium text-gray-700">{project.researcher}</span>
          <span className="mx-1">—</span>
          <span>{project.role}</span>
        </div>

        <p className="mt-4 text-sm leading-7 text-gray-600 line-clamp-3">
          {project.summary}
        </p>

        <div className="mt-auto pt-5">
          <Link
            to={`/investigacion/${project.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#722b4d] transition hover:gap-3"
          >
            Ver detalle completo →
          </Link>
        </div>
      </div>
    </article>
  );
}

/**
 * Renders the hero section for the research page.
 */
function ResearchHero() {
  return (
    <section className="bg-[#722b4d] text-white">
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-24 lg:pt-32 lg:pb-28">
        <div className="max-w-2xl">
          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Investigación
          </h1>
          <p className="mt-6 text-base leading-8 text-white/90 sm:text-lg">
            El Departamento de Ingeniería Industrial desarrolla proyectos de alto impacto tecnológico y social.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Public Research page.
 */
export default function Investigaciones() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { projects, isLoading } = usePublicProjects();

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projects;
    return projects.filter((project) => project.status === activeFilter);
  }, [activeFilter, projects]);

  return (
    <div className="min-h-screen bg-white">
      <ResearchHero />

      <section
        className="bg-[#f7f5f6] py-20 min-h-[50vh]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(114,43,77,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 max-w-3xl">
            <h2 className="mt-3 text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
              Proyectos vigentes
            </h2>

            <div className="mt-6 flex flex-wrap gap-3">
              <FilterButton active={activeFilter === "all"} onClick={() => setActiveFilter("all")}>
                Todos
              </FilterButton>
              <FilterButton active={activeFilter === "in_progress"} onClick={() => setActiveFilter("in_progress")}>
                En ejecución
              </FilterButton>
              <FilterButton active={activeFilter === "completed"} onClick={() => setActiveFilter("completed")}>
                Terminado
              </FilterButton>
            </div>
          </div>

          {isLoading ? (
            <div className="py-20 text-center font-medium text-gray-500">
              Cargando investigaciones...
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ResearchCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center font-medium text-gray-500">
              No hay proyectos para mostrar en esta categoría.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}