/**
 * @file GestionEquipamiento.jsx
 * @description Main container for equipment management. Acts as a Thin Controller.
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
  image_url: "",
  image_file: null,
};

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

  const resetFormState = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
    clearFeedbackMessages();
  };

  const handleEdit = (item) => {
    clearFeedbackMessages();

    setEditingId(item.id);
    setFormData({
      id: item.id,
      name: item.name || "",
      description: item.description || "",
      image_url: item.image_url || item.imageUrl || "",
      image_file: null,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este equipamiento?")) {
      await deleteEquipment(id);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image_file") {
      const selectedFile = files?.[0] || null;

      setFormData((prev) => ({
        ...prev,
        image_file: selectedFile,
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await saveEquipment(formData, editingId);
    if (success) resetFormState();
  };

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