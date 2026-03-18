import { useMemo, useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";

const DEFAULT_PERMISSIONS = {
  createStudent: false,
  editStudent: false,
  deleteStudent: false,
};

const INITIAL_STUDENTS = [
  {
    id: "1",
    fullName: "Estudiante 1",
    specialty: "5to año",
    videoUrlEmbed: "",
  },
  {
    id: "2",
    fullName: "Estudiante 2",
    specialty: "Egresado 2024",
    videoUrlEmbed: "",
  },
  {
    id: "3",
    fullName: "Estudiante 3",
    specialty: "4to Año",
    videoUrlEmbed: "",
  },
];

const EMPTY_FORM = {
  id: "",
  fullName: "",
  specialty: "",
  videoUrlEmbed: "",
};

/**
 * Ordena la lista de estudiantes alfabéticamente por nombre.
 *
 * @param {Array<object>} students - Lista actual de estudiantes.
 * @returns {Array<object>} Lista ordenada de estudiantes.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function sortStudentsByName(students) {
  return [...students].sort((firstStudent, secondStudent) =>
    firstStudent.fullName.localeCompare(secondStudent.fullName)
  );
}

/**
 * Normaliza la URL embed del video antes de guardarla.
 *
 * @param {string} videoUrlEmbed - URL embed ingresada en el formulario.
 * @returns {string} URL normalizada sin espacios sobrantes.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function normalizeVideoUrlEmbed(videoUrlEmbed) {
  return videoUrlEmbed.trim();
}

/**
 * Construye un objeto de estudiante normalizado a partir de los datos del formulario.
 *
 * @param {object} formData - Datos actuales del formulario.
 * @param {boolean} isEditing - Indica si la operación corresponde a edición.
 * @param {string|null} editingStudentId - Identificador del estudiante en edición.
 * @returns {{ id: string, fullName: string, specialty: string, videoUrlEmbed: string }} Estudiante normalizado.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function buildNormalizedStudent(formData, isEditing, editingStudentId) {
  return {
    id: isEditing ? editingStudentId : crypto.randomUUID(),
    fullName: formData.fullName.trim(),
    specialty: formData.specialty.trim(),
    videoUrlEmbed: normalizeVideoUrlEmbed(formData.videoUrlEmbed),
  };
}

/**
 * Actualiza un estudiante dentro de la colección actual.
 *
 * @param {Array<object>} students - Lista actual de estudiantes.
 * @param {string} studentId - Identificador del estudiante a actualizar.
 * @param {object} updatedStudent - Estudiante actualizado.
 * @returns {Array<object>} Lista de estudiantes actualizada.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function updateStudentInCollection(students, studentId, updatedStudent) {
  return students.map((student) =>
    student.id === studentId ? updatedStudent : student
  );
}

/**
 * Agrega un nuevo estudiante a la colección actual.
 *
 * @param {Array<object>} students - Lista actual de estudiantes.
 * @param {object} newStudent - Estudiante a agregar.
 * @returns {Array<object>} Lista de estudiantes actualizada.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function addStudentToCollection(students, newStudent) {
  return [...students, newStudent];
}

/**
 * Elimina un estudiante de la colección actual.
 *
 * @param {Array<object>} students - Lista actual de estudiantes.
 * @param {string} studentId - Identificador del estudiante a eliminar.
 * @returns {Array<object>} Lista filtrada de estudiantes.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function removeStudentFromCollection(students, studentId) {
  return students.filter((student) => student.id !== studentId);
}

/**
 * Genera el título del iframe para el video de un estudiante.
 *
 * @param {string} fullName - Nombre completo del estudiante.
 * @returns {string} Título accesible para el iframe.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function buildStudentVideoTitle(fullName) {
  return `Video de ${fullName.trim()}`;
}

/**
 * Estado vacío para el caso en que no existan estudiantes registrados.
 *
 * @returns {JSX.Element} Mensaje visual de estado vacío.
 * @throws {Error} Este componente no lanza excepciones controladas.
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
 * @param {object} props - Propiedades del componente.
 * @param {object} props.student - Estudiante a mostrar.
 * @param {Function} props.onEdit - Acción para editar el estudiante.
 * @param {Function} props.onDelete - Acción para eliminar el estudiante.
 * @param {object} props.permissions - Permisos disponibles para el usuario actual.
 * @returns {JSX.Element} Tarjeta de estudiante.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function StudentCard({ student, onEdit, onDelete, permissions }) {
  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#722b4d]/10 text-2xl font-bold text-[#722b4d]">
          {student.fullName?.charAt(0)?.toUpperCase() || "E"}
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#722b4d]">{student.fullName}</h3>

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
 * @param {object} props - Propiedades del componente.
 * @param {object} props.formData - Datos actuales del formulario.
 * @param {Function} props.onChange - Acción al modificar un campo.
 * @param {Function} props.onSubmit - Acción al enviar el formulario.
 * @param {Function} props.onCancel - Acción al cancelar la operación.
 * @param {boolean} props.isEditing - Indica si el formulario está en modo edición.
 * @returns {JSX.Element} Formulario de estudiante.
 * @throws {Error} Este componente no lanza excepciones controladas.
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
            placeholder="Nombre del estudiante"
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
            placeholder="5to año / Egresado 2024 / 4to Año"
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
            placeholder="https://www.youtube.com/embed/..."
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

/**
 * Componente principal para la gestión de estudiantes.
 * Mantiene el estado local y delega la presentación a componentes pequeños
 * para reducir complejidad y facilitar mantenimiento.
 *
 * @returns {JSX.Element} Vista principal de gestión de estudiantes.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
export default function StudentManagement() {
  const { user } = useAuth();

  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [showForm, setShowForm] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingStudentId);

  /**
   * Mantiene el listado ordenado por nombre para una visualización consistente.
   */
  const sortedStudents = useMemo(
    () => sortStudentsByName(students),
    [students]
  );

  /**
   * Reinicia el formulario y limpia el modo edición.
   * Esto evita arrastrar datos de una operación anterior.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const resetFormState = () => {
    setShowForm(false);
    setEditingStudentId(null);
    setFormData(EMPTY_FORM);
  };

  /**
   * Abre el formulario en modo creación.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleNewStudent = () => {
    setEditingStudentId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  /**
   * Carga en el formulario la información del estudiante seleccionado.
   *
   * @param {object} student - Estudiante seleccionado para edición.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleEditStudent = (student) => {
    setEditingStudentId(student.id);
    setFormData({
      id: student.id,
      fullName: student.fullName,
      specialty: student.specialty,
      videoUrlEmbed: student.videoUrlEmbed,
    });
    setShowForm(true);
  };

  /**
   * Elimina un estudiante del listado actual.
   *
   * @param {string} studentId - Identificador del estudiante a eliminar.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleDeleteStudent = (studentId) => {
    setStudents((currentStudents) =>
      removeStudentFromCollection(currentStudents, studentId)
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
   * Actualiza el estado local del formulario según el campo modificado.
   *
   * @param {object} event - Evento de cambio disparado por un input.
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
   * Guarda un estudiante nuevo o actualiza uno existente.
   * La normalización previa evita almacenar espacios innecesarios y mantiene
   * consistencia en los valores persistidos.
   *
   * @param {object} event - Evento de envío del formulario.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedStudent = buildNormalizedStudent(
      formData,
      isEditing,
      editingStudentId
    );

    if (isEditing) {
      setStudents((currentStudents) =>
        updateStudentInCollection(
          currentStudents,
          editingStudentId,
          normalizedStudent
        )
      );
    } else {
      setStudents((currentStudents) =>
        addStudentToCollection(currentStudents, normalizedStudent)
      );
    }

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
            {sortedStudents.length > 0 ? (
              sortedStudents.map((student) => (
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