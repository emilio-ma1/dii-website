/**
 * @file EquipmentCard.jsx
 * @description 
 * Presentational card component for a single equipment item.
 * Handles the display of equipment metadata and binary image fallbacks.
 */
import { useState } from "react";

const DEFAULT_EQUIPMENT_IMAGE = "/images/impresora3d.jpg";

/**
 * Renders a visual card for an equipment item.
 *
 * @param {object} props The component props.
 * @param {object} props.item The equipment data object.
 * @param {Function} props.onEdit Callback to trigger edit mode.
 * @param {Function} props.onDelete Callback to trigger deletion.
 * @param {object} props.permissions The user permissions object for RBAC.
 * @returns {JSX.Element} The rendered equipment card.
 */
export function EquipmentCard({ item, onEdit, onDelete, permissions }) {
  const [imageError, setImageError] = useState(false);

  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        
        <div className="h-32 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 lg:h-32 lg:w-40 lg:min-w-40">
          <img
            src={imageError ? DEFAULT_EQUIPMENT_IMAGE : item.imageUrl}
            alt={item.name || "Equipamiento"}
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#722b4d]">{item.name}</h3>

          <p className="mt-2 text-sm leading-7 text-gray-600 line-clamp-3">
            {item.description || "Sin descripción."}
          </p>
        </div>

        <div className="flex items-center gap-3 self-end lg:self-center">
          {permissions.editEquipment && (
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#1f75b8] transition hover:bg-[#1f75b8]/10"
            >
              Editar
            </button>
          )}

          {permissions.deleteEquipment && (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
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