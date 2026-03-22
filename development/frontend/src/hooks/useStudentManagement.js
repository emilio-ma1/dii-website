import { useState, useEffect, useCallback } from "react";

export function useStudentManagement(canCreate) {
  const [students, setStudents] = useState([]);
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

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
          profile_id: s.profile_id // Si es null, significa que aún no tiene perfil enlazado
        }));

        const perfilesEnlazados = formattedData.filter(student => student.profile_id !== null);
        setStudents(perfilesEnlazados);

        const usuariosElegibles = formattedData.filter(student => student.profile_id === null);
        setEligibleUsers(usuariosElegibles);
      }
    } catch (error) {
      console.error("[ERROR] Failed to fetch students:", error);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const saveStudentProfile = async (formData, editingId) => {
    setIsSaving(true);
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
        await fetchStudents(); // Refrescamos la lista
        return true;
      } else {
        alert("Error al guardar el estudiante.");
        return false;
      }
    } catch (error) {
      console.error("Network error:", error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteStudentProfile = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alumni/${userId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        await fetchStudents(); // Refrescamos para que vuelva a la lista de elegibles
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  return { students, eligibleUsers, isSaving, saveStudentProfile, deleteStudentProfile };
}