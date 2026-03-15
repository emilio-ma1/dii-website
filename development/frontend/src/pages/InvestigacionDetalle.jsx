import { Link, useParams } from "react-router-dom";

const STATUS_LABELS = {
  in_progress: "En proceso",
  completed: "Completado",
};

/**
 * Página de detalle de un proyecto de investigación.
 *
 * Obtiene el identificador del proyecto desde la URL y
 * muestra la información completa del proyecto seleccionado.
 * Si el proyecto no existe, renderiza una vista de error
 * con enlace de retorno a la sección de investigaciones.
 *
 * @returns {JSX.Element} La vista de detalle del proyecto o una vista de error.
 */
export default function InvestigacionDetalle() {
  const { id } = useParams();

  /**
   * Datos de ejemplo
   */
  const fallbackProjects = {
    "ejemplo-1": {
      id: "ejemplo-1",
      status: "in_progress",
      topic: "Tema",
      year: "2025",
      title: "Ejemplo 1",
      researcher: "nombre investigador",
      role: "rol",
      summary:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      image: "/images/Inve-ejemplo1.png",
    },
    "ejemplo-2": {
      id: "ejemplo-2",
      status: "completed",
      topic: "Tema",
      year: "2025",
      title: "Ejemplo 2",
      researcher: "nombre investigador",
      role: "rol",
      summary:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      image: "/images/Inve-ejemplo2.jpg",
    },
    "ejemplo-3": {
      id: "ejemplo-3",
      status: "completed",
      topic: "Tema",
      year: "2024",
      title: "Ejemplo 3",
      researcher: "nombre investigador",
      role: "rol",
      summary:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\n\nUt enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
      image: "/images/Inve-ejemplo2.jpg",
    },
  };

  const project = fallbackProjects[id];

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f7f5f6] px-6 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-2xl border border-[#722b4d]/10 bg-white p-8 shadow-sm sm:p-10">
            <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
              Investigación no encontrada
            </h1>

            <p className="mt-2 text-base leading-8 text-gray-600">
              Puede que el proyecto ya no esté disponible o que el enlace sea
              incorrecto.
            </p>

            <div className="mt-8">
              <Link
                to="/investigaciones"
                className="inline-flex items-center gap-2 rounded-lg bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5e2340]"
              >
                ← Volver a investigaciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f6]">
      <section className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-[#722b4d]/80" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-28 sm:px-8 lg:px-10 lg:pb-24 lg:pt-32">
          <Link
            to="/investigaciones"
            className="inline-flex items-center gap-2 text-sm text-white/90 transition hover:text-white"
          >
            ← Volver a Investigaciones
          </Link>

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap gap-2">
              <span className="inline-block rounded bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
                {STATUS_LABELS[project.status]}
              </span>

              <span className="inline-block rounded border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
                {project.topic}
              </span>
            </div>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/85 sm:text-base">
              <div>
                {project.researcher} — {project.role}
              </div>

              <div>{project.year}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5f6] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-10">
          <div className="rounded-md border border-black/5 bg-[#f4eff1] p-5 shadow-sm sm:p-6">
            <div className="border-l-4 border-[#722b4d] pl-5">
              <p className="text-base italic leading-8 text-gray-700 sm:text-lg">
                {project.summary}
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8">
            <h2 className="text-2xl font-bold text-[#722b4d]">
              Descripción del Proyecto
            </h2>

            <div className="mt-6 space-y-5 text-base leading-8 text-gray-700">
              {(project.description || "")
                .trim()
                .split("\n\n")
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index}>{paragraph.trim()}</p>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}