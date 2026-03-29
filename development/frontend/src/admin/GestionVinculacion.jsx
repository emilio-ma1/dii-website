/**
 * @file GestionVinculacion.jsx
 * @description Main container for News and Events management. Acts as a Thin Controller.
 */

import { useState } from "react";
import { useAuth } from "../auth/authContext";
import { PERMISSIONS } from "../auth/permisos";
import { useNewsManagement } from "../hooks/useNewsManagement";
import { NewsForm } from "../components/News/NewsForm";
import { NewsCard } from "../components/News/NewsCard";

const DEFAULT_PERMISSIONS = {
  createProject: false,
  editProject: false,
  deleteProject: false,
  manageAccounts: false,
};

const EMPTY_FORM = {
  id: "",
  title: "",
  content: "",
  is_active: true,
  image_file: null, 
};

export default function CommunityEngagementManagement() {
  const { user } = useAuth();
  const permissions = PERMISSIONS[user?.role] || DEFAULT_PERMISSIONS;

  const { newsList, isSaving, deleteNews, saveNews } = useNewsManagement(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const isEditing = Boolean(editingId);

  const resetFormState = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(EMPTY_FORM);
  };

  const handleNewNews = () => {
    resetFormState();
    setShowForm(true);
  };

  const handleEditNews = (newsItem) => {
    setEditingId(newsItem.id);
    setFormData({
      id: newsItem.id,
      title: newsItem.title || "",
      content: newsItem.content || "",
      is_active: newsItem.is_active,
      image_file: null,
    });
    setShowForm(true);
  };

  const handleDeleteNews = async (newsId) => {
    if (window.confirm("¿Estás seguro de eliminar este evento?")) {
      await deleteNews(newsId);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, files } = event.target;

    if (type === "file" && files.length > 0) {
      const file = files[0];
      if (file.size > 2 * 1024 * 1024) { // Límite de 2MB
        alert("La imagen es demasiado pesada. El límite es 2MB.");
        event.target.value = "";
        return;
      }
      setFormData((prev) => ({ ...prev, [name]: file }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitData = new FormData();
    submitData.append("title", formData.title || "");
    submitData.append("content", formData.content || "");
    submitData.append("is_active", formData.is_active);

    if (formData.image_file) {
      submitData.append("image", formData.image_file); 
    }

    const success = await saveNews(submitData, editingId);
    
    if (success) {
      alert("¡Publicación guardada con éxito!");
      resetFormState();
    } else {
      alert("Error al intentar guardar la publicación.");
    }
  };

  if (!permissions.createProject) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
        <h1 className="text-2xl font-bold">Acceso denegado</h1>
        <p className="mt-2 text-sm">No tienes permisos para acceder a Vinculacion con el Medio.</p>
      </div>
    );
  }

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
          Vinculación con el Medio
        </h1>

        <button
          type="button"
          onClick={handleNewNews}
          className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
        >
          + Nueva Publicación
        </button>
      </div>

      <div className="mt-8">
        {showForm ? (
          <NewsForm
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetFormState}
            isEditing={isEditing}
            isSaving={isSaving}
          />
        ) : (
          <div className="space-y-4">
            {newsList.length > 0 ? (
              newsList.map((newsItem) => (
                <NewsCard
                  key={newsItem.id}
                  newsItem={newsItem}
                  onEdit={handleEditNews}
                  onDelete={handleDeleteNews}
                  permissions={permissions}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#722b4d]/20 bg-white p-8 text-center text-gray-500">
                No hay eventos o noticias registradas todavía.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}