import { useEffect, useState } from "react";
import { usePublicStudents } from "../hooks/usePublicStudents";

/**
 * Converts a YouTube URL into embed format.
 *
 * @param {string} url - Original YouTube URL.
 * @returns {string} Embed-ready YouTube URL or the original value.
 */
const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  if (url.includes("/embed/")) return url;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url;
};

/**
 * Renders the main hero section of the students page.
 *
 * @returns {JSX.Element} Rendered hero section.
 */
function StudentsHero() {
  return (
    <section className="bg-[#722b4d] text-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-28 lg:pb-28 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/90">
            Comunidad
          </span>
          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Nuestros Estudiantes
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/80 sm:text-xl">
            Presencia los testimonios y experiencias de los estudiantes que
            estudian y estudiaron en las carreras de este departamento.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Renders the modal for a public student profile.
 *
 * @param {Object} props - Component props.
 * @param {Object|null} props.student - Currently selected student.
 * @param {Function} props.onClose - Function that closes the modal.
 * @returns {JSX.Element|null} Rendered modal or null when no student is selected.
 */
function StudentModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-[#722b4d] px-6 py-5 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute right-5 top-5 text-2xl leading-none text-white/90 transition hover:text-white"
          >
            x
          </button>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white/20 bg-white/10 shadow-sm shrink-0">
              <img
                src={student.imageUrl}
                alt={student.fullName}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold leading-tight">{student.fullName}</h3>
              <p className="mt-1 text-base text-white/90">{student.degree}</p>
              <p className="mt-1 text-base text-white/90">{student.specialty}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8 px-6 py-7">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#722b4d]/80">Contacto</p>
            <p className="mt-3 text-base text-gray-700">{student.email}</p>
          </div>

          <div>
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#722b4d]/80">Proyectos involucrados</p>
            <div className="mt-4 space-y-3">
              {student.projects && student.projects.length > 0 ? (
                student.projects.map((project, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-black/5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#722b4d] shrink-0" />
                    <span className="text-sm text-gray-700">{project}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No hay proyectos asociados.</p>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#722b4d] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders the modal for a private student profile.
 *
 * @param {Object} props - Component props.
 * @param {Object|null} props.student - Currently selected student.
 * @param {Function} props.onClose - Function that closes the modal.
 * @returns {JSX.Element|null} Rendered modal or null when no student is selected.
 */
function PrivateProfileModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-[#722b4d] px-6 py-5 text-white">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute right-5 top-5 text-2xl leading-none text-white/90 transition hover:text-white"
          >
            x
          </button>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20 bg-white/10 text-3xl font-bold text-white shadow-sm shrink-0">
              {student.fullName?.charAt(0)?.toUpperCase() || "E"}
            </div>
            <div>
              <h3 className="text-3xl font-extrabold leading-tight">Perfil privado</h3>
              <p className="mt-2 text-base text-white/90">
                {student.fullName} ha decidido mantener su información privada.
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-7">
          <p className="text-base leading-7 text-gray-600">
            Este egresado no tiene su perfil disponible para visualización pública en este momento.
          </p>
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-[#722b4d] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Renders a testimonial card with student information and video.
 *
 * @param {Object} props - Component props.
 * @param {Object} props.student - Student information to display.
 * @param {Function} props.onOpenModal - Function that opens the student modal.
 * @returns {JSX.Element} Rendered testimonial card.
 */
function StudentTestimonialCard({ student, onOpenModal }) {
  // Applies YouTube URL normalization before rendering the iframe.
  const finalVideoUrl = getYouTubeEmbedUrl(student.videoUrlEmbed);
  const hasVideo = Boolean(finalVideoUrl && finalVideoUrl.trim().length > 0);

  return (
    <article className="overflow-hidden rounded-xl border border-black/5 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between gap-4 px-5 pb-4 pt-5">
        <div>
          <button
            type="button"
            onClick={() => onOpenModal(student)}
            className="text-left text-xl font-bold leading-tight text-[#722b4d] transition hover:opacity-80"
          >
            {student.fullName}
          </button>
          <p className="mt-1 text-sm font-semibold text-[#1f78c1]">
            {student.specialty}
          </p>
        </div>
        <span className="text-5xl font-bold leading-none text-[#722b4d]/10">”</span>
      </div>

      <div className="px-5 pb-5 mt-auto">
        {hasVideo ? (
          <div className="aspect-video overflow-hidden rounded-lg bg-black">
            <iframe
              className="h-full w-full"
              src={finalVideoUrl}
              title={`Video de ${student.fullName}`}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
            <p className="text-sm text-gray-500">Video no disponible</p>
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * Renders the students testimonials page.
 *
 * This component handles the public students list,
 * the loading state, and the profile modal flow.
 *
 * @returns {JSX.Element} Rendered students page.
 */
export default function Estudiantes() {
  const { students, isLoading } = usePublicStudents();
  const [selectedStudent, setSelectedStudent] = useState(null);

  /**
   * Handles Escape key behavior and body scroll lock
   * while a modal is open.
   */
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") setSelectedStudent(null);
    }
    if (selectedStudent) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "auto";
    };
  }, [selectedStudent]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600 font-medium">Cargando estudiantes...</p>
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
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(114,43,77,0.08) 1px, transparent 0)",
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
              <p className="text-gray-500 font-medium">Aún no hay perfiles de estudiantes configurados para mostrar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              {students.map((student) => (
                <StudentTestimonialCard
                  key={student.id}
                  student={student}
                  onOpenModal={setSelectedStudent}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedStudent &&
        (selectedStudent.isProfilePublic ? (
          <StudentModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        ) : (
          <PrivateProfileModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        ))}
    </div>
  );
}