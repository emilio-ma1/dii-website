/**
 * Renderiza una tarjeta con la información principal de un docente.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.teacher - Información del docente a mostrar.
 * @param {string} props.teacher.fullName - Nombre completo del docente.
 * @param {string} props.teacher.role - Cargo o rol del docente.
 * @param {string} props.teacher.area - Área académica o de especialidad.
 * @param {string} props.teacher.email - Correo electrónico del docente.
 * @param {string} props.teacher.imageUrl - Ruta de la imagen del docente.
 * @returns {JSX.Element} La tarjeta del docente renderizada.
 */
function TeacherCard({ teacher }) {
  return (
    <div className="bg-white rounded-xl border border-black/10 shadow-md p-6 text-center transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="flex justify-center mb-4">
        <img
          src={teacher.imageUrl}
          alt={`Foto de ${teacher.fullName}`}
          className="w-24 h-24 object-cover rounded-md"
          loading="lazy"
        />
      </div>

      <h3 className="text-[#722b4d] font-semibold text-lg">
        {teacher.fullName}
      </h3>

      <p className="text-[#1f78c1] text-sm mb-3">
        {teacher.role}
      </p>

      <p className="text-gray-500 text-sm">
        {teacher.area}
      </p>

      <p className="text-gray-400 text-sm mt-1">
        {teacher.email}
      </p>
    </div>
  );
}

/**
 * Renderiza la página de docentes del departamento.
 *
 * Esta vista muestra un encabezado principal y una grilla de tarjetas
 * con la información básica de cada docente.
 *
 * @returns {JSX.Element} La página de docentes renderizada.
 */
export default function Docentes() {

  /**
   * Lista de docentes mostrados en la página.
   */
  const teachers = [
    {
      id: 1,
      fullName: "Ejemplo 1",
      role: "Profesor",
      area: "Investigación de operaciones",
      email: "@userena.cl",
      imageUrl: "/images/foto-docente.png",
    },
    {
      id: 2,
      fullName: "Ejemplo 2",
      role: "Profesora",
      area: "área",
      email: "@userena.cl",
      imageUrl: "/images/foto-docente.png",
    },
    {
      id: 3,
      fullName: "Ejemplo 3",
      role: "Profesor",
      area: "área",
      email: "@userena.cl",
      imageUrl: "/images/foto-docente.png",
    },
    {
      id: 4,
      fullName: "Ejemplo 4",
      role: "Profesora",
      area: "área",
      email: "@userena.cl",
      imageUrl: "/images/foto-docente.png",
    },
    {
      id: 5,
      fullName: "Ejemplo 5",
      role: "Profesor",
      area: "área",
      email: "@userena.cl",
      imageUrl: "/images/foto-docente.png",
    },
    {
      id: 6,
      fullName: "Ejemplo 6",
      role: "Profesora",
      area: "área",
      email: "@userena.cl",
      imageUrl: "/images/foto-docente.png",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-[#722b4d] text-white pt-28 pb-24 text-center">
        
        <span className="inline-block rounded bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
            Nuestro Equipo
          </span>

        <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Docentes
          </h1>

        <p className="mt-4 text-white/80 max-w-2xl mx-auto text-lg">
          Profesionales de excelencia comprometidos con la formación integral de nuestros estudiantes.
        </p>
      </section>

      <section
        className="py-20 px-6"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(114,43,77,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </section>
    </div>
  );
}