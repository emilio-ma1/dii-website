/**
 * @file useTeacherManagement.js
 * @description
 * Custom hook for isolating network operations and state management 
 * related to teacher profiles and portfolio management.
 */
import { useState, useEffect, useCallback } from "react";

export function useTeacherManagement(canCreate) {
  const [teachers, setTeachers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

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

        const vinculados = formattedData.filter(t => t.profile_id !== null && t.profile_id !== undefined);
        setTeachers(vinculados);

        const noVinculados = formattedData.filter(t => t.profile_id === null || t.profile_id === undefined);
        setAvailableUsers(noVinculados);
      }
    } catch (error) {
      console.error("[ERROR] Failed to fetch teachers:", error);
    }
  }, []);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

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
        await fetchTeachers();
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