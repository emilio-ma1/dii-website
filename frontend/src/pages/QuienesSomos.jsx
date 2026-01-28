export default function QuienesSomos() {
  return (
    <div className="bg-gray-100 min-h-screen pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* titulo */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            QUIENES SOMOS
          </h1>
          <div className="w-24 h-1 bg-[#610b2f] mx-auto rounded-full"></div>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Departamento de Ingeniería Industrial
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed">
              Descripción detallada del departamento y sus funciones.
            </p>
          </div>
          {/* imagen */}
          <div className="w-full overflow-hidden rounded-sm">
            <img
            src="/images/quienes-somos.jpg"
            alt="Quienes somos"
            className="w-full h-[220px] sm:h-[300px] md:h-[360px] object-cover"/>
          </div>
          {/* texto para abajo de la imagen */}
          <div className="max-w-4xl mx-auto mt-10 text-left">
            <p className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
              Listado y/o ejemplos de actividades en el departamento
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-2 w-2 h-2 rounded-full bg-[#610b2f] flex-shrink-0"></span>
                <p className="text-gray-600 text-base md:text-lg">
                  Ejemplo 1
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-2 h-2 rounded-full bg-[#610b2f] flex-shrink-0"></span>
                <p className="text-gray-600 text-base md:text-lg">
                  Ejemplo 2
                </p>
              </li>
              {/* aqui puedo continuar con la lista */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}