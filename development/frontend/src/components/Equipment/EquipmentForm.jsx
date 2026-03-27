/**
 * @file EquipmentForm.jsx
 * @description Presentational component for equipment creation/edition form.
 */

export function EquipmentForm({
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
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Nombre del equipamiento
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onChange}
            placeholder="Impresora 3D"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Descripción
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            rows={4}
            placeholder="Describe el equipamiento"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Imagen del equipamiento
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
              ? "Ya hay una imagen cargada para este equipamiento"
              : "No se ha seleccionado ninguna imagen"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving
            ? "Guardando..."
            : isEditing
            ? "Guardar Cambios"
            : "Guardar"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-xl bg-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}