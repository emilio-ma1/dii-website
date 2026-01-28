import { Link } from "react-router-dom";

export default function Academico() {
  return (
    <div className="bg-gray-100 min-h-screen pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* titulo */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            ACADÉMICO
          </h1>
          <div className="w-24 h-1 bg-[#610b2f] mx-auto rounded-full"></div>
          <div className="max-w-3xl mx-auto">
            {/* descripción académico */}
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Descripción del Área
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed">
              El Departamento de Ingeniería Civil Industrial ofrece formación integral...
            </p>
          </div>
        </div>

        {/* tarjetas */}
        <div className="space-y-16 max-w-7xl mx-auto">
          {/* tarjeta de civil industrial */}
          <div className="space-y-6">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#610b2f] text-center drop-shadow-lg leading-tight">
              Ingeniería Civil Industrial
            </h2>

            <Link to="/industrial" className="block">
              <div className="group cursor-pointer relative bg-gradient-to-br from-[#6b133b] to-[#610b2f] rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border-4 border-white/20 h-auto md:h-[22rem] lg:h-[26rem]">
                <div className="flex flex-col md:flex-row items-center h-full gap-6 md:gap-8">
                  {/* logo civil industrual */}
                  <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 bg-white/95 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/80 p-4 lg:p-6 group-hover:scale-105 transition-all shrink-0">
                    <img
                      src="/images/civil-industrial.jpg"
                      alt="Civil Industrial"
                      className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain"
                    />
                  </div>

                  {/* descripción civil industrial */}
                  <div className="flex-1 w-full md:w-auto bg-white/90 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-xl border border-white/60 md:h-full flex flex-col justify-center">
                    <h3 className="text-xl lg:text-2xl font-semibold text-[#610b2f] mb-3 text-center md:text-left">
                      Resumen Carrera
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm lg:text-base text-center md:text-left">
                      Descripción del área académica de Ingeniería Civil Industrial en el
                      Departamento.
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* tarjeta civil en computación */}
          <div className="space-y-6">
            <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-[#610b2f] text-center drop-shadow-lg leading-tight">
              Ingeniería Civil en Computación e Informática
            </h2>

            <Link to="/computacion" className="block">
              <div className="group cursor-pointer relative bg-gradient-to-br from-[#6b133b] to-[#610b2f] rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border-4 border-white/20 h-auto md:h-[22rem] lg:h-[26rem]">
                <div className="flex flex-col md:flex-row items-center h-full gap-6 md:gap-8">
                  {/* logo civil en computación */}
                  <div className="w-40 h-40 sm:w-48 sm:h-48 lg:w-56 lg:h-56 bg-white/95 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/80 p-4 lg:p-6 group-hover:scale-105 transition-all shrink-0">
                    <img
                      src="/images/civil-computacion.png"
                      alt="Civil Computación"
                      className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain"
                    />
                  </div>

                  {/* descripción civil en computación */}
                  <div className="flex-1 w-full md:w-auto bg-white/90 backdrop-blur-md rounded-2xl p-6 lg:p-8 shadow-xl border border-white/60 md:h-full flex flex-col justify-center">
                    <h3 className="text-xl lg:text-2xl font-semibold text-[#610b2f] mb-3 text-center md:text-left">
                      Resumen Carrera
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm lg:text-base text-center md:text-left">
                      Descripción del área académica de Ingeniería Civil en Computación e
                      Informática.
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
