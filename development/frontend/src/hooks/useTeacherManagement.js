/**
 * @file useTeacherManagement.js
 * @description
 * Custom hook for isolating network operations and state management 
 * related to teacher profiles and portfolio management.
 */
import { useState, useEffect, useCallback } from "react";

export function useTeacherManagement(shouldFetch) {
  const [teachers, setTeachers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { "Authorization": `Bearer ${token}` };

      const profResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/professors`);
      if (profResponse.ok) {
        setTeachers(await profResponse.json());
      }
      const usersResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, { headers });
      if (usersResponse.ok) {
        const users = await usersResponse.json();
        setAvailableUsers(users.filter(u => u.role === "teacher"));
      }
    } catch (error) {
      console.error("[ERROR] Failed to fetch teacher data:", error);
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) fetchData();
  }, [shouldFetch, fetchData]);

  const saveTeacherProfile = async (formData, editingId) => {
    setIsSaving(true);
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
        await fetchData();
        setIsSaving(false);
        return true;
      }
      setIsSaving(false);
      return false;
    } catch (error) {
      console.error("[ERROR] Failed to save profile:", error);
      setIsSaving(false);
      return false;
    }
  };

  const deleteTeacherProfile = async (profileId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/professors/${profileId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok) {
        setTeachers(current => current.filter(t => t.id !== profileId));
        return true;
      }
      return false;
    } catch (error) {
      console.error("[ERROR] Failed to delete profile:", error);
      return false;
    }
  };

  return { teachers, availableUsers, isSaving, saveTeacherProfile, deleteTeacherProfile };
}