/**
 * @file usePublicTeachers.js
 * @description Custom hook para obtener los docentes con perfiles públicos enlazados.
 */
import { useState, useEffect } from "react";

export function usePublicTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicTeachers = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/professors`);
        
        if (response.ok) {
          const data = await response.json();
          
          const linkedTeachers = data.filter(t => t.profile_id !== null && t.profile_id !== undefined);
          
          const formattedTeachers = linkedTeachers.map(t => ({
            id: t.id,
            fullName: t.user_name || t.full_name,
            role: "Docente", // Cargo por defecto
            area: t.area,
            email: t.email,
            degree: t.degree,
            projects: t.projects ? t.projects.map(p => p.title) : [], 
            imageUrl: t.image_url || "/images/foto-docente.png", // Imagen por defecto
          }));

          setTeachers(formattedTeachers);
        }
      } catch (error) {
        console.error("[ERROR] Failed to fetch public teachers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicTeachers();
  }, []);

  return { teachers, isLoading };
}