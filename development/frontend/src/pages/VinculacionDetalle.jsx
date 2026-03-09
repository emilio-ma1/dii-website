import { Link, useParams } from "react-router-dom";

/**
 * Datos de ejemplo de proyectos.
 */
const PROJECTS = [
  {
    id: "proyecto-1",
    title: "Proyecto de ...",
    description: "Este proyecto busca ...",
    author: "Autor 1",
  },
  {
    id: "proyecto-2",
    title: "Proyecto de ...",
    description: "Iniciativa orientada a ...",
    author: "Autor 2",
  },
];

/**
 * Renderiza un mensaje cuando el proyecto solicitado
 * no existe dentro del listado de proyectos.
 *
 * @returns {JSX.Element} Vista de proyecto no encontrado.
 */
function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-12 pb-12">
      <div className="max-w-4xl mx-auto bg-white border shadow p-6">
        <Link to="/vinculacion-con-el-medio" className="text-[#722b4d] font-semibold">
          ← Volver
        </Link>
        <h1 className="text-2xl font-bold mt-4">Proyecto no encontrado</h1>
      </div>
    </div>
  );
}

/**
 * Renderiza la página de detalle de un proyecto
 * de Vinculación con el Medio.
 *
 * Obtiene el identificador del proyecto desde la URL
 * y muestra su información correspondiente.
 *
 * @returns {JSX.Element} Página de detalle del proyecto
 * o una vista de error si el proyecto no existe.
 */
export default function VinculacionDetalle() {
  // obtiene el id del proyecto desde los parámetros de la ruta
  const { id } = useParams();

  /**
   * busca el proyecto correspondiente según el id recibido
   */
  const project = PROJECTS.find((projectItem) => projectItem.id === id);

  /**
   * si no se encuentra el proyecto, se muestra el componente de error
   */
  if (!project) {
    return <ProjectNotFound />;
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-12 pb-12">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm p-8">
        <Link to="/vinculacion-con-el-medio" className="text-[#722b4d] font-semibold">
          ← Volver
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">{project.title}</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Descripción</h2>
          <p className="text-gray-600 leading-relaxed">{project.description}</p>
        </section>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Autor:</span> {project.author}
          </p>
        </div>
      </div>
    </div>
  );
}