export default function Docentes() {
  const docentes = [
    {
      id: 1,
      nombre: "Docente 1",
      carreras: "Ingeniería Civil Industrial",
      asignaturas: "Asignatura 1, Asignatura 2",
      correo: "nombre@userena.cl",
      imagen: "/images/foto-docente.png",
    },
    {
      id: 2,
      nombre: "Docente 2",
      carreras: "Ingeniería Civil en Computación e Informática",
      asignaturas: "Asignatura 1, Asignatura 2",
      correo: "nombre@userena.cl",
      imagen: "/images/foto-docente.png",
    },
    {
      id: 3,
      nombre: "Docente 3",
      carreras: "Ingeniería Civil Industrial",
      asignaturas: "Asignatura 1, Asignatura 2",
      correo: "nombre@userena.cl",
      imagen: "/images/foto-docente.png",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* título */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
            DOCENTES
          </h1>
          <div className="w-24 h-1 bg-[#610b2f] mx-auto rounded-full"></div>
        </div>

        {/* grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docentes.map((d) => (
            <div
              key={d.id}
              className="group overflow-hidden rounded-2xl bg-white border border-black/10 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* imagen */}
              <div className="bg-white h-52 flex items-center justify-center p-4">
                <img
                  src={d.imagen}
                  alt={`Foto de ${d.nombre}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* información del docente */}
              <div className="bg-[#610b2f] text-white p-5 min-h-[180px] flex flex-col">
                <h3 className="text-lg font-bold mb-3">{d.nombre}</h3>

                <div className="space-y-2 text-sm text-white/90">
                  <p>
                    <span className="font-semibold text-white">
                      Carreras donde trabaja:
                    </span>{" "}
                    {d.carreras}
                  </p>

                  <p>
                    <span className="font-semibold text-white">
                      Asignaturas que imparte:
                    </span>{" "}
                    {d.asignaturas}
                  </p>

                  <p>
                    <span className="font-semibold text-white">
                      Correo institucional:
                    </span>{" "}
                    {d.correo}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
