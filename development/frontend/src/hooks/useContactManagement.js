/**
 * @file useContactManagement.js
 * @description
 * Custom hook to manage contact records and network operations.
 * * Responsibilities:
 * - Handle data fetching, creation, updating, and deletion (CRUD).
 * - Transform database snake_case formats to UI camelCase formats.
 * - Manage loading and error states for the presentation layer.
 */
import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook for the admin contact management panel.
 * * WHY: Isolates the network and data transformation logic from the UI components,
 * ensuring the presentation layer remains strictly declarative.
 *
 * @param {boolean} shouldFetch Determines if the initial data fetch should execute.
 * @returns {object} Object containing grouped sections, loading states, and CRUD methods.
 */
export function useContactManagement(shouldFetch = true) {
  const [sections, setSections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const clearFeedbackMessages = useCallback(() => {
    setMessage("");
    setErrorMessage("");
  }, []);

  /**
   * Fetches the contacts from the API and groups them into a section structure.
   *
   * @returns {Promise<void>}
   * @throws {Error} Soft throws caught internally to set UI error states.
   */
  const fetchContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/contacts`);
      
      if (!response.ok) throw new Error("Failed to fetch contacts from server.");
      
      const data = await response.json();
      
      // Transform raw DB payload into the UI Section format
      const mainSection = {
        id: "autoridades",
        title: "Autoridades del Departamento",
        description: "Máxima autoridad académica y administrativa.",
        color: "default",
        people: data.map(c => ({
          id: c.id,
          initials: c.initials,
          fullName: c.full_name,
          role: c.role
        }))
      };

      setSections([mainSection]);
    } catch (error) {
      console.error("[ERROR] Failed to fetch contacts:", error);
      setErrorMessage("No se pudo cargar la lista de contactos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) fetchContacts();
  }, [shouldFetch, fetchContacts]);

  /**
   * Saves (creates or updates) a contact record.
   *
   * @param {object} formData The payload containing contact details.
   * @param {number|string|null} editingId The contact ID if updating, null if creating.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const saveContact = useCallback(async (formData, editingId) => {
    setIsSaving(true);
    clearFeedbackMessages();

    try {
      const token = localStorage.getItem("token");
      const method = editingId ? "PUT" : "POST";
      const endpoint = editingId 
        ? `${API_URL}/api/contacts/${editingId}`
        : `${API_URL}/api/contacts`;

      const payload = {
        initials: formData.initials,
        full_name: formData.fullName,
        role: formData.role
      };

      const response = await fetch(endpoint, {
        method,
        headers: { 
          "Content-Type": "application/json", 
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await fetchContacts(); 
        setMessage(editingId ? "Contacto actualizado correctamente." : "Contacto creado exitosamente.");
        return true;
      }

      const errorData = await response.json();
      setErrorMessage(errorData.message || "Error al guardar el contacto.");
      return false;

    } catch (error) {
      console.error("[ERROR] Failed to save contact:", error);
      setErrorMessage("Error de conexión al intentar guardar.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [fetchContacts, clearFeedbackMessages]);

  /**
   * Deletes a contact record from the database.
   *
   * @param {number|string} id The unique identifier of the contact.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const deleteContact = useCallback(async (id) => {
    clearFeedbackMessages();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/contacts/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchContacts(); 
        setMessage("Contacto eliminado exitosamente.");
        return true;
      }

      const errorData = await response.json();
      setErrorMessage(errorData.message || "Error al eliminar el contacto.");
      return false;

    } catch (error) {
      console.error("[ERROR] Failed to delete contact:", error);
      setErrorMessage("Error de red al intentar comunicarse con el servidor.");
      return false;
    }
  }, [fetchContacts, clearFeedbackMessages]);

  return { 
    sections, 
    isLoading, 
    isSaving, 
    message, 
    errorMessage, 
    clearFeedbackMessages,
    saveContact, 
    deleteContact 
  };
}