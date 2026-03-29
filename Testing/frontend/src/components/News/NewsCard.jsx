/**
 * @file NewsCard.jsx
 * @description Presentational component for displaying a news or event summary.
 */
import { useState } from "react";

const DEFAULT_NEWS_IMAGE = "/images/Vinculacion-ejemplo.jpg";

/**
 * Resolves the CSS classes for the status badge.
 *
 * @param {boolean} isActive The active status of the news.
 * @returns {string} The CSS classes string.
 */
const getStatusBadgeStyles = (isActive) => {
  return isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700";
};

/**
 * Formats an ISO date string (YYYY-MM-DDTHH:mm:ss.sssZ) into DD-MM-YYYY.
 *
 * @param {string} dateString The raw date string from the database.
 * @returns {string} The formatted date.
 */
const formatDate = (dateString) => {
  if (!dateString) return "Fecha no especificada";
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
};

/**
 * Renders a visual card for a news item.
 *
 * @param {object} props The component props.
 * @param {object} props.newsItem The news data object.
 * @param {Function} props.onEdit Callback to trigger edit mode.
 * @param {Function} props.onDelete Callback to trigger deletion.
 * @param {object} props.permissions The user permissions object.
 * @returns {JSX.Element} The rendered card.
 */
export function NewsCard({ newsItem, onEdit, onDelete, permissions }) {
  const [imageError, setImageError] = useState(false);

  const imageApiUrl = `${import.meta.env.VITE_API_URL}/api/news/${newsItem.id}/image`;

  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        
        <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 lg:h-32 lg:w-32">
          <img
            src={imageError ? DEFAULT_NEWS_IMAGE : imageApiUrl}
            alt={`Portada de ${newsItem.title}`}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-[#722b4d]">{newsItem.title}</h3>
          </div>

          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{newsItem.content}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span 
              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeStyles(newsItem.is_active)}`}
            >
              {newsItem.is_active ? "Público" : "Oculto"}
            </span>

            <span className="text-sm font-medium text-gray-500">
              {formatDate(newsItem.published_at)}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-end lg:flex-col lg:items-end lg:justify-center lg:self-center">
          {permissions.editProject && (
            <button
              type="button"
              onClick={() => onEdit(newsItem)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-[#1f75b8] transition hover:bg-[#1f75b8]/10"
            >
              Editar
            </button>
          )}

          {permissions.deleteProject && (
            <button
              type="button"
              onClick={() => onDelete(newsItem.id)}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Eliminar
            </button>
          )}
        </div>

      </div>
    </article>
  );
}