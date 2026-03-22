/**
 * @file StudentForm.jsx
 * @description Presentational component for the student creation/edition form.
 */

export function StudentForm({ formData, onChange, onSubmit, onCancel, isEditing, eligibleUsers }) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-[#722b4d]/30 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">        
        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Vincular a Cuenta de Usuario
          </label>
          <select
            name="user_id"
            value={formData.user_id}
            onChange={onChange}
            disabled={isEditing}
            className={`w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20 ${isEditing ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`}
            required
          >
            <option value="">-- Selecciona un estudiante --</option>
            {isEditing && (
              <option value={formData.user_id}>{formData.fullName} (Actual)</option>
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
            value={formData.specialty}
            onChange={onChange}
            placeholder="5to año / Egresado 2024"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20 transition"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Carrera</label>
          <input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={onChange}
            placeholder="Ingeniería Civil Industrial"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20 transition"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">URL de imagen</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={onChange}
            placeholder="/images/foto-docente.png"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20 transition"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Visibilidad del perfil</label>
          <select
            name="isProfilePublic"
            value={String(formData.isProfilePublic)}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20 transition"
          >
            <option value="true">Perfil público</option>
            <option value="false">Perfil privado</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">URL embed del video</label>
          <textarea
            name="videoUrlEmbed"
            value={formData.videoUrlEmbed}
            onChange={onChange}
            rows={2}
            placeholder="Ingresa la URL embed del video"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20 transition"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
          {isEditing ? "Guardar Cambios" : "Guardar"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-xl bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-300">
          Cancelar
        </button>
      </div>
    </form>
  );
}