/**
 * Tarjeta que representa a un docente del departamento.
 * Muestra su foto, nombre, carreras donde participa,
 * asignaturas que imparte y correo institucional.
 *
 * @param {Object} teacher - Información del docente
 */
function TeacherCard({ teacher }) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white border border-black/10 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* imagen del docente */}
      <div className="bg-white h-52 flex items-center justify-center p-4">
        <img
          src={teacher.imageUrl}
          alt={`Foto de ${teacher.fullName}`}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>

      {/* información del docente */}
      <div className="bg-[#722b4d] text-white p-5 min-h-[180px] flex flex-col">
        {/* nombre del docente */}
        <h3 className="text-lg font-bold mb-3">{teacher.fullName}</h3>

        <div className="space-y-2 text-sm text-white/90">
        {/* carreras donde trabaja */}
          <p>
            <span className="font-semibold text-white">Carreras donde trabaja:</span>{" "}
            {teacher.programs}
          </p>
          {/* asignaturas que imparte */}
          <p>
            <span className="font-semibold text-white">Asignaturas que imparte:</span>{" "}
            {teacher.subjects}
          </p>
          {/* correo institucional */}
          <p>
            <span className="font-semibold text-white">Correo institucional:</span>{" "}
            {teacher.email}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Página que muestra el listado de docentes
 * pertenecientes al Departamento de Ingeniería Industrial.
 */
export default function Docentes() {
  /**
   * Lista de docentes (datos de prueba).
   * Cada objeto representa un profesor del departamento.
   */
  const teachers = [
    {
      id: 1,
      fullName: "Docente 1",
      programs: "Ingeniería Civil Industrial",
      subjects: "Asignatura 1, Asignatura 2",
      email: "nombre@userena.cl",
      imageUrl: "/images/foto-docente.png",
    },
    {
      id: 2,
      fullName: "Docente 2",
      programs: "Ingeniería Civil en Computación e Informática",
      subjects: "Asignatura 1, Asignatura 2",
      email: "nombre@userena.cl",
      imageUrl: "/images/foto-docente.png",
    },
    {
      id: 3,
      fullName: "Docente 3",
      programs: "Ingeniería Civil Industrial",
      subjects: "Asignatura 1, Asignatura 2",
      email: "nombre@userena.cl",
      imageUrl: "/images/foto-docente.png",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen pt-12 pb-12 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* título de la página */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">DOCENTES</h1>
          {/* línea decorativa */}
          <div className="w-24 h-1 bg-[#722b4d] mx-auto rounded-full" />
        </div>

        {/* grid de docentes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* renderizado dinámico de tarjetas */}
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </div>
    </div>
  );
}