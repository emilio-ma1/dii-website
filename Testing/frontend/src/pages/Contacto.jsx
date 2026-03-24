import { useMemo, useState } from "react";

/**
 * Lista de contactos del departamento.
 * Cada contacto incluye la información necesaria
 * para mostrar la tarjeta y enviar el mensaje.
 */
const CONTACT_GROUPS = [
  {
    id: "autoridades",
    title: "Autoridades del Departamento",
    description: "Máxima autoridad académica y administrativa.",
    accentColor: "#722b4d",
    contacts: [
      {
        id: "domingo-vega",
        initials: "DV",
        fullName: "Domingo Vega Toro",
        role: "Director del Departamento",
      },
      {
        id: "secretaria",
        initials: "SS",
        fullName: "Nombre Secretaria",
        role: "Secretaria del Departamento",
      },
    ],
  },
  {
    id: "academica",
    title: "Área Académica",
    description: "Coordinadores y responsables de área.",
    accentColor: "#1f78c1",
    contacts: [
      {
        id: "alejandro-alvarez",
        initials: "AA",
        fullName: "Alejandro Álvarez",
        role: "Coordinador Académico ICI",
      },
      {
        id: "ejemplo",
        initials: "EE",
        fullName: "Ejemplo",
        role: "ICI",
      },
      {
        id: "ejemplo-2",
        initials: "EE",
        fullName: "Ejemplo",
        role: "ICI",
      },
      {
        id: "ejemplo-4",
        initials: "EE",
        fullName: "Ejemplo",
        role: "ICI",
      },
    ],
  },
  {
    id: "desarrollo",
    title: "Equipo de Desarrollo",
    description: "Desarrolladores del sitio web del DII.",
    accentColor: "#2f2f2f",
    contacts: [
      {
        id: "matias-wormald",
        initials: "MW",
        fullName: "Matias Wormald",
        role: "PMO",
      },
      {
        id: "felipe-urqueta",
        initials: "FU",
        fullName: "Felipe Urqueta",
        role: "Diseñador UX/UI",
      },
      {
        id: "emilio-maturana",
        initials: "EM",
        fullName: "Emilio Maturana",
        role: "Desarrollador BackEnd",
      },
      {
        id: "joselyn-montaño",
        initials: "JM",
        fullName: "Joselyn Montaño",
        role: "Desarrollador FrontEnd",
      },
    ],
  },
  {
    id: "qa",
    title: "Equipo de QA",
    description: "Aseguramiento de calidad del sitio web.",
    accentColor: "#7a7a7a",
    contacts: [
      {
        id: "adolfo-toledo",
        initials: "AT",
        fullName: "Adolfo Toledo",
        role: "PMO QA Testing/Doc",
      },
      {
        id: "edinson-godoy",
        initials: "EG",
        fullName: "Edinson Godoy",
        role: "QA Tester/Doc",
      },
    ],
  },
];

/**
 * Renderiza el ícono decorativo utilizado en los encabezados de sección.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.color - Color de acento aplicado al fondo del ícono.
 * @returns {JSX.Element} El ícono de sección renderizado.
 */
function SectionIcon({ color }) {
  return (
    <span
      className="flex h-8 w-8 items-center justify-center rounded-md text-white"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6v6l4 2M4 7h16M5 21h14a1 1 0 001-1V8a1 1 0 00-1-1H5a1 1 0 00-1 1v12a1 1 0 001 1z"
        />
      </svg>
    </span>
  );
}

/**
 * Renderiza una tarjeta individual de contacto dentro del directorio.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object} props.contact - Información del contacto a mostrar.
 * @param {string} props.accentColor - Color de acento asociado al grupo del contacto.
 * @param {Function} props.onOpen - Función que abre el modal del contacto seleccionado.
 * @returns {JSX.Element} La tarjeta de contacto renderizada.
 */
function ContactCard({ contact, accentColor, onOpen }) {
  const isDirector = contact.role.toLowerCase().includes("director");

  const cardContent = (
    <div className="flex items-start gap-4">
      <span
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
        style={{ backgroundColor: accentColor }}
      >
        {contact.initials}
      </span>

      <div>
        <h3 className="text-lg font-bold leading-tight text-[#722b4d]">
          {contact.fullName}
        </h3>
        <p className="mt-1 text-sm text-gray-600">{contact.role}</p>
      </div>
    </div>
  );

  if (isDirector) {
    return (
      <article className="w-full rounded-md border border-black/10 bg-white p-4 text-left shadow-sm">
        {cardContent}
      </article>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(contact)}
      className="w-full rounded-md border border-black/10 bg-white p-4 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      {cardContent}
    </button>
  );
}

/**
 * Renderiza el encabezado visual de un grupo de contactos.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.title - Título del grupo.
 * @param {string} props.description - Descripción breve del grupo.
 * @param {string} props.accentColor - Color de acento usado en título e ícono.
 * @returns {JSX.Element} El encabezado del grupo renderizado.
 */
