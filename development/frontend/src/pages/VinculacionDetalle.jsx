import { Link, useParams } from "react-router-dom";


/**
 * Página de detalle de un proyecto de Vinculación con el Medio.
 *
 * Obtiene el identificador del proyecto desde la URL y muestra
 * la información completa del proyecto seleccionado.
 * Si el proyecto no existe, renderiza una vista de error
 * con enlace de retorno a la sección principal.
 *
 * @returns {JSX.Element} La vista de detalle del proyecto o una vista de error.
 */
export default function VinculacionDetalle() {
  const { id } = useParams();

  /**
   * Datos de ejemplo, sin imagen
   */
  const fallbackProjects = {
    "ejemplo-1": {
      id: "ejemplo-1",
      category: "categoria",
      year: "2025",
      title: " Ejemplo 1",
      author: "autor",
      role: "rol",
      summary:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/images/",
    },
    "ejemplo-2": {
      id: "ejemplo-2",
      category: "categoria",
      year: "2025",
      title: "Ejemplo 2",
      author: "autor",
      role: "rol",
      summary:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
      description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.\n\nExcepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      image: "/images/",
    },
  };

  /**
   * Busca el proyecto correspondiente al identificador recibido en la ruta.
   */
  const project = fallbackProjects[id];

  /**
   * Si no existe un proyecto asociado al identificador,
   * se muestra una vista informativa de contenido no encontrado.
   */
  if (!project) {
    return (
      <div className="min-h-screen bg-[#f7f5f6] px-6 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-2xl border border-[#722b4d]/10 bg-white p-8 shadow-sm sm:p-10">
            <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
              Proyecto no encontrado
            </h1>

            <p className="mt-2 text-base leading-8 text-gray-600">
              Puede que el proyecto ya no esté disponible o que el enlace sea incorrecto.
            </p>

            <div className="mt-8">
              <Link
                to="/vinculacion-con-el-medio"
                className="inline-flex items-center gap-2 rounded-lg bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5e2340]"
              >
                ← Volver a vinculación con el medio
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
            to="/vinculacion-con-el-medio"
            className="inline-flex items-center gap-2 text-sm text-white/90 transition hover:text-white"
          >
            ← Volver a Vinculación con el Medio
          </Link>

          <div className="mt-8 max-w-4xl">
            <span className="inline-block rounded bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
              {project.category}
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/85 sm:text-base">
              <div>
                {project.author} — {project.role}
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