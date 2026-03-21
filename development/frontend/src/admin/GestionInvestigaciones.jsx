import { useState } from "react";
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

const DEFAULT_PROJECT_IMAGE = "/images/Inve-ejemplo1.png";

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
 * @returns {string}
 */
function getStatusBadgeStyles(status) {
  if (status === "completed") {
    return "bg-green-100 text-green-700";
  }

  return "bg-[#722b4d] text-white";
}

/**
 * Devuelve la imagen final del proyecto.
 *
 * @param {string} image
 * @returns {string}
 */
function resolveProjectImage(image) {
  return image?.trim() || DEFAULT_PROJECT_IMAGE;
}

/**
 * Estado vacío para cuando no existen proyectos registrados.
 *
 * @returns {JSX.Element}
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
 * @param {object} props
 * @param {string} props.status
 * @returns {JSX.Element}
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
 * @param {object} props
 * @param {string} props.topic
 * @returns {JSX.Element}
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
 * @param {object} props
 * @param {object} props.project
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 * @param {object} props.permissions
 * @returns {JSX.Element}
 */
function ProjectCard({ project, onEdit, onDelete, permissions }) {
  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="h-28 w-full overflow-hidden rounded-xl bg-gray-100 lg:w-28 lg:min-w-28">
          <img
            src={resolveProjectImage(project.image)}
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
 * @param {object} props
 * @param {object} props.formData
 * @param {Function} props.onChange
 * @param {Function} props.onSubmit
 * @param {Function} props.onCancel
 * @param {boolean} props.isEditing
 * @returns {JSX.Element}
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
            placeholder="Ingresa el título"
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
            placeholder="Ingresa el autor"
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
            placeholder="Ingresa el área"
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
            placeholder="Ingresa el año"
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
            placeholder="Ingresa el resumen"
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
            placeholder="Ingresa la descripción"
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
            placeholder="Ingresa la URL de la imagen"
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


export default function ResearchManagement() {
  const { user } = useAuth();

  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;

  const [projects] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingProjectId);

  /**
   * Reinicia el formulario y limpia el modo edición.
   */
  const resetFormState = () => {
    setShowForm(false);
    setEditingProjectId(null);
    setFormData(EMPTY_FORM);
  };

  /**
   * Abre el formulario en modo creación.
   */
  const handleNewProject = () => {
    setEditingProjectId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  /**
   * Carga en el formulario la información del proyecto seleccionado.
   *
   * @param {object} project
   */
  const handleEditProject = (project) => {
    setEditingProjectId(project.id);

    setFormData({
      id: project.id || "",
      title: project.title || "",
      author: project.author || "",
      topic: project.topic || "",
      year: project.year || "",
      summary: project.summary || "",
      description: project.description || "",
      image: project.image || "",
      status: project.status || "in_progress",
    });

    setShowForm(true);
  };


  const handleDeleteProject = () => {
  };

  /**
   * Cancela la operación actual y reinicia el formulario.
   */
  const handleCancelForm = () => {
    resetFormState();
  };

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
          Gestión de Investigaciones
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
            {projects.length > 0 ? (
              projects.map((project) => (
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