import { useEffect, useState } from "react";

/**
 * Datos simulados de estudiantes.
 * Cada estudiante incluye nombre, generación y video testimonial.
 */
const MOCK_STUDENTS = [
  {
    id: 1,
    fullName: "Estudiante 1",
    specialty: "5to año",
    videoUrlEmbed: "",
  },
  {
    id: 2,
    fullName: "Estudiante 2",
    specialty: "Egresado 2024",
    videoUrlEmbed: "",
  },
  {
    id: 3,
    fullName: "Estudiante 3",
    specialty: "4to Año",
    videoUrlEmbed: "",
  },
];

/**
 * Obtiene la lista de estudiantes.
 */
async function fetchStudents() {
  return MOCK_STUDENTS;
}

/**
 * Renderiza el hero principal de la página de estudiantes.
 *
 * @returns {JSX.Element} La sección hero renderizada.
 */
function StudentsHero() {
  return (
    <section className="bg-[#722b4d] text-white">
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-24 lg:pt-32 lg:pb-28">
        <div className="max-w-3xl text-center mx-auto">
          <span className="inline-block rounded bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
            Comunidad
          </span>

          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Nuestros Estudiantes
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/80 sm:text-xl">
            Presencia los testimonios y experiencias de los estudiantes que estudian y estudiaron en las carreras de este departamento.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Renderiza una tarjeta testimonial con la información y video de un estudiante.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.student - Información del estudiante.
 * @param {string} props.student.fullName - Nombre completo del estudiante.
 * @param {string} props.student.specialty - Curso, generación o categoría del estudiante.
 * @param {string} props.student.videoUrlEmbed - URL del video testimonial.
 * @returns {JSX.Element} La tarjeta testimonial renderizada.
 */
function StudentTestimonialCard({ student }) {
  const hasVideo = Boolean(
    student.videoUrlEmbed && student.videoUrlEmbed.trim().length > 0
  );

  return (
    <article className="rounded-xl bg-white shadow-md border border-black/5 overflow-hidden transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between gap-4 px-5 pt-5 pb-4">
        <div>
          <h3 className="text-xl font-bold text-[#722b4d] leading-tight">
            {student.fullName}
          </h3>
          <p className="mt-1 text-sm font-semibold text-[#1f78c1]">
            {student.specialty}
          </p>
        </div>

        <span className="text-5xl leading-none text-[#722b4d]/10 font-bold">
          ”
        </span>
      </div>

      <div className="px-5 pb-5">
        {hasVideo ? (
          <div className="overflow-hidden rounded-lg bg-black aspect-video">
            <iframe
              className="h-full w-full"
              src={student.videoUrlEmbed}
              title={`Video de ${student.fullName}`}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-lg bg-gray-100 border border-gray-200">
            <p className="text-sm text-gray-500">Video no disponible</p>
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * Renderiza la página de testimonios de estudiantes.
 *
 * Responsabilidades:
 * - Obtener la lista de estudiantes.
 * - Mostrar estado de carga mientras se resuelven los datos.
 * - Renderizar testimonios disponibles o un mensaje vacío cuando no existan registros.
 *
 * @returns {JSX.Element} La página de estudiantes renderizada.
 */
export default function Estudiantes() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStudents() {
      try {
        const data = await fetchStudents();
        setStudents(data);
      } catch (error) {
        console.error("Error al cargar estudiantes:", error);
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Cargando estudiantes...</p>
      </div>
    );
  }

  const hasStudents = students.length > 0;

  return (
    <div className="min-h-screen bg-white">
      <StudentsHero />

      <section
        className="bg-[#f7f5f6] py-20 lg:py-24"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(114,43,77,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1f78c1]">
              Testimonios
            </p>

            <h2 className="mt-3 text-4xl font-extrabold text-[#722b4d] sm:text-5xl lg:text-6xl">
              Lo que dicen nuestros estudiantes
            </h2>
          </div>

          {!hasStudents ? (
            <div className="rounded-lg border border-gray-200 bg-white py-12 text-center shadow-sm">
              <p className="text-gray-500">No hay estudiantes disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              {students.map((student) => (
                <StudentTestimonialCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}