/**
 * Página "Quiénes Somos" del Departamento de Ingeniería Industrial.
 * Presenta información general del departamento, su descripción
 * y algunas de las actividades que realiza.
 */
export default function QuienesSomos() {
  return (
    <div className="bg-gray-100 min-h-screen pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* sección principal */}
        <div className="text-center space-y-6">
          {/* título principal */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            QUIENES SOMOS
          </h1>

          {/* línea decorativa */}
          <div className="w-24 h-1 bg-[#722b4d] mx-auto rounded-full" />

          {/* descripción del departamento */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Departamento de Ingeniería Industrial
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed">
              Descripción detallada del departamento y sus funciones.
            </p>
          </div>

          {/* imagen representativa del departamento */}
          <div className="w-full overflow-hidden rounded-sm">
            <img
              src="/images/quienes-somos.jpg"
              alt="Imagen representativa del Departamento de Ingeniería Industrial"
              className="w-full h-[220px] sm:h-[300px] md:h-[360px] object-cover"
            />
          </div>

          {/* listado de actividades */}
          <div className="max-w-4xl mx-auto mt-10 text-left">
            <p className="text-lg md:text-xl font-semibold text-gray-700 mb-4">
              Listado y/o ejemplos de actividades en el departamento
            </p>

            {/* lista de actividades */}
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-2 w-2 h-2 rounded-full bg-[#722b4d] flex-shrink-0" />
                <p className="text-gray-600 text-base md:text-lg">Ejemplo 1</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-2 w-2 h-2 rounded-full bg-[#722b4d] flex-shrink-0" />
                <p className="text-gray-600 text-base md:text-lg">Ejemplo 2</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}