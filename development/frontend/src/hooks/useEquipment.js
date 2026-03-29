/**
 * @file useEquipment.js
 * @description
 * Custom hook to manage equipment data and API interactions.
 * Acts as a bridge between the presentation layer and the backend REST API.
 */
import { useEffect, useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Parses the HTTP response and extracts data or throws a formatted error.
 *
 * @param {Response} response The fetch Response object.
 * @returns {Promise<any>} The parsed JSON or text data.
 * @throws {Error} If the HTTP status is not ok.
 */
async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(
      typeof data === "string"
        ? data
        : data?.error || data?.message || "Error"
    );
  }

  return data;
}

/**
 * Custom hook to manage equipment logic.
 *
 * @param {boolean} shouldFetch Determines if the initial data fetch should execute.
 * @returns {object} Object containing items list, loading states, and operational methods.
 */
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

  /**
   * Fetches all equipment from the backend and maps the binary image URLs.
   *
   * @returns {Promise<void>}
   */
  const fetchEquipment = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/equipment`);
      const data = await parseResponse(response);

      const formattedData = Array.isArray(data)
        ? data.map((item) => ({
            ...item,
            imageUrl: `${API_URL}/api/equipment/${item.id}/image`,
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

  /**
   * Saves (creates or updates) an equipment record using FormData to support binary files.
   *
   * @param {FormData} formDataPayload The payload containing equipment details and the image file.
   * @param {number|string|null} editingId The ID if updating, null if creating.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const saveEquipment = useCallback(
    async (formDataPayload, editingId) => {
      setIsSaving(true);
      clearFeedbackMessages();

      try {
        const token = localStorage.getItem("token");
        const method = editingId ? "PUT" : "POST";
        const url = editingId
          ? `${API_URL}/api/equipment/${editingId}`
          : `${API_URL}/api/equipment`;

        const response = await fetch(url, {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataPayload,
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

  /**
   * Deletes an equipment record from the database.
   *
   * @param {number|string} id The unique identifier of the equipment.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
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