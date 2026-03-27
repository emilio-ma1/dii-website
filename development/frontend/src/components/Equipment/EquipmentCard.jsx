/**
 * @file EquipmentCard.jsx
 * @description Presentational card component for a single equipment item.
 */

const DEFAULT_EQUIPMENT_IMAGE = "/images/impresora3d.jpg";

function resolveEquipmentImageSrc(imageUrl) {
  return imageUrl?.trim() || DEFAULT_EQUIPMENT_IMAGE;
}

export function EquipmentCard({ item, onEdit, onDelete, permissions }) {
  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="h-32 w-full overflow-hidden rounded-xl bg-gray-100 lg:w-40 lg:min-w-40">
          <img
            src={resolveEquipmentImageSrc(item.image_url || item.imageUrl)}
            alt={item.name || "Equipamiento"}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[#722b4d]">{item.name}</h3>

          <p className="mt-3 text-sm leading-7 text-gray-600">
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