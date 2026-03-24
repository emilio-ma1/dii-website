/**
 * @file useAccountManagement.js
 * @description
 * Custom hook for isolating network operations and state management 
 * related to user accounts, adhering to the separation of concerns principle.
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/authContext";

/**
 * Custom hook to manage user accounts data and API interactions.
 *
 * @param {boolean} shouldFetch - Determines if the initial data fetch should execute.
 * @returns {object} Object containing users list, feedback states, and operational methods.
 */
export function useAccountManagement(shouldFetch) {
  const { register } = useAuth();
  const [users, setUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const clearFeedbackMessages = useCallback(() => {
    setMessage("");
    setErrorMessage("");
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        const normalizedData = data.map(u => ({
          id: u.id,
          fullName: u.full_name, 
          email: u.email,
          role: u.role
        }));
        setUsers(normalizedData);
      } else {
        const errorData = await response.json();
        console.error("[WARN] Failed to load users:", errorData.message);
      }
    } catch (error) {
      console.error("[ERROR] Network failure during loadUsers:", error);
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) loadUsers();
  }, [shouldFetch, loadUsers]);

  /**
   * Deletes a user from the system and updates the local state.
   *
   * @param {string|number} userId - The unique identifier of the user to delete.
   * @returns {Promise<void>}
   */
  const deleteUser = useCallback(async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setUsers((currentUsers) => currentUsers.filter((u) => u.id !== userId));
        setMessage("Usuario eliminado exitosamente del sistema.");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error al eliminar el usuario en el servidor.");
      }
    } catch (error) {
      console.error("[ERROR] Network failure during user deletion:", error);
      setErrorMessage("Error de red al intentar comunicarse con el servidor.");
    }
  }, []);

  /**
   * Updates an existing user's information.
   *
   * @param {string|number} userId - The ID of the user to update.
   * @param {object} userData - The new data payload for the user.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const updateUser = useCallback(async (userId, userData) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          full_name: userData.fullName,
          email: userData.email,
          role: userData.role,
          password: userData.password || undefined 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedUser = {
            id: data.user.id,
            fullName: data.user.full_name,
            email: data.user.email,
            role: data.user.role
        };
        setUsers((currentUsers) => currentUsers.map((u) => (u.id === userId ? updatedUser : u)));
        setMessage(data.message || "Usuario actualizado correctamente.");
        return true;
      }
      
      const errorData = await response.json();
      setErrorMessage(errorData.message || "No se pudo actualizar el usuario.");
      return false;

    } catch (error) {
      console.error("[ERROR] Network failure during user update:", error);
      setErrorMessage("Error de conexión al actualizar el perfil.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Creates a new user using the authentication context registration.
   *
   * @param {object} userData - The data payload for the new user.
   * @returns {Promise<boolean>} True if successful, false otherwise.
   */
  const createUser = useCallback(async (userData) => {
    setIsSaving(true);
    const result = await register({
      full_name: userData.fullName.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      role: userData.role,
    });

    if (!result.ok) {
      setErrorMessage(result.message || "No se pudo crear el usuario.");
      setIsSaving(false);
      return false;
    }

    if (result.user) {
      const newUser = {
        id: result.user.id,
        fullName: result.user.full_name,
        email: result.user.email,
        role: result.user.role
      };
      setUsers((currentUsers) => [...currentUsers, newUser]);
    } else {
      await loadUsers(); 
    }

    setMessage(result.message || "Usuario creado exitosamente.");
    setIsSaving(false);
    return true;
  }, [register, loadUsers]);

  return {
    users,
    isSaving,
    message,
    errorMessage,
    clearFeedbackMessages,
    deleteUser,
    updateUser,
    createUser
  };
}