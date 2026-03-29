/**
 * @file TeacherCard.jsx
 * @description Presentational component displaying the synchronized teacher profile and portfolio.
 */

const DEFAULT_TEACHER_IMAGE = "/images/foto-docente.jpg";

export function TeacherCard({ teacher, onEdit, onDelete, permissions }) {
  const imageUrl = teacher.imageUrl?.trim() || DEFAULT_TEACHER_IMAGE;

  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="h-24 w-24 overflow-hidden rounded-full bg-[#722b4d]/10 ring-2 ring-[#722b4d]/10 flex-shrink-0">
          <img src={imageUrl} alt={teacher.user_name} className="h-full w-full object-cover" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#722b4d]">{teacher.user_name}</h3>
          <p className="mt-1 text-sm font-medium text-[#1f75b8]">{teacher.degree}</p>
          <p className="mt-1 text-sm text-gray-600">Área: {teacher.area}</p>
          <p className="mt-1 text-sm text-gray-500">{teacher.email}</p>

          {/* Portafolio Automático de Proyectos */}
          <div className="mt-4">
            <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Portafolio de Proyectos</h4>
            {teacher.projects && teacher.projects.length > 0 ? (
              <ul className="list-disc list-inside text-sm text-gray-600">
                {teacher.projects.map(proj => (
                  <li key={proj.id}>{proj.title}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">No hay proyectos asociados aún.</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 self-end md:self-start mt-4 md:mt-0">
          {permissions.editTeacher && (
            <button onClick={() => onEdit(teacher)} className="rounded-lg px-3 py-2 text-sm font-medium text-[#1f75b8] transition hover:bg-[#1f75b8]/10">
              Editar
            </button>
          )}
          {permissions.deleteTeacher && (
            <button onClick={() => onDelete(teacher.id)} className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
              Eliminar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}