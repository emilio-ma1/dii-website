/**
 * @file UserCard.jsx
 * @description Presentational component for displaying individual user summaries.
 */

const ROLE_OPTIONS = [
  { value: "admin", label: "Administrador" },
  { value: "alumni", label: "Egresado" },
  { value: "teacher", label: "Docente" },
];

/**
 * Resolves the visual label for a given role code.
 *
 * @param {string} role The role code from the database.
 * @returns {string} The human-readable role label.
 */
const getRoleLabel = (role) => {
  return ROLE_OPTIONS.find((option) => option.value === role)?.label || role;
};

/**
 * Resolves the CSS classes for a given role badge.
 *
 * @param {string} role The role code from the database.
 * @returns {string} The CSS classes string.
 */
const getRoleBadgeStyles = (role) => {
  if (role === "admin") return "bg-[#722b4d]/10 text-[#722b4d]";
  if (role === "alumni") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-700";
};

/**
 * Renders a visual card for a user account.
 *
 * @param {object} props The component props.
 * @param {object} props.user The user data object.
 * @param {Function} props.onEdit Callback to trigger the edit mode.
 * @param {Function} props.onDelete Callback to trigger the deletion.
 * @param {boolean} props.canDelete Indicates if the current user can be deleted.
 * @returns {JSX.Element} The rendered user card.
 */
export function UserCard({ user, onEdit, onDelete, canDelete }) {
  const initialLetter = user.fullName?.charAt(0)?.toUpperCase() || "U";
  const badgeStyles = getRoleBadgeStyles(user.role);

  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#722b4d]/10 text-lg font-bold text-[#722b4d]">
          {initialLetter}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#722b4d]">{user.fullName}</h3>
          <p className="mt-1 text-sm text-gray-500">{user.email}</p>
          <div className="mt-3">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles}`}>
              {getRoleLabel(user.role)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-center">
          <button
            type="button"
            onClick={() => onEdit(user)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-[#1f75b8] transition hover:bg-[#1f75b8]/10"
          >
            Editar
          </button>
          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(user.id)}
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