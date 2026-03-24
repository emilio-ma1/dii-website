import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";

const DEFAULT_PERMISSIONS = {
  createContact: false,
  editContact: false,
  deleteContact: false,
};

const EMPTY_FORM = {
  sectionId: "",
  fullName: "",
  initials: "",
  role: "",
};

/**
 * Obtiene los estilos visuales asociados al color de una sección.
 *
 * @param {string} color - Identificador del color de la sección.
 * @returns {{ badge: string, title: string }} Clases de Tailwind para la insignia y el título.
 */
function getSectionStyles(color) {
  if (color === "blue") {
    return {
      badge: "bg-[#1f75b8] text-white",
      title: "text-[#1f75b8]",
    };
  }

  if (color === "dark") {
    return {
      badge: "bg-[#2f2f2f] text-white",
      title: "text-[#2f2f2f]",
    };
  }

  return {
    badge: "bg-[#722b4d] text-white",
    title: "text-[#722b4d]",
  };
}

/**
 * Tarjeta de un contacto individual.
 *
 * @param {object} props
 * @param {object} props.person
 * @param {string} props.sectionColor
 * @param {object} props.permissions
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 * @returns {JSX.Element}
 */
function ContactPersonCard({
  person,
  sectionColor,
  onEdit,
  onDelete,
  permissions,
}) {
  const styles = getSectionStyles(sectionColor);

  return (
    <article className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-sm font-bold ${styles.badge}`}
          >
            {person.initials}
          </div>

          <div className="min-w-0">
            <h3 className="break-words text-lg font-bold text-[#722b4d]">
              {person.fullName}
            </h3>
            <p className="mt-1 break-words text-sm text-gray-600">
              {person.role}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {permissions.editContact && (
            <button
              type="button"
              onClick={onEdit}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[#1f75b8] transition hover:bg-[#1f75b8]/10"
            >
              Editar
            </button>
          )}

          {permissions.deleteContact && (
            <button
              type="button"
              onClick={onDelete}
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
 * Estado vacío para una sección sin contactos.
 *
 * @returns {JSX.Element}
 */
function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
      No hay contactos registrados todavía.
    </div>
  );
}

/**
 * Bloque de presentación de una sección.
 *
 * @param {object} props
 * @param {object} props.section
 * @param {object} props.permissions
 * @param {Function} props.onEditPerson
 * @param {Function} props.onDeletePerson
 * @returns {JSX.Element}
 */
function SectionBlock({ section, permissions, onEditPerson, onDeletePerson }) {
  const styles = getSectionStyles(section.color);

  return (
    <section className="rounded-2xl border border-[#722b4d]/10 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className={`text-2xl font-extrabold ${styles.title}`}>
          {section.title}
        </h2>
        <p className="mt-1 text-sm text-gray-600">{section.description}</p>
      </div>

      {section.people?.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {section.people.map((person) => (
            <ContactPersonCard
              key={person.id}
              person={person}
              sectionColor={section.color}
              permissions={permissions}
              onEdit={() => onEditPerson(section.id, person)}
              onDelete={() => onDeletePerson(section.id, person.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

/**
 * Formulario para crear o editar contactos.
 *
 * @param {object} props
 * @param {object} props.formData
 * @param {Function} props.onChange
 * @param {Function} props.onSubmit
 * @param {Function} props.onCancel
 * @param {boolean} props.isEditing
 * @param {Array<object>} props.sections
 * @returns {JSX.Element}
 */
function ContactForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  sections,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[#722b4d]/30 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Sección
          </label>
          <select
            name="sectionId"
            value={formData.sectionId}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          >
            <option value="">Selecciona una sección</option>
            {sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Nombre completo
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={onChange}
            placeholder="Ingresa el nombre completo"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Iniciales
          </label>
          <input
            type="text"
            name="initials"
            value={formData.initials}
            onChange={onChange}
            placeholder="Ingresa las iniciales"
            maxLength={3}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 uppercase outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Cargo
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={onChange}
            placeholder="Ingresa el cargo"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
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

export default function ContactManagement() {
  const { user } = useAuth();

  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;

  const [sections] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingSectionId && editingPersonId);

  const resetFormState = () => {
    setShowForm(false);
    setEditingSectionId(null);
    setEditingPersonId(null);
    setFormData(EMPTY_FORM);
  };

  const handleNewContact = () => {
    resetFormState();
    setShowForm(true);
  };

  const handleEditPerson = (sectionId, person) => {
    setEditingSectionId(sectionId);
    setEditingPersonId(person.id);
    setFormData({
      sectionId,
      fullName: person.fullName || "",
      initials: person.initials || "",
      role: person.role || "",
    });
    setShowForm(true);
  };

  const handleDeletePerson = () => {
  };

  const handleCancelForm = () => {
    resetFormState();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: name === "initials" ? value.toUpperCase() : value,
    }));
  };


  const handleSubmit = (event) => {
    event.preventDefault();

    resetFormState();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
            Gestión de Contactos
          </h1>

          {permissions.createContact && (
            <button
              type="button"
              onClick={handleNewContact}
              className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
            >
              + Nuevo Contacto
            </button>
          )}
        </div>

        <div className="mt-8">
          {showForm ? (
            <ContactForm
              formData={formData}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={handleCancelForm}
              isEditing={isEditing}
              sections={sections}
            />
          ) : (
            <div className="space-y-6">
              {sections.length > 0 ? (
                sections.map((section) => (
                  <SectionBlock
                    key={section.id}
                    section={section}
                    permissions={permissions}
                    onEditPerson={handleEditPerson}
                    onDeletePerson={handleDeletePerson}
                  />
                ))
              ) : (
                <EmptyState />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}