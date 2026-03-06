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
 * Componente mostrado cuando el proyecto solicitado no existe.
 */
function ProjectNotFound() {
  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-12 pb-12">
      <div className="max-w-4xl mx-auto bg-white border shadow p-6">
        {/* enlace para volver a la lista de proyectos */}
        <Link to="/vinculacion-con-el-medio" className="text-[#722b4d] font-semibold">
          ← Volver
        </Link>
        {/* mensaje de error */}
        <h1 className="text-2xl font-bold mt-4">Proyecto no encontrado</h1>
      </div>
    </div>
  );
}

/**
 * Página de detalle de un proyecto de Vinculación con el Medio.
 * Obtiene el id del proyecto desde la URL y muestra su información.
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
        {/* botón para volver a la lista de proyectos */}
        <Link to="/vinculacion-con-el-medio" className="text-[#722b4d] font-semibold">
          ← Volver
        </Link>

        {/* título del proyecto */}
        <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">{project.title}</h1>

        {/* sección de descripción */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Descripción</h2>
          <p className="text-gray-600 leading-relaxed">{project.description}</p>
        </section>

        {/* información del autor */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Autor:</span> {project.author}
          </p>
        </div>
      </div>
    </div>
  );
}