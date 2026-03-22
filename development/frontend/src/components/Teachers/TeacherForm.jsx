/**
 * @file TeacherForm.jsx
 * @description Presentational form component for linking a public profile to a user account.
 */

export function TeacherForm({ formData, onChange, onSubmit, onCancel, availableUsers, isEditing, isSaving }) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-[#722b4d]/30 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Cuenta de Usuario (Docente)</label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={onChange}
            disabled={isEditing}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] disabled:bg-gray-100"
            required
          >
            <option value="" disabled>Selecciona una cuenta de docente...</option>
            {availableUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name} ({user.email})
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">El nombre y correo se sincronizarán automáticamente con esta cuenta.</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Grado Académico</label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={onChange}
            placeholder="Ej: Doctor en Ciencias de la Computación"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d]"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Área de Especialización</label>
          <input
            type="text"
            name="area"
            value={formData.area}
            onChange={onChange}
            placeholder="Ej: Inteligencia Artificial, Machine Learning"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d]"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">URL de la Fotografía (Opcional)</label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={onChange}
            placeholder="https://ejemplo.com/foto-perfil.jpg"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d]"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? "Guardando..." : isEditing ? "Actualizar Perfil" : "Crear Perfil"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-300">
          Cancelar
        </button>
      </div>
    </form>
  );
}