/**
 * @file UserForm.jsx
 * @description Presentational component for creating and updating user accounts.
 */

const ROLE_OPTIONS = [
  { value: "admin", label: "Administrador" },
  { value: "alumni", label: "Egresado" },
  { value: "teacher", label: "Docente" },
];

/**
 * Renders the form to manage user account data.
 *
 * @param {object} props The component props.
 * @param {object} props.formData The current state of the form.
 * @param {Function} props.onChange Handler for input changes.
 * @param {Function} props.onSubmit Handler for form submission.
 * @param {Function} props.onCancel Handler to cancel the operation.
 * @param {boolean} props.isEditing Indicates if the form is in edit mode.
 * @param {boolean} props.isSaving Indicates if a network request is currently active.
 * @returns {JSX.Element} The rendered form.
 */
export function UserForm({ formData, onChange, onSubmit, onCancel, isEditing, isSaving }) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-[#722b4d]/30 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Nombre completo</label>
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
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Correo electrónico</label>
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
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Rol</label>
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
            placeholder={isEditing ? "Dejar vacío para no cambiarla" : "Contraseña"}
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
          {isSaving ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Usuario"}
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