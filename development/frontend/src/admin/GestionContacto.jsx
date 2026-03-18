import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";

const DEFAULT_PERMISSIONS = {
  createContact: false,
  editContact: false,
  deleteContact: false,
};

const INITIAL_SECTIONS = [
  {
    id: "authorities",
    title: "Autoridades del Departamento",
    description: "Máxima autoridad académica y administrativa.",
    color: "purple",
    people: [
      {
        id: "1",
        initials: "DV",
        fullName: "Domingo Vega Toro",
        role: "Director del Departamento",
      },
      {
        id: "2",
        initials: "SS",
        fullName: "Nombre Secretaria",
        role: "Secretaria del Departamento",
      },
    ],
  },
  {
    id: "academic-area",
    title: "Área Académica",
    description: "Coordinadores y responsables de área.",
    color: "blue",
    people: [
      {
        id: "3",
        initials: "AA",
        fullName: "Alejandro Álvarez",
        role: "Coordinador Académico ICI",
      },
      {
        id: "4",
        initials: "EE",
        fullName: "Ejemplo",
        role: "ICI",
      },
      {
        id: "5",
        initials: "EE",
        fullName: "Ejemplo",
        role: "ICI",
      },
      {
        id: "6",
        initials: "EE",
        fullName: "Ejemplo",
        role: "ICI",
      },
    ],
  },
  {
    id: "development-team",
    title: "Equipo de Desarrollo",
    description: "Desarrolladores del sitio web del DII.",
    color: "dark",
    people: [
      {
        id: "7",
        initials: "MW",
        fullName: "Matias Wormald",
        role: "PMO",
      },
      {
        id: "8",
        initials: "FU",
        fullName: "Felipe Urqueta",
        role: "Diseñador UX/UI",
      },
      {
        id: "9",
        initials: "EM",
        fullName: "Emilio Maturana",
        role: "Desarrollador BackEnd",
      },
      {
        id: "10",
        initials: "JM",
        fullName: "Joselyn Montaño",
        role: "Desarrollador FrontEnd",
      },
    ],
  },
  {
    id: "qa-team",
    title: "Equipo de QA",
    description: "Aseguramiento de calidad del sitio web.",
    color: "dark",
    people: [
      {
        id: "11",
        initials: "AT",
        fullName: "Adolfo Toledo",
        role: "PMO QA Testing/Doc",
      },
      {
        id: "12",
        initials: "EG",
        fullName: "Edinson Godoy",
        role: "QA Tester/Doc",
      },
    ],
  },
];

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
 * @throws {Error} Esta función no lanza excepciones controladas.
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
 * Normaliza los datos del formulario para asegurar consistencia antes de persistirlos
 * en el estado local.
 *
 * @param {object} formData - Datos actuales del formulario.
 * @param {boolean} isEditing - Indica si la operación es una edición.
 * @param {string|null} editingPersonId - Identificador de la persona editada.
 * @returns {{ id: string, initials: string, fullName: string, role: string }} Persona normalizada.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function buildNormalizedPerson(formData, isEditing, editingPersonId) {
  return {
    id: isEditing ? editingPersonId : crypto.randomUUID(),
    initials: formData.initials.trim().toUpperCase(),
    fullName: formData.fullName.trim(),
    role: formData.role.trim(),
  };
}