function ContactGroupHeader({ title, description, accentColor }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      <SectionIcon color={accentColor} />
      <div>
        <h2
          className="text-2xl font-bold"
          style={{ color: accentColor }}
        >
          {title}
        </h2>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

/**
 * Renderiza un separador visual entre grupos del directorio.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.color - Color de acento del elemento central del separador.
 * @returns {JSX.Element} El separador renderizado.
 */
function SectionDivider({ color }) {
  return (
    <div className="my-12 flex items-center gap-4">
      <div className="h-px flex-1 bg-gray-300" />
      <span
        className="block h-4 w-4"
        style={{
          backgroundColor: color,
          clipPath:
            "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
        }}
      />
      <div className="h-px flex-1 bg-gray-300" />
    </div>
  );
}

/**
 * Renderiza el modal de contacto con el formulario para enviar un mensaje.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Object|null} props.selectedContact - Contacto actualmente seleccionado.
 * @param {Function} props.onClose - Función que cierra el modal.
 * @returns {JSX.Element|null} El modal renderizado o null si no hay contacto seleccionado.
 */
function ContactModal({ selectedContact, onClose }) {
  const [formData, setFormData] = useState({
    senderName: "",
    senderEmail: "",
    message: "",
  });

  if (!selectedContact) return null;

  /**
   * Actualiza el estado del formulario en función del campo editado.
   *
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - Evento de cambio del campo.
   */
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Procesa el envío del formulario de contacto.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - Evento submit del formulario.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    console.log("Enviar mensaje a:", selectedContact.id, formData);

    alert(`Mensaje preparado para ${selectedContact.fullName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between bg-[#722b4d] px-5 py-4 text-white">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-sm font-bold">
              {selectedContact.initials}
            </span>

            <div>
              <h3 className="text-lg font-bold leading-tight">
                {selectedContact.fullName}
              </h3>
              <p className="text-sm text-white/80">{selectedContact.role}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-white/70 transition hover:text-white"
            aria-label="Cerrar formulario"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-gray-700">
              Tu nombre
            </label>
            <input
              type="text"
              name="senderName"
              value={formData.senderName}
              onChange={handleChange}
              placeholder="Nombre completo"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-gray-700">
              Tu correo electrónico
            </label>
            <input
              type="email"
              name="senderEmail"
              value={formData.senderEmail}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className="w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-gray-700">
              Mensaje
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder={`Escribe tu mensaje para ${selectedContact.fullName}...`}
              rows={5}
              className="w-full resize-none rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[#722b4d] px-4 py-3 font-semibold text-white transition hover:opacity-95"
          >
            Enviar mensaje
          </button>
        </form>
      </div>
    </div>
  );
}

/**
 * Renderiza el bloque hero superior de la página de contacto.
 *
 * @returns {JSX.Element} La sección hero renderizada.
 */
function ContactHero() {
  return (
    <section className="bg-[#722b4d] text-white">
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-24 lg:pt-32 lg:pb-28">
        <div className="max-w-2xl">
          <span className="inline-block rounded bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
            Directorio
          </span>

          <h1 className="mt-4 text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Contacto
          </h1>

          <p className="mt-6 text-base leading-8 text-white/90 sm:text-lg">
            Encuentra al equipo del Departamento de Ingeniería Industrial.
            Haz clic en cualquier persona para enviar un mensaje directo.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Renderiza la página de contacto con los grupos del directorio
 * y el modal de envío de mensajes.
 *
 * @returns {JSX.Element} La página de contacto renderizada.
 */
export default function Contacto() {
  const [selectedContact, setSelectedContact] = useState(null);

  /**
   * Se memoriza la referencia de los grupos para mantener una estructura estable
   * durante los renders del componente.
   */
  const allGroups = useMemo(() => CONTACT_GROUPS, []);

  /**
   * Abre el modal con la información del contacto seleccionado.
   *
   * @param {Object} contact - Contacto seleccionado por el usuario.
   */
  const openModal = (contact) => setSelectedContact(contact);

    /**
   * Cierra el modal y limpia el contacto seleccionado.
   */
  const closeModal = () => setSelectedContact(null);

  return (
    <div className="min-h-screen bg-white">
      <ContactHero />

      <section
        className="bg-[#f7f5f6] py-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(114,43,77,0.08) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {allGroups.map((group, index) => (
            <div key={group.id}>
              <ContactGroupHeader
                title={group.title}
                description={group.description}
                accentColor={group.accentColor}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                {group.contacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    accentColor={group.accentColor}
                    onOpen={openModal}
                  />
                ))}
              </div>

              {index < allGroups.length - 1 && (
                <SectionDivider color={group.accentColor} />
              )}
            </div>
          ))}
        </div>
      </section>
      <ContactModal
        selectedContact={selectedContact}
        onClose={closeModal}
      />
    </div>
  );
}