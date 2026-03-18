import { useMemo, useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";

const DEFAULT_PERMISSIONS = {
  createTeacher: false,
  editTeacher: false,
  deleteTeacher: false,
};

const DEFAULT_TEACHER_IMAGE = "/images/foto-docente.png";

const INITIAL_TEACHERS = [
  {
    id: "1",
    fullName: "Ejemplo 1",
    role: "Profesor",
    area: "Área de Especialización",
    email: "@userena.cl",
    degree: "Grado Académico",
    projects: ["Proyecto 1", "Proyecto 2", "Proyecto 3"],
    imageUrl: DEFAULT_TEACHER_IMAGE,
  },
  {
    id: "2",
    fullName: "Ejemplo 2",
    role: "Profesora",
    area: "Área de Especialización",
    email: "@userena.cl",
    degree: "Magíster",
    projects: ["Proyecto A", "Proyecto B"],
    imageUrl: DEFAULT_TEACHER_IMAGE,
  },
];

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
 * Convierte el texto de proyectos del formulario en una lista limpia.
 *
 * @param {string} projectsText - Texto con un proyecto por línea.
 * @returns {Array<string>} Lista de proyectos normalizados.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function parseProjectsText(projectsText) {
  return projectsText
    .split("\n")
    .map((project) => project.trim())
    .filter(Boolean);
}

/**
 * Obtiene una URL de imagen válida para el docente.
 * Si no se proporciona una, se usa una imagen por defecto.
 *
 * @param {string} imageUrl - URL ingresada en el formulario.
 * @returns {string} URL final de la imagen.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function resolveTeacherImageUrl(imageUrl) {
  return imageUrl.trim() || DEFAULT_TEACHER_IMAGE;
}

/**
 * Construye un objeto de docente normalizado a partir del formulario.
 *
 * @param {object} formData - Datos actuales del formulario.
 * @param {boolean} isEditing - Indica si la operación es una edición.
 * @param {string|null} editingTeacherId - Identificador del docente en edición.
 * @returns {{
 *   id: string,
 *   fullName: string,
 *   role: string,
 *   area: string,
 *   email: string,
 *   degree: string,
 *   projects: Array<string>,
 *   imageUrl: string
 * }} Docente normalizado.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function buildNormalizedTeacher(formData, isEditing, editingTeacherId) {
  return {
    id: isEditing ? editingTeacherId : crypto.randomUUID(),
    fullName: formData.fullName.trim(),
    role: formData.role.trim(),
    area: formData.area.trim(),
    email: formData.email.trim().toLowerCase(),
    degree: formData.degree.trim(),
    projects: parseProjectsText(formData.projectsText),
    imageUrl: resolveTeacherImageUrl(formData.imageUrl),
  };
}

/**
 * Ordena la lista de docentes alfabéticamente por nombre.
 *
 * @param {Array<object>} teachers - Lista actual de docentes.
 * @returns {Array<object>} Lista ordenada de docentes.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function sortTeachersByName(teachers) {
  return [...teachers].sort((firstTeacher, secondTeacher) =>
    firstTeacher.fullName.localeCompare(secondTeacher.fullName)
  );
}

/**
 * Actualiza un docente dentro de la colección actual.
 *
 * @param {Array<object>} teachers - Lista actual de docentes.
 * @param {string} teacherId - Identificador del docente a actualizar.
 * @param {object} updatedTeacher - Datos actualizados del docente.
 * @returns {Array<object>} Lista de docentes actualizada.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function updateTeacherInCollection(teachers, teacherId, updatedTeacher) {
  return teachers.map((teacher) =>
    teacher.id === teacherId ? updatedTeacher : teacher
  );
}

/**
 * Agrega un nuevo docente a la colección actual.
 *
 * @param {Array<object>} teachers - Lista actual de docentes.
 * @param {object} newTeacher - Docente a agregar.
 * @returns {Array<object>} Lista de docentes actualizada.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function addTeacherToCollection(teachers, newTeacher) {
  return [...teachers, newTeacher];
}

/**
 * Elimina un docente de la colección actual.
 *
 * @param {Array<object>} teachers - Lista actual de docentes.
 * @param {string} teacherId - Identificador del docente a eliminar.
 * @returns {Array<object>} Lista filtrada de docentes.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function removeTeacherFromCollection(teachers, teacherId) {
  return teachers.filter((teacher) => teacher.id !== teacherId);
}

/**
 * Estado vacío para cuando no existen docentes registrados.
 *
 * @returns {JSX.Element} Mensaje visual de estado vacío.
 * @throws {Error} Este componente no lanza excepciones controladas.
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
 * @param {object} props - Propiedades del componente.
 * @param {object} props.teacher - Docente a mostrar.
 * @param {Function} props.onEdit - Acción para editar el docente.
 * @param {Function} props.onDelete - Acción para eliminar el docente.
 * @param {object} props.permissions - Permisos disponibles para el usuario actual.
 * @returns {JSX.Element} Tarjeta de docente.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function TeacherCard({ teacher, onEdit, onDelete, permissions }) {
  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="h-24 w-24 overflow-hidden rounded-full bg-[#722b4d]/10 ring-2 ring-[#722b4d]/10">
          <img
            src={teacher.imageUrl}
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
 * @param {object} props - Propiedades del componente.
 * @param {object} props.formData - Datos actuales del formulario.
 * @param {Function} props.onChange - Acción que actualiza el formulario.
 * @param {Function} props.onSubmit - Acción para enviar el formulario.
 * @param {Function} props.onCancel - Acción para cancelar la operación.
 * @param {boolean} props.isEditing - Indica si el formulario está en modo edición.
 * @returns {JSX.Element} Formulario de docente.
 * @throws {Error} Este componente no lanza excepciones controladas.
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
            placeholder="Nombre completo"
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
            placeholder="Rol"
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
            placeholder="Área de especialización"
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
            placeholder="@userena.cl"
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
            placeholder="Grado académico"
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
            placeholder="URL imagen"
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
            placeholder={"Proyecto 1\nProyecto 2\nProyecto 3"}
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

/**
 * Componente principal para la gestión de docentes.
 * Mantiene el estado local y delega la presentación a componentes pequeños
 * para mejorar la legibilidad y reducir la sobrecarga del contenedor.
 *
 * @returns {JSX.Element} Vista principal de gestión de docentes.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
export default function TeacherManagement() {
  const { user } = useAuth();

  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS);
  const [showForm, setShowForm] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingTeacherId);

  /**
   * Mantiene el listado ordenado por nombre para que la interfaz sea
   * consistente y fácil de recorrer visualmente.
   */
  const sortedTeachers = useMemo(() => sortTeachersByName(teachers), [teachers]);

  /**
   * Reinicia el formulario y sale del modo edición.
   * Esto evita reutilizar accidentalmente datos previos entre operaciones.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const resetFormState = () => {
    setShowForm(false);
    setEditingTeacherId(null);
    setFormData(EMPTY_FORM);
  };

  /**
   * Abre el formulario en modo creación.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleNewTeacher = () => {
    setEditingTeacherId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  /**
   * Carga en el formulario la información del docente seleccionado.
   *
   * @param {object} teacher - Docente seleccionado para edición.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleEditTeacher = (teacher) => {
    setEditingTeacherId(teacher.id);
    setFormData({
      id: teacher.id,
      fullName: teacher.fullName,
      role: teacher.role,
      area: teacher.area,
      email: teacher.email,
      degree: teacher.degree,
      projectsText: teacher.projects.join("\n"),
      imageUrl: teacher.imageUrl,
    });
    setShowForm(true);
  };

  /**
   * Elimina un docente del listado actual.
   *
   * @param {string} teacherId - Identificador del docente a eliminar.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleDeleteTeacher = (teacherId) => {
    setTeachers((currentTeachers) =>
      removeTeacherFromCollection(currentTeachers, teacherId)
    );
  };

  /**
   * Cancela la operación actual y reinicia el formulario.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleCancelForm = () => {
    resetFormState();
  };

  /**
   * Actualiza el estado del formulario según el campo modificado.
   *
   * @param {object} event - Evento de cambio de un campo del formulario.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: value,
    }));
  };

  /**
   * Guarda un docente nuevo o actualiza uno existente.
   * La normalización previa evita almacenar espacios innecesarios,
   * correos con mayúsculas y proyectos vacíos.
   *
   * @param {object} event - Evento de envío del formulario.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedTeacher = buildNormalizedTeacher(
      formData,
      isEditing,
      editingTeacherId
    );

    if (isEditing) {
      setTeachers((currentTeachers) =>
        updateTeacherInCollection(
          currentTeachers,
          editingTeacherId,
          normalizedTeacher
        )
      );
    } else {
      setTeachers((currentTeachers) =>
        addTeacherToCollection(currentTeachers, normalizedTeacher)
      );
    }

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
            {sortedTeachers.length > 0 ? (
              sortedTeachers.map((teacher) => (
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