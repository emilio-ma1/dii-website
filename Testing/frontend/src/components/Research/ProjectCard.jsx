/**
 * @file ProjectCard.jsx
 * @description Presentational component for displaying a research project summary.
 * Updated to fetch binary images and PDFs directly from the API.
 */
import { useState } from "react";

const STATUS_LABELS = {
  in_progress: "En proceso",
  completed: "Completada",
};

const DEFAULT_PROJECT_IMAGE = "/images/Inve-ejemplo1.png"; 

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
  return authors.map((author) => author.name || author.full_name).join(", ");
};
/**
 * Formats an ISO date string (YYYY-MM-DDTHH:mm:ss.sssZ) into DD-MM-YYYY.
 * @param {string} dateString The raw date string from the database.
 * @returns {string} The formatted date (e.g., 26-03-2026).
 */
const formatDate = (dateString) => {
  if (!dateString) return "Fecha no especificada";
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
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
  const [imageError, setImageError] = useState(false);
  const authorsText = formatAuthorsText(project.authors);

  const imageApiUrl = `${import.meta.env.VITE_API_URL}/api/projects/${project.id}/image`;
  const pdfApiUrl = `${import.meta.env.VITE_API_URL}/api/projects/${project.id}/pdf`;

  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        
        <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 lg:h-32 lg:w-32">
          <img
            src={imageError ? DEFAULT_PROJECT_IMAGE : imageApiUrl}
            alt={`Portada de ${project.title}`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#722b4d]">{project.title}</h3>

          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{project.abstract}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-[#722b4d] px-3 py-1 text-xs font-semibold text-white">
              {project.category_name || "Sin categoría"}
            </span>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeStyles(project.status)}`}>
              {STATUS_LABELS[project.status] || project.status}
            </span>
            <span className="text-sm font-medium text-gray-500">Fecha: {formatDate(project.year)}</span>
          </div>

          <p className="mt-3 text-sm font-medium text-gray-500">
            Por: <span className="font-normal">{authorsText}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-end lg:flex-col lg:items-end lg:justify-center lg:self-center">

          <a
            href={pdfApiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-[#722b4d] transition hover:bg-gray-200"
            title="Abrir documento PDF"
          >
            Ver Documento
          </a>

          <div className="flex gap-2">
            {permissions.editProject && (
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#1f75b8] transition hover:bg-[#1f75b8]/10"
              >
                Editar
              </button>
            )}

            {permissions.deleteProject && (
              <button
                type="button"
                onClick={() => onDelete(project.id)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Eliminar
              </button>
            )}
          </div>

        </div>
      </div>
    </article>
  );
}