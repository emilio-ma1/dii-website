import { useEffect, useState } from "react";
import { usePublicTeachers } from "../hooks/usePublicTeachers";
/**
 * Renders a card with the main teacher information.
 *
 * This card displays the teacher name, role, and academic area.
 * It also includes an action button that opens a modal
 * with detailed information about the selected teacher.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.teacher - Teacher information to display.
 * @param {string} props.teacher.fullName - Teacher full name.
 * @param {string} props.teacher.role - Teacher position or role.
 * @param {string} props.teacher.area - Academic or specialization area.
 * @param {string} props.teacher.imageUrl - Teacher image path.
 * @param {Function} props.onOpen - Function that opens the teacher modal.
 * @returns {JSX.Element} Rendered teacher card.
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
      <h3 className="text-lg font-semibold text-[#722b4d]">{teacher.fullName}</h3>
      <p className="mb-3 text-sm text-[#1f78c1]">{teacher.role}</p>
      <p className="text-sm text-gray-500">{teacher.area}</p>
      <button
        type="button"
        onClick={() => onOpen(teacher)}
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#722b4d] transition hover:gap-3"
      >
        Ver más información <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

/**
 * Renders the modal with detailed teacher information.
 *
 * @param {Object} props - Component props.
 * @param {Object|null} props.teacher - Currently selected teacher.
 * @param {Function} props.onClose - Function that closes the modal.
 * @returns {JSX.Element|null} Rendered modal or null when no teacher is selected.
 */
function TeacherModal({ teacher, onClose }) {
    /**
   * Handles Escape key behavior and page scroll lock
   * while the modal is open.
   */
  useEffect(() => {
    if (!teacher) return;
    const handleEscape = (event) => { if (event.key === "Escape") onClose(); };
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
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="relative bg-[#722b4d] px-6 py-5 text-white sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-white/80 transition hover:text-white"
            aria-label="Cerrar modal"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-4 pr-10">
            <img
              src={teacher.imageUrl}
              alt={`Foto de ${teacher.fullName}`}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-white/20"
            />
            <div>
              <h2 className="text-2xl font-extrabold">{teacher.fullName}</h2>
              <p className="mt-1 text-sm text-[#6fc0ff]">{teacher.role}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-6 py-6 sm:px-8">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Grado Académico</h3>
            <p className="mt-2 text-base leading-7 text-gray-700">{teacher.degree}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Área de Especialización</h3>
            <p className="mt-2 text-base leading-7 text-gray-700">{teacher.area}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Proyectos en los que ha trabajado</h3>
            {teacher.projects && teacher.projects.length > 0 ? (
              <ul className="mt-3 space-y-2 text-base leading-7 text-gray-700">
                {teacher.projects.map((project, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#722b4d]" />
                    {project}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm italic text-gray-400">No hay proyectos asociados aún.</p>
            )}
          </div>
          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Contacto</h3>
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
 * Main department teachers page.
 *
 * Fetches the public teacher list and renders
 * the corresponding loading, empty, or content state.
 *
 * @returns {JSX.Element} Rendered teachers page.
 */
export default function Docentes() {
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  
  const { teachers, isLoading } = usePublicTeachers();

  return (
    <div className="min-h-screen">
      <section className="bg-[#722b4d] pb-24 pt-28 text-center text-white">
        <span className="inline-block rounded bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
          Nuestro Equipo
        </span>
        <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl lg:text-6xl">Docentes</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
          Profesionales de excelencia comprometidos con la formación integral de nuestros estudiantes.
        </p>
      </section>

      <section
        className="px-6 py-20 min-h-[50vh]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(114,43,77,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto max-w-6xl">
          {isLoading ? (
             <div className="text-center text-gray-500 py-20 font-medium">Cargando docentes...</div>
          ) : teachers.length > 0 ? (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {teachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onOpen={setSelectedTeacher}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-20 font-medium">
              Aún no hay perfiles de docentes configurados para mostrar.
            </div>
          )}
        </div>
      </section>

      <TeacherModal
        teacher={selectedTeacher}
        onClose={() => setSelectedTeacher(null)}
      />
    </div>
  );
}