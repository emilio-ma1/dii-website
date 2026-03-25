import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";

const DEFAULT_PERMISSIONS = {
  createEquipment: false,
  editEquipment: false,
  deleteEquipment: false,
};

const DEFAULT_ACCENT_COLOR = "#722b4d";
const DEFAULT_EQUIPMENT_IMAGE = "/images/impresora3d.jpg";

const EMPTY_FORM = {
  title: "",
  description: "",
  imageSrc: "",
};

/**
 * Construye el texto alternativo de la imagen a partir del título del equipo.
 *
 * @param {string} title
 * @returns {string}
 */
function buildEquipmentImageAlt(title) {
  return `Imagen de ${title.trim()}`;
}

/**
 * Resuelve la URL de imagen final del equipamiento.
 *
 * @param {string} imageSrc
 * @returns {string}
 */
function resolveEquipmentImageSrc(imageSrc) {
  return imageSrc.trim() || DEFAULT_EQUIPMENT_IMAGE;
}

/**
 * Construye un objeto de equipamiento a partir de los datos del formulario.
 *
 * @param {object} formData
 * @param {boolean} isEditing
 * @param {string|null} editingId
 * @returns {{
 *   id?: string,
 *   title: string,
 *   description: string,
 *   imageSrc: string,
 *   imageAlt: string,
 *   accentColor: string
 * }}
 */
function buildNormalizedEquipment(formData, isEditing, editingId) {
  const normalizedTitle = formData.title.trim();

  return {
    ...(isEditing && editingId ? { id: editingId } : {}),
    title: normalizedTitle,
    description: formData.description.trim(),
    imageSrc: resolveEquipmentImageSrc(formData.imageSrc),
    imageAlt: buildEquipmentImageAlt(normalizedTitle),
    accentColor: DEFAULT_ACCENT_COLOR,
  };
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
      No hay equipamiento registrado todavía.
    </div>
  );
}

function EquipmentCard({ item, onEdit, onDelete, permissions }) {
  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="h-32 w-full overflow-hidden rounded-xl bg-gray-100 lg:w-40 lg:min-w-40">
          <img
            src={item.imageSrc}
            alt={item.imageAlt}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-bold text-[#722b4d]">{item.title}</h3>

          <p className="mt-3 text-sm leading-7 text-gray-600">
            {item.description}
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

function EquipmentForm({ formData, onChange, onSubmit, onCancel, isEditing }) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[#722b4d]/30 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Título
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            placeholder="Ej: Impresora 3D"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={4}
            placeholder="Descripción del equipamiento"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Imagen Equipamiento
          </label>

          <label className="inline-flex cursor-pointer items-center rounded-xl bg-[#722b4d] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            Seleccionar imagen
            <input
              type="file"
              name="image_file"
              accept="image/*"
              onChange={onChange}
              className="hidden"
            />
          </label>

          <p className="mt-2 text-sm text-gray-500">
            {formData.image_file
              ? formData.image_file.name
              : formData.image_url
              ? "Ya hay una imagen cargada"
              : "No se ha seleccionado ninguna imagen"}
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
 * Componente principal para la gestión de equipamiento.
 *
 * @param {object} props
 * @param {Array<object>} props.items 
 * @param {(equipment: object) => void | Promise<void>} props.onCreate
 * @param {(id: string, equipment: object) => void | Promise<void>} props.onUpdate
 * @param {(id: string) => void | Promise<void>} props.onDelete
 * @returns {JSX.Element}
 */
export default function EquipmentManagement({
  items = [],
  onCreate,
  onUpdate,
  onDelete,
}) {
  const { user } = useAuth();

  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingId);

  const resetFormState = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleNewEquipment = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const handleEditEquipment = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title ?? "",
      description: item.description ?? "",
      imageSrc: item.imageSrc ?? "",
    });
    setShowForm(true);
  };

  const handleDeleteEquipment = async (itemId) => {
    if (onDelete) {
      await onDelete(itemId);
    }
  };

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEquipment = buildNormalizedEquipment(
      formData,
      isEditing,
      editingId
    );

    if (isEditing) {
      await onUpdate?.(editingId, normalizedEquipment);
    } else {
      await onCreate?.(normalizedEquipment);
    }

    resetFormState();
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
          Gestión de Equipamiento
        </h1>

        {permissions.createEquipment && (
          <button
            type="button"
            onClick={handleNewEquipment}
            className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            + Nuevo Equipamiento
          </button>
        )}
      </div>

      <div className="mt-8">
        {showForm ? (
          <EquipmentForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            isEditing={isEditing}
          />
        ) : (
          <div className="space-y-4">
            {items.length > 0 ? (
              items.map((item) => (
                <EquipmentCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditEquipment}
                  onDelete={handleDeleteEquipment}
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