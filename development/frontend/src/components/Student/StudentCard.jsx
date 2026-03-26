/**
 * @file StudentCard.jsx
 * @description Presentational component for displaying an alumni/student profile.
 */

function EyeIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592M6.228 6.228A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.132 5.411M15 12a3 3 0 00-3-3m0 0a2.99 2.99 0 00-2.12.879M12 9l-7 7m14-14L5 19" />
    </svg>
  );
}

function buildStudentVideoTitle(fullName) {
  return `Video de ${fullName?.trim() || "estudiante"}`;
}

const getYouTubeEmbedUrl = (url) => {
  if (!url) return "";
  
  // Si ya viene con formato embed, lo dejamos pasar
  if (url.includes("/embed/")) return url;

  // Expresión regular para atrapar el ID del video (los 11 caracteres)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  // Si encontramos el ID y tiene el tamaño correcto de YouTube (11 caracteres)
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  // Si no es un enlace reconocible de YouTube, lo devolvemos tal cual
  return url;
};

export function StudentCard({ student, onEdit, onDelete, onToggleVisibility, permissions }) {
  const finalVideoUrl = getYouTubeEmbedUrl(student.videoUrlEmbed);
  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full bg-[#722b4d]/10">
            <img
              src={student.imageUrl || "/images/foto-docente.png"}
              alt={student.fullName}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="break-words text-xl font-bold text-[#722b4d]">
              {student.fullName}
            </h3>
            <p className="mt-1 text-sm font-medium text-[#1f75b8]">{student.specialty}</p>
            <p className="mt-1 text-sm text-gray-500">{student.degree}</p>
            <p className="mt-2 text-sm text-gray-500">
              {student.videoUrlEmbed ? "Video cargado" : "Aún no tiene video registrado"}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleVisibility(student.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  student.isProfilePublic
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {student.isProfilePublic ? <EyeIcon /> : <EyeOffIcon />}
                {student.isProfilePublic ? "Público" : "Privado"}
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                Portafolio de Proyectos
              </h4>
              <div className="mt-2 space-y-1">
                {student.projects && student.projects.length > 0 ? (
                  student.projects.map((proj) => (
                    <div key={proj.id} className="text-sm font-medium text-[#1f75b8]">
                      • {proj.title}
                    </div>
                  ))
                ) : (
                  <p className="text-sm italic text-gray-400">
                    No hay proyectos asociados aún.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 md:justify-end">
          {permissions.editStudent && (
            <button
              type="button"
              onClick={() => onEdit(student)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#1f75b8] transition hover:bg-[#1f75b8]/10"
            >
              Editar
            </button>
          )}

          {permissions.deleteStudent && (
            <button
              type="button"
              onClick={() => onDelete(student.id)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {student.videoUrlEmbed && (
        <div className="mt-5 overflow-hidden rounded-xl border border-black/5 bg-black/5">
          <iframe
            src={finalVideoUrl} /* Usamos nuestra URL ya transformada */
            title={buildStudentVideoTitle(student.fullName)}
            className="h-56 w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </article>
  );
}