/**
 * @file StudentForm.jsx
 * @description
 * Presentational form component for linking a public profile to an alumni/student account.
 * * Responsibilities:
 * - Render input fields for student metadata and profile image upload.
 * - Trigger form submission or cancellation.
 * * Out of Scope:
 * - State management, API calls, or FormData packaging (delegated to parent).
 */

/**
 * Renders the student/alumni profile form.
 *
 * @param {object} props The component props.
 * @param {object} props.formData Current state of the form inputs.
 * @param {Function} props.onChange Handler for input changes.
 * @param {Function} props.onSubmit Handler for form submission.
 * @param {Function} props.onCancel Handler to cancel the operation.
 * @param {Array<object>} props.eligibleUsers List of available user accounts to link.
 * @param {boolean} props.isEditing Indicates if the form is in edit mode.
 * @param {boolean} props.isSaving Indicates if a network request is currently active.
 * @returns {JSX.Element} The rendered form element.
 */
export function StudentForm({ 
  formData, 
  onChange, 
  onSubmit, 
  onCancel, 
  isEditing, 
  eligibleUsers,
  isSaving 
}) {
  return (
    <form 
      onSubmit={onSubmit} 
      noValidate 
      className="rounded-2xl border border-[#722b4d]/30 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">        
        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Vincular a Cuenta de Usuario
          </label>
          <select
            name="user_id"
            value={formData.user_id || ""}
            onChange={onChange}
            disabled={isEditing}
            className={`w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20 ${
              isEditing ? 'cursor-not-allowed bg-gray-100 text-gray-500' : 'bg-white'
            }`}
            required
          >
            <option value="" disabled>-- Selecciona un estudiante --</option>
            {isEditing && (
              <option value={formData.user_id}>{formData.fullName || "Estudiante Actual"} (Actual)</option>
            )}
            {eligibleUsers?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Año / Generación</label>
          <input
            type="text"
            name="specialty"
            value={formData.specialty || ""}
            onChange={onChange}
            placeholder="Ej: 5to año / Egresado 2024"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Carrera</label>
          <input
            type="text"
            name="degree"
            value={formData.degree || ""}
            onChange={onChange}
            placeholder="Ej: Ingeniería Civil Industrial"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Imagen del Estudiante
          </label>

          <label className="inline-flex cursor-pointer items-center rounded-xl bg-[#722b4d] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            {isEditing || formData.image_file ? "Cambiar imagen" : "Seleccionar imagen"}
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
              ? `Seleccionado: ${formData.image_file.name}`
              : isEditing
              ? "Sube un archivo nuevo para reemplazar la foto actual."
              : "Max 2MB. Formatos recomendados: JPG, PNG."}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Visibilidad del perfil</label>
          <select
            name="isProfilePublic"
            value={String(formData.isProfilePublic)}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          >
            <option value="true">Perfil público</option>
            <option value="false">Perfil privado</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">URL embed del video</label>
          <textarea
            name="videoUrlEmbed"
            value={formData.videoUrlEmbed || ""}
            onChange={onChange}
            rows={2}
            placeholder="Ingresa la URL embed del video (YouTube, Vimeo, etc.)"
            className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button 
          type="submit" 
          disabled={isSaving}
          className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Guardando..." : isEditing ? "Guardar Cambios" : "Crear Perfil"}
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          disabled={isSaving}
          className="rounded-xl bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}