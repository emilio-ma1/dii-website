import { useEffect, useState } from "react";

/**
 * Renderiza una tarjeta con la información principal de un docente.
 *
 * Esta tarjeta muestra el nombre, cargo y área del docente.
 * Además incluye un botón que permite abrir un modal con
 * información detallada del profesor seleccionado.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.teacher - Información del docente a mostrar.
 * @param {string} props.teacher.fullName - Nombre completo del docente.
 * @param {string} props.teacher.role - Cargo o rol del docente.
 * @param {string} props.teacher.area - Área académica o de especialización.
 * @param {string} props.teacher.imageUrl - Ruta de la imagen del docente.
 * @param {Function} props.onOpen - Función que abre el modal del docente.
 *
 * @returns {JSX.Element} Tarjeta visual del docente.
 */
function TeacherCard({ teacher, onOpen }) {
  return (
    <div className="rounded-xl border border-black/10 bg-white p-6 text-center shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-xl">
      <div className="mb-4 flex justify-center">
        <img
          src={teacher.imageUrl}
          alt={`Foto de ${teacher.fullName}`}
          className="h-24 w-24 rounded-md object-cover"
          loading="lazy"
        />
      </div>

      <h3 className="text-lg font-semibold text-[#722b4d]">
        {teacher.fullName}
      </h3>

      <p className="mb-3 text-sm text-[#1f78c1]">
        {teacher.role}
      </p>

      <p className="text-sm text-gray-500">
        {teacher.area}
      </p>

      <button
        type="button"
        onClick={() => onOpen(teacher)}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#722b4d] transition hover:gap-3"
      >
        Ver más información
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

/**
 * Modal que muestra la información detallada de un docente.
 *
 * Se abre al seleccionar una tarjeta de profesor y permite
 * visualizar datos académicos, proyectos y contacto.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object|null} props.teacher - Docente seleccionado.
 * @param {Function} props.onClose - Función para cerrar el modal.
 *
 * @returns {JSX.Element|null} Modal del docente o null si no hay docente seleccionado.
 */
function TeacherModal({ teacher, onClose }) {
  useEffect(() => {
    if (!teacher) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [teacher, onClose]);

  if (!teacher) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="relative bg-[#722b4d] px-6 py-5 text-white sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 transition hover:text-white"
            aria-label="Cerrar modal"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex items-center gap-4 pr-10">
            <img
              src={teacher.imageUrl}
              alt={`Foto de ${teacher.fullName}`}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-white/20"
            />

            <div>
              <h2 className="text-2xl font-extrabold">
                {teacher.fullName}
              </h2>
              <p className="mt-1 text-sm text-[#6fc0ff]">
                {teacher.role}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Grado Académico
            </h3>
            <p className="mt-2 text-base leading-7 text-gray-700">
              {teacher.degree}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Área de Especialización
            </h3>
            <p className="mt-2 text-base leading-7 text-gray-700">
              {teacher.area}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Proyectos en los que ha trabajado
            </h3>

            <ul className="mt-3 space-y-2 text-base leading-7 text-gray-700">
              {teacher.projects?.map((project) => (
                <li key={project} className="flex items-start gap-2">
                  <span className="mt-2 h-2 w-2 rounded-full bg-[#722b4d]" />
                  {project}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Contacto
            </h3>

            <div className="mt-3 space-y-2 text-sm text-gray-700">
              <p>{teacher.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Página principal de docentes del departamento.
 *
 * Esta vista presenta un encabezado institucional y una
 * grilla de tarjetas con los docentes del departamento.
 * Cada tarjeta permite abrir un modal con información detallada.
 *
 * @returns {JSX.Element} Página de docentes renderizada.
 */
export default function Docentes() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const teachers = [
    {
      id: 1,
      fullName: "Ejemplo 1",
      role: "Profesor",
      area: "Área de Especialización",
      email: "@userena.cl",
      degree: "Grado Académico",
      projects: [
        "Proyecto 1",
        "Proyecto 2",
        "Proyecto 3",
      ],
      imageUrl: "/images/foto-docente.png",
    },
    {
      id: 2,
      fullName: "Ejemplo 2",
      role: "Profesora",
      area: "Área de Especialización",
      email: "@userena.cl",
      degree:"Grado Académico",
      projects: [
        "Proyecto 1",
        "Proyecto 2",
        "Proyecto 3",
      ],
      imageUrl: "/images/foto-docente.png",
    },
    {
      id: 3,
      fullName: "Ejemplo 3",
      role: "Profesor",
      area: "Área de Especialización",
      email: "@userena.cl",
      degree: "Grado Académico",
      projects: [
        "Proyecto 1",
        "Proyecto 2",
        "Proyecto 3",
      ],
      imageUrl: "/images/foto-docente.png",
    },
    {
      id: 4,
      fullName: "Ejemplo 4",
      role: "Profesora",
      area: "Área de Especialización",
      email: "@userena.cl",
      degree: "Grado Académico",
      projects: [
        "Proyecto 1",
        "Proyecto 2",
        "Proyecto 3",
      ],
      imageUrl: "/images/foto-docente.png",
    },
    {
      id: 5,
      fullName: "ejemplo 5",
      role: "Profesor",
      area: "Área de Especialización",
      email: "@userena.cl",
      degree: "Grado Académico",
      projects: [
        "Proyecto 1",
        "Proyecto 2",
        "Proyecto 3",
      ],
      imageUrl: "/images/foto-docente.png",
    },
    {
      id: 6,
      fullName: "Ejemplo 6",
      role: "Profesora",
      area: "Área de Especialización",
      email: "@userena.cl",
      degree: "Grado Académico",
      projects: [
        "Proyecto 1",
        "Proyecto 2",
        "Proyecto 3",
      ],
      imageUrl: "/images/foto-docente.png",
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-[#722b4d] pb-24 pt-28 text-center text-white">
        <span className="inline-block rounded bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
          Nuestro Equipo
        </span>

        <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
          Docentes
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
          Profesionales de excelencia comprometidos con la formación integral de nuestros estudiantes.
        </p>
      </section>

      <section
        className="px-6 py-20"
        style={{
          backgroundImage:"radial-gradient(circle at 1px 1px, rgba(114,43,77,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {teachers.map((teacher) => (
            <TeacherCard
              key={teacher.id}
              teacher={teacher}
              onOpen={setSelectedTeacher}
            />
          ))}
        </div>
      </section>

      <TeacherModal
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />
    </div>
  );
}