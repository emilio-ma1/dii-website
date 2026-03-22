import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";

const DEFAULT_PERMISSIONS = {
  createStudent: false,
  editStudent: false,
  deleteStudent: false,
};

const EMPTY_FORM = {
  id: "",
  fullName: "",
  specialty: "",
  degree: "",
  email: "",
  projects: "",
  videoUrlEmbed: "",
  imageUrl: "",
  isProfilePublic: true,
};

/**
 * Genera el título del iframe para el video de un estudiante.
 *
 * @param {string} fullName - Nombre completo del estudiante.
 * @returns {string} Título accesible para el iframe.
 */
function buildStudentVideoTitle(fullName) {
  return `Video de ${fullName?.trim() || "estudiante"}`;
}

/**
 * Estado vacío para el caso en que no existan estudiantes registrados.
 *
 * @returns {JSX.Element}
 */
function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
      No hay estudiantes registrados todavía.
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.223-3.592M6.228 6.228A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.97 9.97 0 01-4.132 5.411M15 12a3 3 0 00-3-3m0 0a2.99 2.99 0 00-2.12.879M12 9l-7 7m14-14L5 19"
      />
    </svg>
  );
}

/**
 * Tarjeta visual para mostrar la información resumida de un estudiante.
 *
 * @param {object} props
 * @param {object} props.student
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 * @param {Function} props.onToggleVisibility
 * @param {object} props.permissions
 * @returns {JSX.Element}
 */
function StudentCard({
  student,
  onEdit,
  onDelete,
  onToggleVisibility,
  permissions,
}) {
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

            <p className="mt-1 text-sm font-medium text-[#1f75b8]">
              {student.specialty}
            </p>

            <p className="mt-1 text-sm text-gray-500">{student.degree}</p>

            <p className="mt-2 text-sm text-gray-500">
              {student.videoUrlEmbed
                ? "Video cargado"
                : "Aún no tiene video registrado"}
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
            src={student.videoUrlEmbed}
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

/**
 * Formulario reutilizable para crear o editar estudiantes.
 *
 * @param {object} props
 * @param {object} props.formData
 * @param {Function} props.onChange
 * @param {Function} props.onSubmit
 * @param {Function} props.onCancel
 * @param {boolean} props.isEditing
 * @returns {JSX.Element}
 */
function StudentForm({ formData, onChange, onSubmit, onCancel, isEditing }) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[#722b4d]/30 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Nombre completo
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            placeholder="Ingresa el nombre del estudiante"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Año / Generación
          </label>
          <input
            type="text"
            name="specialty"
            value={formData.specialty}
            onChange={onChange}
            placeholder="5to año / Egresado 2024"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Carrera
          </label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={onChange}
            placeholder="Ingeniería Civil Industrial"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Correo
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="correo@userena.cl"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            URL de imagen
          </label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={onChange}
            placeholder="/images/foto-docente.png"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Visibilidad del perfil
          </label>
          <select
            name="isProfilePublic"
            value={String(formData.isProfilePublic)}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          >
            <option value="true">Perfil público</option>
            <option value="false">Perfil privado</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Proyectos involucrados
          </label>
          <textarea
            name="projects"
            value={formData.projects}
            onChange={onChange}
            rows={4}
            placeholder={"Proyecto 1\nProyecto 2"}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          />
          <p className="mt-2 text-xs text-gray-500">
            Escribe un proyecto por línea.
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            URL embed del video
          </label>
          <textarea
            name="videoUrlEmbed"
            value={formData.videoUrlEmbed}
            onChange={onChange}
            rows={4}
            placeholder="Ingresa la URL embed del video"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          />
          <p className="mt-2 text-xs text-gray-500">
            Usa la URL embed del video, por ejemplo desde YouTube.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          {isEditing ? "Guardar Cambios" : "Guardar"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default function StudentManagement() {
  const { user } = useAuth();

  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;

  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingStudentId);

  /**
   * Reinicia el formulario y limpia el modo edición.
   */
  const resetFormState = () => {
    setShowForm(false);
    setEditingStudentId(null);
    setFormData(EMPTY_FORM);
  };

  /**
   * Abre el formulario en modo creación.
   */
  const handleNewStudent = () => {
    setEditingStudentId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  /**
   * Carga en el formulario la información del estudiante seleccionado.
   *
   * @param {object} student
   */
  const handleEditStudent = (student) => {
    setEditingStudentId(student.id);

    setFormData({
      id: student.id || "",
      fullName: student.fullName || "",
      specialty: student.specialty || "",
      degree: student.degree || "",
      email: student.email || "",
      imageUrl: student.imageUrl || "",
      videoUrlEmbed: student.videoUrlEmbed || "",
      projects: Array.isArray(student.projects)
        ? student.projects.join("\n")
        : "",
      isProfilePublic:
        typeof student.isProfilePublic === "boolean"
          ? student.isProfilePublic
          : true,
    });

    setShowForm(true);
  };

  const handleDeleteStudent = (_studentId) => {
  };

  const handleToggleVisibility = (_studentId) => {
  };

  /**
   * Cancela la operación actual y reinicia el formulario.
   */
  const handleCancelForm = () => {
    resetFormState();
  };

  /**
   * Actualiza el estado del formulario según el campo modificado.
   *
   * @param {object} event
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: name === "isProfilePublic" ? value === "true" : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    resetFormState();
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
          Gestión de Estudiantes
        </h1>

        {permissions.createStudent && (
          <button
            type="button"
            onClick={handleNewStudent}
            className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            + Nuevo Estudiante
          </button>
        )}
      </div>

      <div className="mt-8">
        {showForm ? (
          <StudentForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            isEditing={isEditing}
          />
        ) : (
          <div className="space-y-4">
            {students.length > 0 ? (
              students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onEdit={handleEditStudent}
                  onDelete={handleDeleteStudent}
                  onToggleVisibility={handleToggleVisibility}
                  permissions={permissions}
                />
              ))
            ) : (
              <EmptyState />
            )}
          </div>
        )}
      </div>
    </section>
  );
}