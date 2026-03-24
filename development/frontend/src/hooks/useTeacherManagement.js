/**
 * @file useTeacherManagement.js
 * @description
 * Custom hook for isolating network operations and state management 
 * related to teacher profiles and portfolio management.
 */
import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to manage teacher profiles and eligible base accounts.
 *
 * @param {boolean} shouldFetch - Determines if the initial data fetch should execute.
 * @returns {object} Object containing lists, feedback states, and operational methods.
 */
export function useTeacherManagement(shouldFetch = true) {
  const [teachers, setTeachers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const clearFeedbackMessages = useCallback(() => {
    setMessage("");
    setErrorMessage("");
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/professors`);
      if (response.ok) {
        const data = await response.json();
        
        const formattedData = data.map(t => ({
          ...t,
          fullName: t.user_name || t.full_name,
          imageUrl: t.image_url,
          profile_id: t.profile_id 
        }));

        const linkedProfiles = formattedData.filter(t => t.profile_id !== null && t.profile_id !== undefined);
        setTeachers(linkedProfiles);

        const unlinkedUsers = formattedData.filter(t => t.profile_id === null || t.profile_id === undefined);
        setAvailableUsers(unlinkedUsers);
      } else {
        console.warn("[WARN] Failed to fetch teachers from server.");
      }
    } catch (error) {
      console.error("[ERROR] Failed to fetch teachers:", error);
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      fetchTeachers();
    }
  }, [shouldFetch, fetchTeachers]);

  /**
   * Saves (creates or updates) a teacher profile.
   *
   * @param {object} formData - The payload containing profile details.
   * @param {number|string|null} editingId - The user ID if updating, null if creating.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const saveTeacherProfile = useCallback(async (formData, editingId) => {
    setIsSaving(true);
    clearFeedbackMessages();

    try {
      const token = localStorage.getItem("token");
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/professors/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/professors`;

      const response = await fetch(endpoint, {
        method,
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchTeachers(); // Silently reload the list
        setMessage(editingId ? "Perfil actualizado correctamente." : "Perfil creado exitosamente.");
        setIsSaving(false);
        return true;
      }

      const errorData = await response.json();
      setErrorMessage(errorData.message || "Error al guardar el perfil del docente.");
      setIsSaving(false);
      return false;

    } catch (error) {
      console.error("[ERROR] Failed to save profile:", error);
      setErrorMessage("Error de conexión al intentar guardar.");
      setIsSaving(false);
      return false;
    }
  }, [fetchTeachers, clearFeedbackMessages]);

  /**
   * Deletes a teacher profile from the database.
   *
   * @param {number|string} userId - The user ID associated with the profile.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const deleteTeacherProfile = useCallback(async (userId) => {
    clearFeedbackMessages();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/professors/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchTeachers(); 
        setMessage("Perfil eliminado exitosamente.");
        return true;
      }

      const errorData = await response.json();
      setErrorMessage(errorData.message || "Error al eliminar el perfil.");
      return false;

    } catch (error) {
      console.error("[ERROR] Failed to delete profile:", error);
      setErrorMessage("Error de red al intentar comunicarse con el servidor.");
      return false;
    }
  }, [fetchTeachers, clearFeedbackMessages]);

  return { 
    teachers, 
    availableUsers, 
    isSaving, 
    message, 
    errorMessage, 
    clearFeedbackMessages,
    saveTeacherProfile, 
    deleteTeacherProfile 
  };
}