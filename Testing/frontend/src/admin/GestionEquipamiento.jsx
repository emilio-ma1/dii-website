/**
 * @file GestionEquipamiento.jsx
 * @description
 * Main container for equipment management. Acts as a Thin Controller orchestrating
 * the state between the presentation layer (EquipmentForm/EquipmentCard) and the
 * custom hook (useEquipment).
 * * Responsibilities:
 * - Manage local UI state (form visibility, current editing item).
 * - Transform UI events into API-ready payloads (e.g., packing FormData).
 * - Enforce role-based access control for equipment views.
 */

import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";
import { useEquipment } from "../hooks/useEquipment";
import { EquipmentForm } from "../components/Equipment/EquipmentForm";
import { EquipmentCard } from "../components/Equipment/EquipmentCard";

const DEFAULT_PERMISSIONS = {
  createEquipment: false,
  editEquipment: false,
  deleteEquipment: false,
};

const EMPTY_FORM = {
  id: "",
  name: "",
  description: "",
  image_file: null,
};

/**
 * Main component for the Equipment Management view.
 *
 * @returns {JSX.Element} The rendered equipment management dashboard.
 */
export default function GestionEquipamiento() {
  const { user } = useAuth();
  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;

  const {
    items,
    isSaving,
    message,
    errorMessage,
    loading,
    clearFeedbackMessages,
    saveEquipment,
    deleteEquipment,
  } = useEquipment(
    permissions.createEquipment ||
      permissions.editEquipment ||
      permissions.deleteEquipment
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  /**
   * Resets the local form state to its initial empty configuration.
   *
   * @returns {void}
   */
  const resetFormState = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    clearFeedbackMessages();
  };

  /**
   * Populates the form with existing data when triggering edit mode.
   *
   * @param {object} item The equipment record to be edited.
   * @returns {void}
   */
  const handleEdit = (item) => {
    clearFeedbackMessages();
    setEditingId(item.id);
    setFormData({
      id: item.id,
      name: item.name || "",
      description: item.description || "",
      image_file: null, // File input remains empty unless user decides to replace the existing image
    });
    setShowForm(true);
  };

  /**
   * Prompts for confirmation and triggers the deletion of an equipment record.
   *
   * @param {string|number} id The unique identifier of the equipment.
   * @returns {Promise<void>}
   */
  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este equipamiento?")) {
      await deleteEquipment(id);
    }
  };

  /**
   * Updates the form state based on user input.
   * Includes a validation guard to prevent uploading files larger than 2MB
   * to avoid unexpected server memory overloads.
   *
   * @param {Event} e The input change event from the form.
   * @returns {void}
   */
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    if (type === "file" && files && files.length > 0) {
      const selectedFile = files[0];
      
      // Limit file size to 2MB to protect the backend memory limits
      if (selectedFile.size > 2 * 1024 * 1024) {
        alert("La imagen excede el límite de 2MB permitidos.");
        e.target.value = ""; 
        return;
      }

      setFormData((prev) => ({ ...prev, image_file: selectedFile }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handles the form submission.
   * Crucially, packs the JSON state into a FormData object. This is required
   * because we are sending a binary file (image) alongside text fields,
   * which necessitates a 'multipart/form-data' payload.
   *
   * @param {Event} event The form submission event.
   * @returns {Promise<void>}
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitData = new FormData();
    submitData.append("name", formData.name || "");
    submitData.append("description", formData.description || "");

    if (formData.image_file) {
      // The key "image" MUST match the parameter in upload.single('image') on the backend.
      submitData.append("image", formData.image_file);
    }

    // Pass the FormData payload instead of the raw JSON state
    const success = await saveEquipment(submitData, editingId);
    
    if (success) {
      resetFormState();
    }
  };

  // RBAC Guard: Block view if user has no equipment permissions
  if (
    !permissions.createEquipment &&
    !permissions.editEquipment &&
    !permissions.deleteEquipment
  ) {
    return (
      <div className="p-8 text-center font-bold text-red-600">
        Acceso Denegado
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-[#722b4d]">
          Gestión de Equipamiento
        </h1>

        {permissions.createEquipment && (
          <button
            onClick={() => {
              resetFormState();
              setShowForm(true);
            }}
            className="rounded-xl bg-[#722b4d] px-5 py-3 text-white shadow-md transition hover:opacity-90"
          >
            + Nuevo Equipamiento
          </button>
        )}
      </div>

      {message && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
          Cargando equipamiento...
        </div>
      ) : showForm ? (
        <EquipmentForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetFormState}
          isEditing={Boolean(editingId)}
          isSaving={isSaving}
        />
      ) : (
        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item) => (
              <EquipmentCard
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                permissions={permissions}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
              No hay equipamiento registrado.
            </div>
          )}
        </div>
      )}
    </section>
  );
}