/**
 * @file useStudentManagement.js
 * @description
 * Custom hook for isolating network operations and state management 
 * related to alumni/student profile administration.
 */
import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook to manage student profiles and eligible base accounts.
 *
 * @param {boolean} shouldFetch - Determines if the initial data fetch should execute.
 * @returns {object} Object containing lists, feedback states, and operational methods.
 */
export function useStudentManagement(shouldFetch = true) {
  const [students, setStudents] = useState([]);
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const clearFeedbackMessages = useCallback(() => {
    setMessage("");
    setErrorMessage("");
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alumni`);
      if (response.ok) {
        const data = await response.json();
        
        const formattedData = data.map(s => ({
          ...s,
          fullName: s.full_name,
          imageUrl: s.image_url,
          videoUrlEmbed: s.video_url_embed,
          isProfilePublic: s.is_profile_public,
          profile_id: s.profile_id // null means no linked profile yet
        }));

        const linkedProfiles = formattedData.filter(student => student.profile_id !== null);
        setStudents(linkedProfiles);

        const unlinkedUsers = formattedData.filter(student => student.profile_id === null);
        setEligibleUsers(unlinkedUsers);
      } else {
        console.warn("[WARN] Failed to fetch students from server.");
      }
    } catch (error) {
      console.error("[ERROR] Failed to fetch students:", error);
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      fetchStudents();
    }
  }, [shouldFetch, fetchStudents]);

  /**
   * Saves (creates or updates) an alumni profile.
   *
   * @param {object} formData - The payload containing profile details.
   * @param {number|string|null} editingId - The user ID if updating, null if creating.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const saveStudentProfile = useCallback(async (formData, editingId) => {
    setIsSaving(true);
    clearFeedbackMessages();

    try {
      const token = localStorage.getItem("token");
      const method = editingId ? "PUT" : "POST";
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/api/alumni/${editingId}`
        : `${import.meta.env.VITE_API_URL}/api/alumni`;

      const payload = {
        user_id: formData.user_id,
        degree: formData.degree,
        specialty: formData.specialty,
        image_url: formData.imageUrl,
        video_url_embed: formData.videoUrlEmbed,
        is_profile_public: formData.isProfilePublic
      };

      const response = await fetch(url, {
        method, 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchStudents(); // Silently reload the list
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
   * @param {number|string} userId - The user ID associated with the profile.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const deleteStudentProfile = useCallback(async (userId) => {
    clearFeedbackMessages();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alumni/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        await fetchStudents(); // Refresh to move user back to eligible list
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