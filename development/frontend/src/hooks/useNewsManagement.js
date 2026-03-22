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
 * @param {boolean} shouldFetch Determines if the initial data fetch should execute.
 * @returns {object} Object containing news list and operational methods.
 */
export function useNewsManagement(shouldFetch) {
  const [newsList, setNewsList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchNews = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news`);
      if (response.ok) {
        const data = await response.json();
        setNewsList(data);
      }
    } catch (error) {
      console.error("[ERROR] Failed to fetch news:", error);
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) fetchNews();
  }, [shouldFetch, fetchNews]);

  /**
   * Deletes a news item from the database.
   *
   * @param {number} newsId The unique identifier of the news.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const deleteNews = async (newsId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news/${newsId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setNewsList((current) => current.filter((n) => n.id !== newsId));
        return true;
      }
      return false;
    } catch (error) {
      console.error("[ERROR] Network failure during news deletion:", error);
      return false;
    }
  };

  /**
   * Saves (creates or updates) a news item.
   *
   * @param {object} newsData The payload containing news details.
   * @param {number|null} editingId The ID if updating, null if creating.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const saveNews = async (newsData, editingId) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/news/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/news`;

      const response = await fetch(endpoint, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        // Mapeamos los campos al formato snake_case esperado por PostgreSQL
        body: JSON.stringify({
          title: newsData.title,
          content: newsData.content,
          image_url: newsData.image_url,
          is_active: newsData.is_active === "true" || newsData.is_active === true
        }),
      });

      if (response.ok) {
        await fetchNews(); // Recargamos la lista silenciosamente
        setIsSaving(false);
        return true;
      }
      setIsSaving(false);
      return false;
    } catch (error) {
      console.error("[ERROR] Network failure saving news:", error);
      setIsSaving(false);
      return false;
    }
  };

  return {
    newsList,
    isSaving,
    deleteNews,
    saveNews
  };
}