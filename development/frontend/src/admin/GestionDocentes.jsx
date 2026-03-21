import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";

const DEFAULT_PERMISSIONS = {
  createTeacher: false,
  editTeacher: false,
  deleteTeacher: false,
};

const DEFAULT_TEACHER_IMAGE = "/images/foto-docente.png";

const EMPTY_FORM = {
  id: "",
  fullName: "",
  role: "",
  area: "",
  email: "",
  degree: "",
  projectsText: "",
  imageUrl: "",
};

/**
 * Obtiene una URL de imagen válida para el docente.
 *
 * @param {string} imageUrl
 * @returns {string}
 */
function resolveTeacherImageUrl(imageUrl) {
  return imageUrl?.trim() || DEFAULT_TEACHER_IMAGE;
}

/**
 * Estado vacío para cuando no existen docentes registrados.
 *
 * @returns {JSX.Element}
 */
function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
      No hay docentes registrados todavía.
    </div>
  );
}

/**
 * Tarjeta visual para mostrar la información resumida de un docente.
 *
 * @param {object} props
 * @param {object} props.teacher
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 * @param {object} props.permissions
 * @returns {JSX.Element}
 */
function TeacherCard({ teacher, onEdit, onDelete, permissions }) {
  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-24 w-24 overflow-hidden rounded-full bg-[#722b4d]/10 ring-2 ring-[#722b4d]/10">
          <img
            src={resolveTeacherImageUrl(teacher.imageUrl)}
            alt={teacher.fullName}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#722b4d]">
            {teacher.fullName}
          </h3>
          <p className="mt-1 text-sm font-medium text-[#1f75b8]">
            {teacher.role}
          </p>
          <p className="mt-2 text-sm text-gray-600">{teacher.area}</p>
          <p className="mt-1 text-sm text-gray-500">{teacher.email}</p>
        </div>

        <div className="flex items-center gap-3 self-end md:self-center">
          {permissions.editTeacher && (
            <button
              type="button"
              onClick={() => onEdit(teacher)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#1f75b8] transition hover:bg-[#1f75b8]/10"
            >
              Editar
            </button>
          )}

          {permissions.deleteTeacher && (
            <button
              type="button"
              onClick={() => onDelete(teacher.id)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

/**
 * Formulario reutilizable para crear o editar docentes.
 *
 * @param {object} props
 * @param {object} props.formData
 * @param {Function} props.onChange
 * @param {Function} props.onSubmit
 * @param {Function} props.onCancel
 * @param {boolean} props.isEditing
 * @returns {JSX.Element}
 */
function TeacherForm({ formData, onChange, onSubmit, onCancel, isEditing }) {
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
            placeholder="Ingresa el nombre completo"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Rol
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={onChange}
            placeholder="Ingresa el rol"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Área de especialización
          </label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={onChange}
            placeholder="Ingresa el área de especialización"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="Ingresa el correo electrónico"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Grado académico
          </label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={onChange}
            placeholder="Ingresa el grado académico"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
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
            placeholder="Ingresa la URL de la imagen"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Proyectos
          </label>
          <textarea
            name="projectsText"
            value={formData.projectsText}
            onChange={onChange}
            placeholder="Ingresa un proyecto por línea"
            rows={5}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          />
          <p className="mt-2 text-xs text-gray-500">
            Escribe un proyecto por línea.
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


export default function TeacherManagement() {
  const { user } = useAuth();

  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;

  const [teachers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingTeacherId);

  /**
   * Reinicia el formulario y sale del modo edición.
   */
  const resetFormState = () => {
    setShowForm(false);
    setEditingTeacherId(null);
    setFormData(EMPTY_FORM);
  };

  /**
   * Abre el formulario en modo creación.
   */
  const handleNewTeacher = () => {
    setEditingTeacherId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  /**
   * Carga en el formulario la información del docente seleccionado.
   *
   * @param {object} teacher
   */
  const handleEditTeacher = (teacher) => {
    setEditingTeacherId(teacher.id);
    setFormData({
      id: teacher.id || "",
      fullName: teacher.fullName || "",
      role: teacher.role || "",
      area: teacher.area || "",
      email: teacher.email || "",
      degree: teacher.degree || "",
      projectsText: Array.isArray(teacher.projects)
        ? teacher.projects.join("\n")
        : "",
      imageUrl: teacher.imageUrl || "",
    });
    setShowForm(true);
  };

  const handleDeleteTeacher = () => {
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
          Gestión de Docentes
        </h1>

        {permissions.createTeacher && (
          <button
            type="button"
            onClick={handleNewTeacher}
            className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            + Nuevo Docente
          </button>
        )}
      </div>

      <div className="mt-8">
        {showForm ? (
          <TeacherForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            isEditing={isEditing}
          />
        ) : (
          <div className="space-y-4">
            {teachers.length > 0 ? (
              teachers.map((teacher) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  onEdit={handleEditTeacher}
                  onDelete={handleDeleteTeacher}
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