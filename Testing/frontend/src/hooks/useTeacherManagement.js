/**
 * @file useTeacherManagement.js
 * @description
 * Custom hook for isolating network operations and state management 
 * related to teacher profiles and portfolio management.
 * * Responsibilities:
 * - Handle data fetching and segregation (linked profiles vs available users).
 * - Transmit binary file payloads via FormData for profile creation/updates.
 */
import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook to manage teacher profiles and eligible base accounts.
 *
 * @param {boolean} shouldFetch Determines if the initial data fetch should execute.
 * @returns {object} Object containing lists, feedback states, and operational methods.
 */
export function useTeacherManagement(shouldFetch = true) {
  const [teachers, setTeachers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Clears any active success or error feedback messages.
   * * @returns {void}
   */
  const clearFeedbackMessages = useCallback(() => {
    setMessage("");
    setErrorMessage("");
  }, []);

  /**
   * Fetches the complete list of professors and segregates them into
   * linked profiles (teachers) and unlinked users (availableUsers).
   * * WHY: Segregation must happen at the hook level to provide ready-to-use
   * arrays to the UI, strictly separating data processing from presentation.
   *
   * @returns {Promise<void>}
   * @throws {Error} Soft throws caught internally to set UI error states.
   */
  const fetchTeachers = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/professors`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch teachers from server.");
      }
      
      const data = await response.json();
      
      const formattedData = data.map(t => ({
        ...t,
        fullName: t.user_name || t.full_name,
        imageUrl: `${API_URL}/api/professors/${t.id}/image`,
        profile_id: t.profile_id 
      }));

      const linkedProfiles = formattedData.filter(t => t.profile_id !== null && t.profile_id !== undefined);
      setTeachers(linkedProfiles);

      const unlinkedUsers = formattedData.filter(t => t.profile_id === null || t.profile_id === undefined);
      setAvailableUsers(unlinkedUsers);
      
    } catch (error) {
+      console.error("[ERROR] Failed to fetch teachers:", error);
      setErrorMessage("No se pudo cargar la lista de docentes.");
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      fetchTeachers();
    }
  }, [shouldFetch, fetchTeachers]);

  /**
   * Saves (creates or updates) a teacher profile using FormData to support binary uploads.
   *
   * @param {FormData} formDataPayload The multipart payload containing profile details and image file.
   * @param {number|string|null} editingId The user ID if updating, null if creating.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   * @throws {Error} Caught internally to trigger UI feedback.
   */
  const saveTeacherProfile = useCallback(async (formDataPayload, editingId) => {
    setIsSaving(true);
    clearFeedbackMessages();

    try {
      const token = localStorage.getItem("token");
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId 
        ? `${API_URL}/api/professors/${editingId}`
        : `${API_URL}/api/professors`;

      const response = await fetch(endpoint, {
        method,
        headers: { 
          "Authorization": `Bearer ${token}` 
        },
        body: formDataPayload,
      });

      if (response.ok) {
        await fetchTeachers(); 
        setMessage(editingId ? "Perfil actualizado correctamente." : "Perfil creado exitosamente.");
        return true;
      }

      const errorData = await response.json();
      setErrorMessage(errorData.message || "Error al guardar el perfil del docente.");
      return false;

    } catch (error) {
      console.error("[ERROR] Failed to save profile:", error);
      setErrorMessage("Error de conexión al intentar guardar.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [fetchTeachers, clearFeedbackMessages]);

  /**
   * Deletes a teacher profile from the database.
   *
   * @param {number|string} userId The user ID associated with the profile.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   * @throws {Error} Caught internally to trigger UI feedback.
   */
  const deleteTeacherProfile = useCallback(async (userId) => {
    clearFeedbackMessages();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/professors/${userId}`, {
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