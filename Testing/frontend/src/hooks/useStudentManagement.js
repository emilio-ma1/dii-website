/**
 * @file useStudentManagement.js
 * @description
 * Custom hook for isolating network operations and state management 
 * related to alumni/student profile administration.
 * * Responsibilities:
 * - Handle data fetching and segregation (linked profiles vs eligible users).
 * - Transmit binary file payloads via FormData for profile creation/updates.
 * - Manage the binary image tunnel endpoint for UI rendering.
 */
import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook to manage student profiles and eligible base accounts.
 *
 * @param {boolean} shouldFetch Determines if the initial data fetch should execute.
 * @returns {object} Object containing lists, feedback states, and operational methods.
 */
export function useStudentManagement(shouldFetch = true) {
  const [students, setStudents] = useState([]);
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /**
   * Clears any active success or error feedback messages.
   * @returns {void}
   */
  const clearFeedbackMessages = useCallback(() => {
    setMessage("");
    setErrorMessage("");
  }, []);

  /**
   * Fetches the complete list of alumni and segregates them into
   * linked profiles and eligible base users.
   * * WHY: Segregation happens here to provide ready-to-use arrays to the UI, 
   * strictly separating data processing from presentation.
   *
   * @returns {Promise<void>}
   * @throws {Error} Soft throws caught internally to set UI error states.
   */
  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/alumni`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch students from server.");
      }
      
      const data = await response.json();
      
      const formattedData = data.map(s => ({
        ...s,
        fullName: s.full_name,
        imageUrl: s.profile_id ? `${API_URL}/api/alumni/${s.id}/image` : null,
        videoUrlEmbed: s.video_url_embed,
        isProfilePublic: s.is_profile_public,
        profile_id: s.profile_id // null means no linked profile yet
      }));

      const linkedProfiles = formattedData.filter(student => student.profile_id !== null && student.profile_id !== undefined);
      setStudents(linkedProfiles);

      const unlinkedUsers = formattedData.filter(student => student.profile_id === null || student.profile_id === undefined);
      setEligibleUsers(unlinkedUsers);
      
    } catch (error) {
      console.error("[ERROR] Failed to fetch students:", error);
      setErrorMessage("No se pudo cargar la lista de egresados.");
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      fetchStudents();
    }
  }, [shouldFetch, fetchStudents]);

  /**
   * Saves (creates or updates) an alumni profile using FormData to support binary uploads.
   * * WHY: Bypasses JSON.stringify and allows the browser to automatically set 
   * the multipart/form-data boundary headers.
   *
   * @param {FormData} formDataPayload The multipart payload containing profile details and image file.
   * @param {number|string|null} editingId The user ID if updating, null if creating.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const saveStudentProfile = useCallback(async (formDataPayload, editingId) => {
    setIsSaving(true);
    clearFeedbackMessages();

    try {
      const token = localStorage.getItem("token");
      const method = editingId ? "PUT" : "POST";
      const url = editingId 
        ? `${API_URL}/api/alumni/${editingId}`
        : `${API_URL}/api/alumni`;

      const response = await fetch(url, {
        method, 
        headers: { 
          "Authorization": `Bearer ${token}`
        },
        body: formDataPayload,
      });

      if (response.ok) {
        await fetchStudents(); 
        setMessage(editingId ? "Perfil actualizado correctamente." : "Perfil creado exitosamente.");
        return true;
      } 
      
      const errorData = await response.json();
      setErrorMessage(errorData.message || "Error al guardar el perfil del estudiante.");
      return false;
      
    } catch (error) {
      console.error("[ERROR] Network error saving student profile:", error);
      setErrorMessage("Error de conexión al intentar guardar.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [fetchStudents, clearFeedbackMessages]);

  /**
   * Deletes a student profile from the database.
   *
   * @param {number|string} userId The user ID associated with the profile.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const deleteStudentProfile = useCallback(async (userId) => {
    clearFeedbackMessages();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/alumni/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        await fetchStudents(); 
        setMessage("Perfil eliminado exitosamente.");
        return true;
      }

      const errorData = await response.json();
      setErrorMessage(errorData.message || "Error al eliminar el perfil.");
      return false;

    } catch (error) {
      console.error("[ERROR] Network error deleting student profile:", error);
      setErrorMessage("Error de red al intentar comunicarse con el servidor.");
      return false;
    }
  }, [fetchStudents, clearFeedbackMessages]);

  return { 
    students, 
    eligibleUsers, 
    isSaving, 
    message, 
    errorMessage, 
    clearFeedbackMessages,
    saveStudentProfile, 
    deleteStudentProfile 
  };
}