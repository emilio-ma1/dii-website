/**
 * @file NewsCard.jsx
 * @description Presentational component for displaying a news or event summary.
 */

const DEFAULT_IMAGE = "/images/Vinculacion-ejemplo.jpg";

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
  const imageUrl = newsItem.image_url?.trim() || DEFAULT_IMAGE;
  const isCurrentlyActive = newsItem.is_active;

  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="h-28 w-full overflow-hidden rounded-xl bg-gray-100 lg:w-32 lg:min-w-32">
          <img
            src={imageUrl}
            alt={newsItem.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#722b4d]">{newsItem.title}</h3>
          
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {newsItem.content}
          </p>

          <div className="mt-3 flex items-center gap-2">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeStyles(isCurrentlyActive)}`}>
              {isCurrentlyActive ? "Público (Vigente)" : "Oculto (Borrador)"}
            </span>
            <span className="text-sm text-gray-400">
              {new Date(newsItem.published_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-center">
          {permissions.editProject && (
            <button
              type="button"
              onClick={() => onEdit(newsItem)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#1f75b8] transition hover:bg-[#1f75b8]/10"
            >
              Editar
            </button>
          )}

          {permissions.deleteProject && (
            <button
              type="button"
              onClick={() => onDelete(newsItem.id)}
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