/**
 * @file useNewsManagement.js
 * @description
 * Custom hook for isolating network operations and state management 
 * related to community engagement news and events.
 */

import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to manage news data and API interactions.
 *
 * @param {boolean} shouldFetch - Determines if the initial data fetch should execute.
 * @returns {object} Object containing news list, feedback states, and operational methods.
 */
export function useNewsManagement(shouldFetch) {
  const [newsList, setNewsList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const clearFeedbackMessages = useCallback(() => {
    setMessage("");
    setErrorMessage("");
  }, []);

  const fetchNews = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news`);
      if (response.ok) {
        const data = await response.json();
        setNewsList(data);
      } else {
        console.warn("[WARN] Failed to fetch news from server.");
      }
    } catch (error) {
      console.error("[ERROR] Network failure during fetchNews:", error);
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) fetchNews();
  }, [shouldFetch, fetchNews]);

  /**
   * Deletes a news item from the database.
   *
   * @param {number|string} newsId - The unique identifier of the news.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const deleteNews = useCallback(async (newsId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news/${newsId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setNewsList((current) => current.filter((n) => n.id !== newsId));
        setMessage("Noticia eliminada exitosamente.");
        return true;
      }
      
      const errorData = await response.json();
      setErrorMessage(errorData.message || "Error al eliminar la noticia.");
      return false;

    } catch (error) {
      console.error("[ERROR] Network failure during news deletion:", error);
      setErrorMessage("Error de red al intentar comunicarse con el servidor.");
      return false;
    }
  }, []);

  /**
   * Saves (creates or updates) a news item using FormData for file uploads.
   *
   * @param {FormData} formDataPayload - The payload containing news details and files.
   * @param {number|string|null} editingId - The ID if updating, null if creating.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const saveNews = useCallback(async (formDataPayload, editingId) => {
    setIsSaving(true);
    clearFeedbackMessages();
    
    try {
      const token = localStorage.getItem("token");
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/news/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/news`;

      const response = await fetch(endpoint, {
        method,
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
        body: formDataPayload, 
      });

      if (response.ok) {
        await fetchNews();
        setMessage(editingId ? "Noticia actualizada correctamente." : "Noticia creada exitosamente.");
        setIsSaving(false);
        return true;
      }

      const errorData = await response.json();
      setErrorMessage(errorData.message || "Error al guardar la noticia.");
      setIsSaving(false);
      return false;

    } catch (error) {
      console.error("[ERROR] Network failure saving news:", error);
      setErrorMessage("Error de conexión al intentar guardar.");
      setIsSaving(false);
      return false;
    }
  }, [fetchNews, clearFeedbackMessages]);

  return {
    newsList,
    isSaving,
    message,
    errorMessage,
    clearFeedbackMessages,
    deleteNews,
    saveNews
  };
}