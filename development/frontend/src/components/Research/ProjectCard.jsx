/**
 * @file ProjectCard.jsx
 * @description Presentational component for displaying a research project summary.
 */

const STATUS_LABELS = {
  in_progress: "En proceso",
  completed: "Completado",
};

const DEFAULT_PROJECT_IMAGE = "/images/Inve-ejemplo1.png";

/**
 * Resolves the project image URL or provides a fallback default image.
 *
 * @param {string} imageUrl The URL of the image from the database.
 * @returns {string} The resolved image URL.
 */
const resolveProjectImage = (imageUrl) => {
  return imageUrl?.trim() || DEFAULT_PROJECT_IMAGE;
};

/**
 * Determines the CSS classes for the status badge.
 *
 * @param {string} status The project status.
 * @returns {string} The CSS class string.
 */
const getStatusBadgeStyles = (status) => {
  return status === "completed" ? "bg-green-100 text-green-700" : "bg-[#722b4d] text-white";
};

/**
 * Formats the authors list into a readable string.
 *
 * @param {Array<object>} authors The list of authors.
 * @returns {string} A comma-separated string of author names.
 */
const formatAuthorsText = (authors) => {
  if (!Array.isArray(authors) || authors.length === 0) {
    return "Autores no especificados";
  }
  // ¡Aquí está la magia! Buscamos 'name' (que envía el backend) o 'full_name' como respaldo
  return authors.map((author) => author.name || author.full_name).join(", ");
};

/**
 * Renders a visual card for a research project.
 *
 * @param {object} props The component props.
 * @param {object} props.project The project data object.
 * @param {Function} props.onEdit Callback to edit the project.
 * @param {Function} props.onDelete Callback to delete the project.
 * @param {object} props.permissions The user permissions object.
 * @returns {JSX.Element} The rendered project card.
 */
export function ProjectCard({ project, onEdit, onDelete, permissions }) {
  const authorsText = formatAuthorsText(project.authors);

  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="h-28 w-full overflow-hidden rounded-xl bg-gray-100 lg:w-28 lg:min-w-28">
          <img
            src={resolveProjectImage(project.image_url)}
            alt={project.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#722b4d]">{project.title}</h3>

          <p className="mt-1 text-sm text-gray-600">{project.abstract}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-[#722b4d] px-3 py-1 text-xs font-semibold text-white">
              {project.category_name || "Sin categoría"}
            </span>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeStyles(project.status)}`}>
              {STATUS_LABELS[project.status] || project.status}
            </span>
            <span className="text-sm text-gray-500">{project.year}</span>
          </div>

          <p className="mt-3 text-sm text-gray-500">Por: {authorsText}</p>
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