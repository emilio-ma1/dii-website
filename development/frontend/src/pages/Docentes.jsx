export default function Docentes() {
  return (
    <div className="bg-gray-100 min-h-screen pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* titulo */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            DOCENTES
          </h1>
          <div className="w-24 h-1 bg-[#610b2f] mx-auto rounded-full">
          </div>
        </div>
        {/* primera tarjeta */}
        <div className="bg-[#6b133b] text-white rounded-none shadow-md px-6 py-6 flex gap-6 items-center">
          {/* foto del docente */}
          <div className="bg-white flex items-center justify-center w-28 h-28">
            <img
            src="/images/foto-docente.png"
            alt="Foto Docente"
            className="h-[115px] w-auto object-contain flex-shrink-0"/>
          </div>
          {/* información docente */}
          <div className="space-y-2 text-sm sm:text-base">
            <p><span className ="font-semibold">Nombre:</span></p>
            <p><span className ="font-semibold">Carreras donde trabaja:</span></p>
            <p><span className ="font-semibold">Asignaturas que imparte:</span></p>
            <p><span className ="font-semibold">Correo institucional:</span></p>
          </div>
        </div>
        {/* segunda tarjeta */}
        <div className="bg-[#6b133b] text-white rounded-none shadow-md px-6 py-6 flex gap-6 items-center">
          {/* foto del docente */}
          <div className="bg-white flex items-center justify-center w-28 h-28">
            <img
            src="/images/foto-docente.png"
            alt="Foto Docente"
            className="h-[115px] w-auto object-contain flex-shrink-0"/>
          </div>
          {/* información docente */}
          <div className="space-y-2 text-sm sm:text-base">
            <p><span className ="font-semibold">Nombre:</span></p>
            <p><span className ="font-semibold">Carreras donde trabaja:</span></p>
            <p><span className ="font-semibold">Asignaturas que imparte:</span></p>
            <p><span className ="font-semibold">Correo institucional:</span></p>
          </div>
        </div>
        {/* tercera tarjeta */}
        <div className="bg-[#6b133b] text-white rounded-none shadow-md px-6 py-6 flex gap-6 items-center">
          {/* foto del docente */}
          <div className="bg-white flex items-center justify-center w-28 h-28">
            <img
            src="/images/foto-docente.png"
            alt="Foto Docente"
            className="h-[115px] w-auto object-contain flex-shrink-0"/>
          </div>
          {/* información docente */}
          <div className="space-y-2 text-sm sm:text-base">
            <p><span className ="font-semibold">Nombre:</span></p>
            <p><span className ="font-semibold">Carreras donde trabaja:</span></p>
            <p><span className ="font-semibold">Asignaturas que imparte:</span></p>
            <p><span className ="font-semibold">Correo institucional:</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}