import { useEffect, useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.error ||
            data?.message ||
            "Error"
    );
  }

  return data;
}

export function useEquipment(shouldFetch = true) {
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const clearFeedbackMessages = useCallback(() => {
    setMessage("");
    setErrorMessage("");
  }, []);

  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/equipment`);
      const data = await parseResponse(response);

      const formattedData = Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            imageUrl: item.image_url,
          }))
        : [];

      setItems(formattedData);
    } catch (error) {
      console.error("[ERROR] Failed to fetch equipment:", error);
      setErrorMessage("No se pudo cargar el equipamiento.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      fetchEquipment();
    }
  }, [shouldFetch, fetchEquipment]);

  const saveEquipment = useCallback(
    async (formData, editingId) => {
      setIsSaving(true);
      clearFeedbackMessages();

      try {
        const token = localStorage.getItem("token");
        const method = editingId ? "PUT" : "POST";
        const url = editingId
          ? `${API_URL}/api/equipment/${editingId}`
          : `${API_URL}/api/equipment`;

        const payload = {
          name: formData.name,
          description: formData.description,
          image_url: formData.image_url,
        };

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        await parseResponse(response);
        await fetchEquipment();

        setMessage(
          editingId
            ? "Equipamiento actualizado correctamente."
            : "Equipamiento creado exitosamente."
        );

        return true;
      } catch (error) {
        console.error("[ERROR] Network error saving equipment:", error);
        setErrorMessage(error.message || "Error al guardar el equipamiento.");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [fetchEquipment, clearFeedbackMessages]
  );

  const deleteEquipment = useCallback(
    async (id) => {
      clearFeedbackMessages();

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/equipment/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        await parseResponse(response);
        await fetchEquipment();

        setMessage("Equipamiento eliminado exitosamente.");
        return true;
      } catch (error) {
        console.error("[ERROR] Network error deleting equipment:", error);
        setErrorMessage(error.message || "Error al eliminar el equipamiento.");
        return false;
      }
    },
    [fetchEquipment, clearFeedbackMessages]
  );

  return {
    items,
    isSaving,
    message,
    errorMessage,
    loading,
    clearFeedbackMessages,
    saveEquipment,
    deleteEquipment,
  };
}