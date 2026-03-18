import { useMemo, useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";

const DEFAULT_PERMISSIONS = {
  createProject: false,
  editProject: false,
  deleteProject: false,
  manageAccounts: false,
};

const ROLE_OPTIONS = [
  { value: "admin", label: "Administrador" },
  { value: "graduate", label: "Egresado" },
  { value: "teacher", label: "Docente" },
];

const INITIAL_USERS = [
  {
    id: "1",
    fullName: "Nombre Secretaria",
    email: "admin@userena.cl",
    role: "admin",
  },
  {
    id: "2",
    fullName: "Nombre Egresado",
    email: "egresado@userena.cl",
    role: "graduate",
  },
  {
    id: "3",
    fullName: "Nombre Docente",
    email: "docente@userena.cl",
    role: "teacher",
  },
];

const EMPTY_FORM = {
  id: "",
  fullName: "",
  email: "",
  password: "",
  role: "teacher",
};

/**
 * Obtiene la etiqueta visible asociada a un rol.
 *
 * @param {string} role - Identificador interno del rol.
 * @returns {string} Etiqueta visible del rol.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function getRoleLabel(role) {
  return ROLE_OPTIONS.find((option) => option.value === role)?.label || role;
}

/**
 * Devuelve el estilo visual correspondiente a un rol.
 *
 * @param {string} role - Identificador interno del rol.
 * @returns {string} Clases CSS para el badge del rol.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function getRoleBadgeStyles(role) {
  if (role === "admin") {
    return "bg-[#722b4d]/10 text-[#722b4d]";
  }

  if (role === "graduate") {
    return "bg-blue-100 text-blue-700";
  }

  return "bg-gray-100 text-gray-700";
}

/**
 * Normaliza los datos del formulario antes de guardarlos.
 *
 * @param {object} formData - Datos actuales del formulario.
 * @param {boolean} isEditing - Indica si se está editando un usuario.
 * @param {string|null} editingUserId - Identificador del usuario en edición.
 * @returns {{ id: string, fullName: string, email: string, role: string }} Usuario normalizado.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function buildNormalizedUser(formData, isEditing, editingUserId) {
  return {
    id: isEditing ? editingUserId : crypto.randomUUID(),
    fullName: formData.fullName.trim(),
    email: formData.email.trim().toLowerCase(),
    role: formData.role,
  };
}

/**
 * Ordena los usuarios alfabéticamente por nombre completo.
 *
 * @param {Array<object>} users - Lista de usuarios.
 * @returns {Array<object>} Lista ordenada de usuarios.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function sortUsersByName(users) {
  return [...users].sort((firstUser, secondUser) =>
    firstUser.fullName.localeCompare(secondUser.fullName)
  );
}

/**
 * Actualiza un usuario dentro de la colección actual.
 *
 * @param {Array<object>} users - Lista actual de usuarios.
 * @param {string} userId - Identificador del usuario a actualizar.
 * @param {object} updatedUser - Datos actualizados del usuario.
 * @returns {Array<object>} Lista de usuarios actualizada.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function updateUserInCollection(users, userId, updatedUser) {
  return users.map((user) => (user.id === userId ? updatedUser : user));
}

/**
 * Elimina un usuario de la colección actual.
 *
 * @param {Array<object>} users - Lista actual de usuarios.
 * @param {string} userId - Identificador del usuario a eliminar.
 * @returns {Array<object>} Lista de usuarios filtrada.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function removeUserFromCollection(users, userId) {
  return users.filter((user) => user.id !== userId);
}

/**
 * Agrega un usuario a la colección actual.
 *
 * @param {Array<object>} users - Lista actual de usuarios.
 * @param {object} newUser - Usuario a agregar.
 * @returns {Array<object>} Lista de usuarios actualizada.
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function addUserToCollection(users, newUser) {
  return [...users, newUser];
}

/**
 * Reinicia el estado del formulario y mensajes asociados.
 *
 * @param {Function} setShowForm - Setter para mostrar u ocultar el formulario.
 * @param {Function} setEditingUserId - Setter del usuario en edición.
 * @param {Function} setFormData - Setter de los datos del formulario.
 * @param {Function} setMessage - Setter del mensaje de éxito.
 * @param {Function} setErrorMessage - Setter del mensaje de error.
 * @returns {void}
 * @throws {Error} Esta función no lanza excepciones controladas.
 */
function resetFormState(
  setShowForm,
  setEditingUserId,
  setFormData,
  setMessage,
  setErrorMessage
) {
  setShowForm(false);
  setEditingUserId(null);
  setFormData(EMPTY_FORM);
  setMessage("");
  setErrorMessage("");
}

/**
 * Badge visual para representar el rol del usuario.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.role - Rol del usuario.
 * @returns {JSX.Element} Badge del rol.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function RoleBadge({ role }) {
  const styles = getRoleBadgeStyles(role);

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles}`}
    >
      {getRoleLabel(role)}
    </span>
  );
}

/**
 * Tarjeta de presentación de un usuario.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.user - Usuario a mostrar.
 * @param {Function} props.onEdit - Acción para editar el usuario.
 * @param {Function} props.onDelete - Acción para eliminar el usuario.
 * @param {boolean} props.canDelete - Indica si el usuario puede eliminarse.
 * @returns {JSX.Element} Tarjeta visual del usuario.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function UserCard({ user, onEdit, onDelete, canDelete }) {
  return (
    <article className="rounded-2xl border border-[#722b4d]/20 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#722b4d]/10 text-lg font-bold text-[#722b4d]">
          {user.fullName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-[#722b4d]">{user.fullName}</h3>
          <p className="mt-1 text-sm text-gray-500">{user.email}</p>

          <div className="mt-3">
            <RoleBadge role={user.role} />
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

/**
 * Formulario reutilizable para crear o editar usuarios.
 *
 * @param {object} props - Propiedades del componente.
 * @param {object} props.formData - Datos actuales del formulario.
 * @param {Function} props.onChange - Acción al cambiar un campo.
 * @param {Function} props.onSubmit - Acción al enviar el formulario.
 * @param {Function} props.onCancel - Acción al cancelar.
 * @param {boolean} props.isEditing - Indica si el formulario está en modo edición.
 * @param {boolean} props.isSaving - Indica si la operación de guardado está en progreso.
 * @returns {JSX.Element} Formulario de usuario.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function UserForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  isSaving,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-[#722b4d]/30 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            Correo electrónico
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="correo@userena.cl"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Rol
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Contraseña {isEditing && <span className="text-gray-400">(opcional)</span>}
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder={
              isEditing ? "Dejar vacío para no cambiarla" : "Contraseña"
            }
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required={!isEditing}
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving
            ? "Guardando..."
            : isEditing
              ? "Guardar Cambios"
              : "Crear Usuario"}
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
 * Muestra un mensaje de estado para éxito o error.
 *
 * @param {object} props - Propiedades del componente.
 * @param {string} props.message - Texto del mensaje.
 * @param {"success"|"error"} props.variant - Variante visual del mensaje.
 * @returns {JSX.Element|null} Componente de mensaje o null si no hay contenido.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function FeedbackMessage({ message, variant }) {
  if (!message) {
    return null;
  }

  const styles =
    variant === "success"
      ? "border-green-200 bg-green-50 text-green-700"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div className={`mt-6 rounded-xl border px-4 py-3 text-sm ${styles}`}>
      {message}
    </div>
  );
}

/**
 * Estado vacío cuando no hay usuarios registrados.
 *
 * @returns {JSX.Element} Mensaje de lista vacía.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
      No hay usuarios registrados todavía.
    </div>
  );
}

/**
 * Vista de acceso denegado cuando el usuario no posee permisos suficientes.
 *
 * @returns {JSX.Element} Mensaje de acceso denegado.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
function AccessDeniedState() {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
      <h1 className="text-2xl font-bold">Acceso denegado</h1>
      <p className="mt-2 text-sm">
        No tienes permisos para acceder a la gestión de cuentas.
      </p>
    </div>
  );
}

/**
 * Componente principal para la gestión de cuentas.
 * Centraliza el estado y delega la representación visual a componentes pequeños
 * para mejorar legibilidad, mantenibilidad y testeabilidad.
 *
 * @returns {JSX.Element} Vista principal de gestión de cuentas.
 * @throws {Error} Este componente no lanza excepciones controladas.
 */
export default function AccountManagement() {
  const { user, register } = useAuth();

  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;
  const [users, setUsers] = useState(INITIAL_USERS);
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const isEditing = Boolean(editingUserId);

  /**
   * Mantiene el listado visible ordenado por nombre para que la interfaz sea
   * predecible y fácil de recorrer.
   */
  const sortedUsers = useMemo(() => sortUsersByName(users), [users]);

  /**
   * Limpia mensajes previos antes de iniciar una nueva acción visible para el usuario.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const clearFeedbackMessages = () => {
    setMessage("");
    setErrorMessage("");
  };

  /**
   * Reinicia por completo el estado asociado al formulario.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const resetLocalFormState = () => {
    resetFormState(
      setShowForm,
      setEditingUserId,
      setFormData,
      setMessage,
      setErrorMessage
    );
  };

  /**
   * Abre el formulario en modo creación.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleNewUser = () => {
    setEditingUserId(null);
    setFormData(EMPTY_FORM);
    clearFeedbackMessages();
    setShowForm(true);
  };

  /**
   * Carga en el formulario la información de un usuario para editarlo.
   *
   * @param {object} selectedUser - Usuario seleccionado.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleEditUser = (selectedUser) => {
    setEditingUserId(selectedUser.id);
    setFormData({
      id: selectedUser.id,
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      password: "",
      role: selectedUser.role,
    });
    clearFeedbackMessages();
    setShowForm(true);
  };

  /**
   * Elimina un usuario del listado local y deja un mensaje de confirmación.
   *
   * @param {string} userId - Identificador del usuario a eliminar.
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleDeleteUser = (userId) => {
    setUsers((currentUsers) => removeUserFromCollection(currentUsers, userId));
    setErrorMessage("");
    setMessage("Usuario eliminado correctamente.");
  };

  /**
   * Cancela la operación actual y restablece el formulario.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleCancelForm = () => {
    resetLocalFormState();
  };

  /**
   * Actualiza el estado local del formulario según el campo modificado.
   *
   * @param {object} event - Evento de cambio de un input.
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
   * Guarda los cambios de un usuario existente en el estado local.
   *
   * @returns {void}
   * @throws {Error} Esta función no lanza excepciones controladas.
   */
  const handleUpdateUser = () => {
    const normalizedUser = buildNormalizedUser(
      formData,
      true,
      editingUserId
    );

    setUsers((currentUsers) =>
      updateUserInCollection(currentUsers, editingUserId, normalizedUser)
    );

    setIsSaving(false);
    setShowForm(false);
    setEditingUserId(null);
    setFormData(EMPTY_FORM);
    setMessage("Usuario actualizado correctamente.");
  };

  /**
   * Registra un nuevo usuario utilizando el servicio de autenticación.
   *
   * @returns {Promise<void>}
   * @throws {Error} Esta función no lanza excepciones controladas; comunica errores vía estado.
   */
  const handleCreateUser = async () => {
    const result = await register({
      full_name: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      role: formData.role,
    });

    if (!result.ok) {
      setErrorMessage(result.message || "No se pudo crear el usuario.");
      setIsSaving(false);
      return;
    }

    const normalizedUser = buildNormalizedUser(formData, false, null);

    setUsers((currentUsers) =>
      addUserToCollection(currentUsers, normalizedUser)
    );

    setIsSaving(false);
    setShowForm(false);
    setEditingUserId(null);
    setFormData(EMPTY_FORM);
    setMessage(result.message || "Usuario creado exitosamente.");
  };

  /**
   * Procesa el envío del formulario y decide si corresponde crear o editar.
   *
   * @param {object} event - Evento de envío del formulario.
   * @returns {Promise<void>}
   * @throws {Error} Esta función no lanza excepciones controladas; comunica errores vía estado.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    clearFeedbackMessages();

    if (isEditing) {
      handleUpdateUser();
      return;
    }

    await handleCreateUser();
  };

  if (!permissions.manageAccounts) {
    return <AccessDeniedState />;
  }

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
          Gestión de Cuentas
        </h1>

        <button
          type="button"
          onClick={handleNewUser}
          className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
        >
          + Nuevo Usuario
        </button>
      </div>

      <FeedbackMessage message={message} variant="success" />
      <FeedbackMessage message={errorMessage} variant="error" />

      <div className="mt-8">
        {showForm ? (
          <UserForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={handleCancelForm}
            isEditing={isEditing}
            isSaving={isSaving}
          />
        ) : (
          <div className="space-y-4">
            {sortedUsers.length > 0 ? (
              sortedUsers.map((listedUser) => (
                <UserCard
                  key={listedUser.id}
                  user={listedUser}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                  canDelete={listedUser.id !== user?.id}
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