import { useParams, Link } from "react-router-dom";

export default function VinculacionDetalle() {
//obtiene id del proyecto
  const { id } = useParams();

  //datos de prueba
  const proyectos = [
    {
      id: "proyecto-1",
      title: "Proyecto de ...",
      description:
        "Este proyecto busca ...",
      author: "Autor 1 ",
    },
    {
      id: "proyecto-2",
      title: "Proyecto de ...",
      description:
        "Iniciativa orientada a ...",
      author: "Autor 2",
    },
  ];

  //busca el proyecto según el id recibido
  const proyecto = proyectos.find((p) => p.id === id);

  //si no existe proyecto con ese id muestra un mensaje de error
  if (!proyecto) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 pt-12 pb-12">
        <div className="max-w-4xl mx-auto bg-white border shadow p-6">
          <Link to="/vinculacion-con-el-medio" className="text-[#610b2f] font-semibold">
            ← Volver
          </Link>
          <h1 className="text-2xl font-bold mt-4">Proyecto no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 pt-12 pb-12">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 shadow-sm p-8">

        {/* volver */}
        <Link
          to="/vinculacion-con-el-medio"
          className="text-[#610b2f] font-semibold"
        >
          ← Volver
        </Link>

        {/* título */}
        <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">
          {proyecto.title}
        </h1>

        {/* descripción del proyecto */}
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Descripción
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {proyecto.description}
          </p>
        </section>

        {/* autor */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Autor:</span> {proyecto.author}
          </p>
        </div>

      </div>
    </div>
  );
}