/**
 * Actualiza una persona dentro de la misma sección.
 *
 * @param {Array<object>} sections - Secciones actuales.
 * @param {string} sectionId - Identificador de la sección objetivo.
 * @param {string} personId - Identificador de la persona que se actualizará.
 * @param {object} updatedPerson - Persona con los datos actualizados.
 * @returns {Array<object>} Nuevo arreglo de secciones actualizado.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function updatePersonInSameSection(sections, sectionId, personId, updatedPerson) {
  return sections.map((section) => {
    if (section.id !== sectionId) {
      return section;
    }

    return {
      ...section,
      people: section.people.map((person) =>
        person.id === personId ? updatedPerson : person
      ),
    };
  });
}

/**
 * Mueve una persona desde una sección de origen a una de destino.
 *
 * @param {Array<object>} sections - Secciones actuales.
 * @param {string} sourceSectionId - Identificador de la sección de origen.
 * @param {string} targetSectionId - Identificador de la sección de destino.
 * @param {string} personId - Identificador de la persona a mover.
 * @param {object} updatedPerson - Persona ya normalizada.
 * @returns {Array<object>} Nuevo arreglo de secciones actualizado.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function movePersonToAnotherSection(
  sections,
  sourceSectionId,
  targetSectionId,
  personId,
  updatedPerson
) {
  return sections.map((section) => {
    if (section.id === sourceSectionId) {
      return {
        ...section,
        people: section.people.filter((person) => person.id !== personId),
      };
    }

    if (section.id === targetSectionId) {
      return {
        ...section,
        people: [...section.people, updatedPerson],
      };
    }

    return section;
  });
}

/**
 * Agrega una nueva persona a la sección seleccionada.
 *
 * @param {Array<object>} sections - Secciones actuales.
 * @param {string} targetSectionId - Identificador de la sección destino.
 * @param {object} person - Persona a agregar.
 * @returns {Array<object>} Nuevo arreglo de secciones actualizado.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function addPersonToSection(sections, targetSectionId, person) {
  return sections.map((section) => {
    if (section.id !== targetSectionId) {
      return section;
    }

    return {
      ...section,
      people: [...section.people, person],
    };
  });
}

/**
 * Elimina una persona de una sección específica.
 *
 * @param {Array<object>} sections - Secciones actuales.
 * @param {string} sectionId - Identificador de la sección.
 * @param {string} personId - Identificador de la persona a eliminar.
 * @returns {Array<object>} Nuevo arreglo de secciones actualizado.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function removePersonFromSection(sections, sectionId, personId) {
  return sections.map((section) => {
    if (section.id !== sectionId) {
      return section;
    }

    return {
      ...section,
      people: section.people.filter((person) => person.id !== personId),
    };
  });
}

/**
 * Determina si la edición mantiene a la persona en la misma sección.
 *
 * @param {string|null} editingSectionId - Sección original de la persona.
 * @param {string} selectedSectionId - Sección elegida en el formulario.
 * @returns {boolean} True si la persona permanece en la misma sección.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function isEditingInSameSection(editingSectionId, selectedSectionId) {
  return editingSectionId === selectedSectionId;
}

/**
 * Tarjeta de presentación para un contacto individual.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.person - Persona a mostrar.
 * @param {string} props.sectionColor - Color asociado a la sección.
 * @param {object} props.permissions - Permisos disponibles para acciones.
 * @param {Function} props.onEdit - Acción de edición.
 * @param {Function} props.onDelete - Acción de eliminación.
 * @returns {JSX.Element} Tarjeta visual del contacto.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function ContactPersonCard({ person, sectionColor, onEdit, onDelete, permissions }) {
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
            <h3 className="text-lg font-bold text-[#722b4d] break-words">
              {person.fullName}
            </h3>
            <p className="mt-1 text-sm text-gray-600 break-words">
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
 * Bloque de presentación para una sección y sus contactos.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.section - Información de la sección.
 * @param {object} props.permissions - Permisos del usuario actual.
 * @param {Function} props.onEditPerson - Acción para editar una persona.
 * @param {Function} props.onDeletePerson - Acción para eliminar una persona.
 * @returns {JSX.Element} Sección renderizada con sus contactos.
 * @throws {Error} Este componente no lanza excepciones controladas.
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
    </section>
  );
}

/**
 * Formulario reutilizable para crear o editar contactos.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.formData - Datos actuales del formulario.
 * @param {Function} props.onChange - Acción al modificar un campo.
 * @param {Function} props.onSubmit - Acción al enviar el formulario.
 * @param {Function} props.onCancel - Acción para cancelar la edición.
 * @param {boolean} props.isEditing - Indica si se está editando un contacto existente.
 * @param {Array<object>} props.sections - Secciones disponibles para asignación.
 * @returns {JSX.Element} Formulario de contacto.
 * @throws {Error} Este componente no lanza excepciones controladas.
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
            placeholder="Nombre completo"
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
            placeholder="DV"
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
            placeholder="Director del Departamento"
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

/**
 * Mensaje vacío para el caso en que no existan contactos registrados.
 *
 * @returns {JSX.Element} Estado vacío del listado.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
      No hay contactos registrados todavía.
    </div>
  );
}

/**
 * Componente principal de gestión de contactos.
 * Este componente actúa como contenedor de estado y delega la presentación
 * a componentes más pequeños para reducir la sobrecarga visual y lógica.
 *
 * @returns {JSX.Element} Vista principal de gestión de contactos.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
export default function ContactManagement() {
  const { user } = useAuth();

  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [showForm, setShowForm] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingPersonId, setEditingPersonId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingSectionId && editingPersonId);

  /**
   * Reinicia completamente el flujo de edición para evitar que queden datos
   * residuales al alternar entre creación y edición.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const resetFormState = () => {
    setShowForm(false);
    setEditingSectionId(null);
    setEditingPersonId(null);
    setFormData(EMPTY_FORM);
  };

  /**
   * Abre el formulario en modo creación.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleNewContact = () => {
    resetFormState();
    setShowForm(true);
  };

  /**
   * Carga los datos de una persona en el formulario para editarla.
   *
   * @param {string} sectionId - Identificador de la sección actual.
   * @param {object} person - Persona seleccionada.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleEditPerson = (sectionId, person) => {
    setEditingSectionId(sectionId);
    setEditingPersonId(person.id);
    setFormData({
      sectionId,
      fullName: person.fullName,
      initials: person.initials,
      role: person.role,
    });
    setShowForm(true);
  };

  /**
   * Elimina una persona de la sección indicada.
   *
   * @param {string} sectionId - Identificador de la sección.
   * @param {string} personId - Identificador de la persona a eliminar.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleDeletePerson = (sectionId, personId) => {
    setSections((currentSections) =>
      removePersonFromSection(currentSections, sectionId, personId)
    );
  };

  /**
   * Cancela la operación actual y restablece el estado del formulario.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleCancelForm = () => {
    resetFormState();
  };

  /**
   * Actualiza el estado del formulario a partir del campo modificado.
   * Las iniciales se fuerzan a mayúsculas para mantener consistencia de
   * visualización y almacenamiento.
   *
   * @param {object} event - Evento del input modificado.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousFormData) => ({
      ...previousFormData,
      [name]: name === "initials" ? value.toUpperCase() : value,
    }));
  };

  /**
   * Resuelve la operación de guardado del formulario según el modo actual:
   * creación, edición en la misma sección o traslado a otra sección.
   *
   * @param {Array<object>} currentSections - Estado actual de las secciones.
   * @param {object} normalizedPerson - Persona normalizada.
   * @returns {Array<object>} Nuevo estado de secciones.
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const resolveSectionsAfterSubmit = (currentSections, normalizedPerson) => {
    if (!isEditing) {
      return addPersonToSection(
        currentSections,
        formData.sectionId,
        normalizedPerson
      );
    }

    if (isEditingInSameSection(editingSectionId, formData.sectionId)) {
      return updatePersonInSameSection(
        currentSections,
        editingSectionId,
        editingPersonId,
        normalizedPerson
      );
    }

    return movePersonToAnotherSection(
      currentSections,
      editingSectionId,
      formData.sectionId,
      editingPersonId,
      normalizedPerson
    );
  };

  /**
   * Guarda un contacto nuevo o actualiza uno existente.
   * La normalización previa evita persistir espacios innecesarios o diferencias
   * de mayúsculas/minúsculas en campos relevantes como las iniciales.
   *
   * @param {object} event - Evento de envío del formulario.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const normalizedPerson = buildNormalizedPerson(
      formData,
      isEditing,
      editingPersonId
    );

    setSections((currentSections) =>
      resolveSectionsAfterSubmit(currentSections, normalizedPerson)
    );

    resetFormState();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
            Gestión de Contacto
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