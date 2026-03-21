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
  videoUrlEmbed: "",
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

/**
 * Tarjeta visual para mostrar la información resumida de un estudiante.
 *
 * @param {object} props
 * @param {object} props.student
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 * @param {object} props.permissions
 * @returns {JSX.Element}
 */
function StudentCard({ student, onEdit, onDelete, permissions }) {
  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#722b4d]/10 text-2xl font-bold text-[#722b4d]">
          {student.fullName?.charAt(0)?.toUpperCase() || "E"}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#722b4d]">
            {student.fullName}
          </h3>

          <p className="mt-1 text-sm font-medium text-[#1f75b8]">
            {student.specialty}
          </p>

          <p className="mt-2 text-sm text-gray-500">
            {student.videoUrlEmbed
              ? "Video cargado"
              : "Aún no tiene video registrado"}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
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
      <div className="grid grid-cols-1 gap-4">
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
            Año de cursado
          </label>
          <input
            type="text"
            name="specialty"
            value={formData.specialty}
            onChange={onChange}
            placeholder="Ingresa el año de cursado"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
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

  const [students] = useState([]);

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
      videoUrlEmbed: student.videoUrlEmbed || "",
    });

    setShowForm(true);
  };

  const handleDeleteStudent = () => {
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
      [name]: value,
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