/**
 * @file NewsForm.jsx
 * @description Presentational form component for creating or editing news.
 */

/**
 * Renders the form to manage a news item.
 *
 * @param {object} props The component props.
 * @param {object} props.formData The current state of the form.
 * @param {Function} props.onChange Handler for input changes.
 * @param {Function} props.onSubmit Handler for form submission.
 * @param {Function} props.onCancel Handler to cancel the operation.
 * @param {boolean} props.isEditing Indicates if the form is in edit mode.
 * @param {boolean} props.isSaving Indicates if a network request is active.
 * @returns {JSX.Element} The rendered form.
 */
export function NewsForm({ formData, onChange, onSubmit, onCancel, isEditing, isSaving }) {
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-[#722b4d]/30 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Título del Evento o Noticia</label>
          <input
            type="text"
            name="title"
            placeholder="Ej: Charla de Innovación DII"
            value={formData.title}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">Contenido Completo</label>
          <textarea
            name="content"
            placeholder="Redacta el cuerpo de la noticia o los detalles del evento..."
            value={formData.content}
            onChange={onChange}
            rows={6}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#722b4d]">URL de la Imagen</label>
            <input
              type="url"
              name="image_url"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.image_url}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#722b4d]">Visibilidad</label>
            <select
              name="is_active"
              value={formData.is_active}
              onChange={onChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            >
              <option value={true}>Público (Vigente)</option>
              <option value={false}>Oculto (Borrador / Finalizado)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Guardando..." : isEditing ? "Guardar Cambios" : "Publicar Evento"}
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