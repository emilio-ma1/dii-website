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

const INITIAL_EQUIPMENT = [
  {
    id: crypto.randomUUID(),
    title: "Impresora 3D",
    description:
      "Equipo utilizado para prototipado rápido en proyectos de ingeniería.",
    imageSrc: DEFAULT_EQUIPMENT_IMAGE,
    imageAlt: "Imagen de Impresora 3D",
    accentColor: DEFAULT_ACCENT_COLOR,
  },
];

const EMPTY_FORM = {
  title: "",
  description: "",
  imageSrc: "",
};

/**
 * Construye el texto alternativo de la imagen a partir del título del equipo.
 *
 * @param {string} title - Título del equipamiento.
 * @returns {string} Texto alternativo para la imagen.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function buildEquipmentImageAlt(title) {
  return `Imagen de ${title.trim()}`;
}

/**
 * Resuelve la URL de imagen final del equipamiento.
 * Si no se proporciona una URL, se utiliza una imagen por defecto.
 *
 * @param {string} imageSrc - URL de imagen ingresada en el formulario.
 * @returns {string} URL final de la imagen.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function resolveEquipmentImageSrc(imageSrc) {
  return imageSrc.trim() || DEFAULT_EQUIPMENT_IMAGE;
}

/**
 * Construye un objeto de equipamiento normalizado a partir de los datos del formulario.
 *
 * @param {object} formData - Datos actuales del formulario.
 * @param {boolean} isEditing - Indica si la operación es una edición.
 * @param {string|null} editingId - Identificador del ítem en edición.
 * @returns {{
 *   id: string,
 *   title: string,
 *   description: string,
 *   imageSrc: string,
 *   imageAlt: string,
 *   accentColor: string
 * }} Objeto de equipamiento normalizado.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function buildNormalizedEquipment(formData, isEditing, editingId) {
  const normalizedTitle = formData.title.trim();

  return {
    id: isEditing ? editingId : crypto.randomUUID(),
    title: normalizedTitle,
    description: formData.description.trim(),
    imageSrc: resolveEquipmentImageSrc(formData.imageSrc),
    imageAlt: buildEquipmentImageAlt(normalizedTitle),
    accentColor: DEFAULT_ACCENT_COLOR,
  };
}

/**
 * Actualiza un elemento de equipamiento dentro de la colección actual.
 *
 * @param {Array<object>} items - Lista actual de equipamiento.
 * @param {string} itemId - Identificador del elemento a actualizar.
 * @param {object} updatedItem - Elemento actualizado.
 * @returns {Array<object>} Lista de equipamiento actualizada.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function updateEquipmentInCollection(items, itemId, updatedItem) {
  return items.map((item) => (item.id === itemId ? updatedItem : item));
}

/**
 * Agrega un nuevo elemento de equipamiento a la colección actual.
 *
 * @param {Array<object>} items - Lista actual de equipamiento.
 * @param {object} newItem - Elemento a agregar.
 * @returns {Array<object>} Lista de equipamiento actualizada.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function addEquipmentToCollection(items, newItem) {
  return [...items, newItem];
}

/**
 * Elimina un elemento de equipamiento de la colección actual.
 *
 * @param {Array<object>} items - Lista actual de equipamiento.
 * @param {string} itemId - Identificador del elemento a eliminar.
 * @returns {Array<object>} Lista filtrada de equipamiento.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function removeEquipmentFromCollection(items, itemId) {
  return items.filter((item) => item.id !== itemId);
}

/**
 * Estado vacío para el caso en que no existan elementos de equipamiento.
 *
 * @returns {JSX.Element} Mensaje visual de estado vacío.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
      No hay equipamiento registrado todavía.
    </div>
  );
}

/**
 * Tarjeta visual para mostrar un elemento de equipamiento.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.item - Elemento de equipamiento a mostrar.
 * @param {Function} props.onEdit - Acción para editar el elemento.
 * @param {Function} props.onDelete - Acción para eliminar el elemento.
 * @param {object} props.permissions - Permisos disponibles para el usuario actual.
 * @returns {JSX.Element} Tarjeta de equipamiento.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
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

/**
 * Formulario reutilizable para crear o editar equipamiento.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.formData - Datos actuales del formulario.
 * @param {Function} props.onChange - Acción al modificar un campo.
 * @param {Function} props.onSubmit - Acción al enviar el formulario.
 * @param {Function} props.onCancel - Acción al cancelar la operación.
 * @param {boolean} props.isEditing - Indica si el formulario está en modo edición.
 * @returns {JSX.Element} Formulario de equipamiento.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
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
            URL de imagen
          </label>
          <input
            type="text"
            name="imageSrc"
            value={formData.imageSrc}
            onChange={onChange}
            placeholder="URL imagen"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          />
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
 * Mantiene el estado local y delega la representación visual a componentes
 * pequeños para mejorar legibilidad, mantenibilidad y testeabilidad.
 *
 * @returns {JSX.Element} Vista principal de gestión de equipamiento.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
export default function EquipmentManagement() {
  const { user } = useAuth();

  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;
  const [items, setItems] = useState(INITIAL_EQUIPMENT);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingId);

  /**
   * Reinicia el formulario y limpia el modo edición.
   * Esto evita reutilizar datos de una operación anterior por accidente.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const resetFormState = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  /**
   * Abre el formulario en modo creación.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleNewEquipment = () => {
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  /**
   * Carga en el formulario los datos del elemento seleccionado para su edición.
   *
   * @param {object} item - Elemento de equipamiento seleccionado.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleEditEquipment = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      description: item.description,
      imageSrc: item.imageSrc,
    });
    setShowForm(true);
  };

  /**
   * Elimina un elemento de equipamiento del listado actual.
   *
   * @param {string} itemId - Identificador del elemento a eliminar.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleDeleteEquipment = (itemId) => {
    setItems((currentItems) =>
      removeEquipmentFromCollection(currentItems, itemId)
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
   * Guarda un elemento nuevo o actualiza uno existente.
   * La normalización previa evita persistir espacios innecesarios y asegura
   * valores derivados consistentes, como imageAlt e imageSrc.
   *
   * @param {object} event - Evento de envío del formulario.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedEquipment = buildNormalizedEquipment(
      formData,
      isEditing,
      editingId
    );

    if (isEditing) {
      setItems((currentItems) =>
        updateEquipmentInCollection(
          currentItems,
          editingId,
          normalizedEquipment
        )
      );
    } else {
      setItems((currentItems) =>
        addEquipmentToCollection(currentItems, normalizedEquipment)
      );
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