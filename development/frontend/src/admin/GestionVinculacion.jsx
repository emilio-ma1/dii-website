import { useMemo, useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";

const DEFAULT_PERMISSIONS = {
  createProject: false,
  editProject: false,
  deleteProject: false,
  manageAccounts: false,
};

const STATUS_LABELS = {
  in_progress: "En proceso",
  completed: "Completado",
};

const DEFAULT_PROJECT_IMAGE = "/images/Vinculacion-ejemplo.jpg";

const INITIAL_PROJECTS = [
  {
    id: "1",
    title: "Ejemplo 1",
    author: "Autor",
    topic: "Tema",
    year: "2025",
    summary:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    description:"Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
    image: DEFAULT_PROJECT_IMAGE,
    status: "in_progress",
  },
];

const EMPTY_FORM = {
  id: "",
  title: "",
  author: "",
  topic: "",
  year: "",
  summary: "",
  description: "",
  image: "",
  status: "in_progress",
};

/**
 * Obtiene las clases visuales asociadas al estado del proyecto.
 *
 * @param {string} status - Estado actual del proyecto.
 * @returns {string} Clases CSS para representar el estado.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function getStatusBadgeStyles(status) {
  if (status === "completed") {
    return "bg-green-100 text-green-700";
  }

  return "bg-[#722b4d] text-white";
}

/**
 * Devuelve la imagen final del proyecto.
 * Si no se proporciona una URL, se utiliza la imagen por defecto.
 *
 * @param {string} image - URL de imagen ingresada en el formulario.
 * @returns {string} URL final de la imagen del proyecto.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function resolveProjectImage(image) {
  return image.trim() || DEFAULT_PROJECT_IMAGE;
}

/**
 * Normaliza el año del proyecto antes de guardarlo.
 *
 * @param {string} year - Año ingresado en el formulario.
 * @returns {string} Año normalizado.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function normalizeProjectYear(year) {
  return year.trim();
}

/**
 * Construye un objeto de proyecto normalizado a partir del formulario.
 *
 * @param {object} formData - Datos actuales del formulario.
 * @param {boolean} isEditing - Indica si la operación es una edición.
 * @param {string|null} editingProjectId - Identificador del proyecto en edición.
 * @returns {{
 *   id: string,
 *   title: string,
 *   author: string,
 *   topic: string,
 *   year: string,
 *   summary: string,
 *   description: string,
 *   image: string,
 *   status: string
 * }} Proyecto normalizado.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function buildNormalizedProject(formData, isEditing, editingProjectId) {
  return {
    id: isEditing ? editingProjectId : crypto.randomUUID(),
    title: formData.title.trim(),
    author: formData.author.trim(),
    topic: formData.topic.trim(),
    year: normalizeProjectYear(formData.year),
    summary: formData.summary.trim(),
    description: formData.description.trim(),
    image: resolveProjectImage(formData.image),
    status: formData.status,
  };
}

/**
 * Ordena la lista de proyectos alfabéticamente por título.
 *
 * @param {Array<object>} projects - Lista actual de proyectos.
 * @returns {Array<object>} Lista ordenada de proyectos.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function sortProjectsByTitle(projects) {
  return [...projects].sort((firstProject, secondProject) =>
    firstProject.title.localeCompare(secondProject.title)
  );
}

/**
 * Actualiza un proyecto dentro de la colección actual.
 *
 * @param {Array<object>} projects - Lista actual de proyectos.
 * @param {string} projectId - Identificador del proyecto a actualizar.
 * @param {object} updatedProject - Proyecto actualizado.
 * @returns {Array<object>} Lista de proyectos actualizada.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function updateProjectInCollection(projects, projectId, updatedProject) {
  return projects.map((project) =>
    project.id === projectId ? updatedProject : project
  );
}

/**
 * Agrega un nuevo proyecto a la colección actual.
 *
 * @param {Array<object>} projects - Lista actual de proyectos.
 * @param {object} newProject - Proyecto a agregar.
 * @returns {Array<object>} Lista de proyectos actualizada.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function addProjectToCollection(projects, newProject) {
  return [...projects, newProject];
}

/**
 * Elimina un proyecto de la colección actual.
 *
 * @param {Array<object>} projects - Lista actual de proyectos.
 * @param {string} projectId - Identificador del proyecto a eliminar.
 * @returns {Array<object>} Lista filtrada de proyectos.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function removeProjectFromCollection(projects, projectId) {
  return projects.filter((project) => project.id !== projectId);
}

/**
 * Estado vacío para cuando no existen proyectos registrados.
 *
 * @returns {JSX.Element} Mensaje visual de estado vacío.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
      No hay proyectos registrados todavía.
    </div>
  );
}

/**
 * Badge visual para el estado del proyecto.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.status - Estado actual del proyecto.
 * @returns {JSX.Element} Badge visual del estado.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeStyles(status)}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

/**
 * Badge visual para el área temática del proyecto.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.topic - Área temática del proyecto.
 * @returns {JSX.Element} Badge del tema.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function TopicBadge({ topic }) {
  return (
    <span className="inline-flex rounded-full bg-[#722b4d] px-3 py-1 text-xs font-semibold text-white">
      {topic}
    </span>
  );
}

/**
 * Tarjeta visual de un proyecto para el panel de gestión.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.project - Proyecto a mostrar.
 * @param {Function} props.onEdit - Acción para editar el proyecto.
 * @param {Function} props.onDelete - Acción para eliminar el proyecto.
 * @param {object} props.permissions - Permisos disponibles para el usuario actual.
 * @returns {JSX.Element} Tarjeta del proyecto.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function ProjectCard({ project, onEdit, onDelete, permissions }) {
  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="h-28 w-full overflow-hidden rounded-xl bg-gray-100 lg:w-28 lg:min-w-28">
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#722b4d]">{project.title}</h3>

          <p className="mt-1 text-sm text-gray-600">{project.summary}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <TopicBadge topic={project.topic} />
            <StatusBadge status={project.status} />
            <span className="text-sm text-gray-500">{project.year}</span>
          </div>

          <p className="mt-3 text-sm text-gray-500">Por: {project.author}</p>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-center">
          {permissions.editProject && (
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#1f75b8] transition hover:bg-[#1f75b8]/10"
            >
              Editar
            </button>
          )}

          {permissions.deleteProject && (
            <button
              type="button"
              onClick={() => onDelete(project.id)}
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
 * Formulario reutilizable para crear o editar proyectos.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.formData - Datos actuales del formulario.
 * @param {Function} props.onChange - Acción al modificar un campo.
 * @param {Function} props.onSubmit - Acción al enviar el formulario.
 * @param {Function} props.onCancel - Acción al cancelar la operación.
 * @param {boolean} props.isEditing - Indica si el formulario está en modo edición.
 * @returns {JSX.Element} Formulario de proyecto.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function ProjectForm({ formData, onChange, onSubmit, onCancel, isEditing }) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[#722b4d]/30 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Título
          </label>
          <input
            type="text"
            name="title"
            placeholder="Título"
            value={formData.title}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Autor
          </label>
          <input
            type="text"
            name="author"
            placeholder="Autor"
            value={formData.author}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Área
          </label>
          <input
            type="text"
            name="topic"
            placeholder="Área"
            value={formData.topic}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Año
          </label>
          <input
            type="text"
            name="year"
            placeholder="Año"
            value={formData.year}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Resumen
          </label>
          <textarea
            name="summary"
            placeholder="Resumen"
            value={formData.summary}
            onChange={onChange}
            rows={3}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Descripción
          </label>
          <textarea
            name="description"
            placeholder="Descripción"
            value={formData.description}
            onChange={onChange}
            rows={5}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            URL imagen
          </label>
          <input
            type="text"
            name="image"
            placeholder="URL imagen"
            value={formData.image}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Estado
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          >
            <option value="in_progress">En proceso</option>
            <option value="completed">Completado</option>
          </select>
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
 * Componente principal para la gestión de vinculación con el medio.
 * Mantiene el estado local y delega la representación visual a componentes
 * de presentación para reducir complejidad y mejorar mantenibilidad.
 *
 * @returns {JSX.Element} Vista principal de gestión de vinculación con el medio.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
export default function CommunityEngagementManagement() {
  const { user } = useAuth();

  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingProjectId);

  /**
   * Mantiene el listado ordenado por título para una visualización consistente.
   */
  const sortedProjects = useMemo(
    () => sortProjectsByTitle(projects),
    [projects]
  );

  /**
   * Reinicia el formulario y limpia el modo edición.
   * Esto evita arrastrar datos entre operaciones consecutivas.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const resetFormState = () => {
    setShowForm(false);
    setEditingProjectId(null);
    setFormData(EMPTY_FORM);
  };

  /**
   * Abre el formulario en modo creación.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleNewProject = () => {
    setEditingProjectId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  /**
   * Carga en el formulario la información del proyecto seleccionado.
   *
   * @param {object} project - Proyecto seleccionado para edición.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleEditProject = (project) => {
    setEditingProjectId(project.id);
    setFormData({
      id: project.id,
      title: project.title,
      author: project.author,
      topic: project.topic,
      year: project.year,
      summary: project.summary,
      description: project.description,
      image: project.image,
      status: project.status,
    });
    setShowForm(true);
  };

  /**
   * Elimina un proyecto del listado actual.
   *
   * @param {string} projectId - Identificador del proyecto a eliminar.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleDeleteProject = (projectId) => {
    setProjects((currentProjects) =>
      removeProjectFromCollection(currentProjects, projectId)
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
   * Guarda un proyecto nuevo o actualiza uno existente.
   * La normalización previa evita persistir espacios innecesarios y asegura
   * consistencia en los datos derivados.
   *
   * @param {object} event - Evento de envío del formulario.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedProject = buildNormalizedProject(
      formData,
      isEditing,
      editingProjectId
    );

    if (isEditing) {
      setProjects((currentProjects) =>
        updateProjectInCollection(
          currentProjects,
          editingProjectId,
          normalizedProject
        )
      );
    } else {
      setProjects((currentProjects) =>
        addProjectToCollection(currentProjects, normalizedProject)
      );
    }

    resetFormState();
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
          Gestión de Vinculación con el Medio
        </h1>

        {permissions.createProject && (
          <button
            type="button"
            onClick={handleNewProject}
            className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            + Nuevo Proyecto
          </button>
        )}
      </div>

      <div className="mt-8">
        {showForm ? (
          <ProjectForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            isEditing={isEditing}
          />
        ) : (
          <div className="space-y-4">
            {sortedProjects.length > 0 ? (
              sortedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
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