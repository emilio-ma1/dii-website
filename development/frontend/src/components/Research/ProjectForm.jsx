/**
 * @file ProjectForm.jsx
 * @description Presentational form component for creating or editing projects.
 */

import { AuthorAutocomplete } from "./AuthorAutocomplete";

/**
 * Renders the form to create or edit a research project.
 *
 * @param {object} props Component properties.
 * @param {object} props.formData The current state of the form.
 * @param {Function} props.onChange Handler for input changes.
 * @param {Function} props.onSubmit Handler for form submission.
 * @param {Function} props.onCancel Handler to cancel the operation.
 * @param {boolean} props.isEditing Indicates if the form is in edit mode.
 * @param {Array<object>} props.availableUsers List of users available to be authors.
 * @param {Function} props.setFormData State setter for the form data.
 * @param {Array<object>} props.categories List of available categories.
 * @returns {JSX.Element} The rendered form.
 */
export function ProjectForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  isEditing,
  availableUsers,
  setFormData,
  categories
}) {
  
  /**
   * Adds a selected author to the form data.
   *
   * @param {object} user The user to add as an author.
   */
  const handleAddAuthor = (user) => {
    setFormData((prev) => ({
      ...prev,
      authors: [...prev.authors, user],
    }));
  };

  /**
   * Removes an author from the form data by ID.
   *
   * @param {number|string} userId The ID of the user to remove.
   */
  const handleRemoveAuthor = (userId) => {
    setFormData((prev) => ({
      ...prev,
      authors: prev.authors.filter((a) => a.id !== userId),
    }));
  };

  /**
   * Sets the publication date field to today's date (YYYY-MM-DD format).
   */
  const setDateToToday = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const formattedDate = today.toISOString().split('T')[0];

    onChange({
      target: {
        name: 'year',
        value: formattedDate,
        type: 'date'
      }
    });
  };
  
  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-[#722b4d]/30 bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Título
          </label>
          <input
            type="text"
            name="title"
            placeholder="Ingresa el título del proyecto"
            value={formData.title || ''}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div className="md:col-span-2"> 
          <AuthorAutocomplete
            availableUsers={availableUsers}
            selectedAuthors={formData.authors || []}
            onAddAuthor={handleAddAuthor}
            onRemoveAuthor={handleRemoveAuthor}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Categoría (Área)
          </label>
          <select
            name="category_id"
            value={formData.category_id || ''}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          >
            <option value="" disabled>Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Fecha de Publicación
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              name="year" 
              value={formData.year || ''}
              onChange={onChange}
              className="w-full flex-1 rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
              required
            />
            <button
              type="button"
              onClick={setDateToToday}
              className="shrink-0 rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-[#722b4d] transition hover:bg-gray-200"
              title="Establecer fecha de hoy"
            >
              Hoy
            </button>
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Resumen (Abstract)
          </label>
          <textarea
            name="abstract"
            placeholder="Ingresa el resumen público de la investigación"
            value={formData.abstract || ''}
            onChange={onChange}
            rows={4}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Documento del Proyecto (PDF)
          </label>

          <label className="inline-flex cursor-pointer items-center rounded-xl bg-[#722b4d] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            Seleccionar PDF
            <input
              type="file"
              name="pdf_file"
              accept="application/pdf"
              onChange={onChange}
              className="hidden"
            />
          </label>

          <p className="mt-2 text-sm text-gray-500">
            {formData.pdf_file
              ? formData.pdf_file.name
              : isEditing
              ? "Ya hay un documento guardado. Sube otro para reemplazarlo."
              : "No se ha seleccionado ningún documento (Max 5MB)"}
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Imagen del proyecto
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
              : isEditing
              ? "Ya hay una imagen guardada. Sube otra para reemplazarla."
              : "No se ha seleccionado ninguna imagen (Max 2MB)"}
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[#722b4d]">
            Estado de la Investigación
          </label>
          <select
            name="status"
            value={formData.status || 'in_progress'}
            onChange={onChange}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-[#722b4d] focus:ring-2 focus:ring-[#722b4d]/20"
          >
            <option value="in_progress">En proceso</option>
            <option value="completed">Completada</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          {isEditing ? "Guardar Cambios" : "Guardar Proyecto"}
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