/**
 * @file usePublicTeachers.js
 * @description 
 * Custom hook to fetch and format linked professor profiles for public display.
 * Acts as an adapter to filter incomplete profiles and map database fields to UI properties.
 */
import { useState, useEffect } from "react";

/**
 * Retrieves a list of public teachers/professors with active profiles.
 *
 * @returns {object} An object containing the formatted teachers list, loading state, and error message.
 */
export function usePublicTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicTeachers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/professors`);
        
        if (!response.ok) {
          throw new Error("No se pudieron cargar los perfiles de los docentes.");
        }

        const data = await response.json();
        
        // Filter out base users who haven't created an extended public profile yet
        const linkedTeachers = data.filter(t => t.profile_id !== null && t.profile_id !== undefined);
        
        // Map Database payload to UI Card format
        const formattedTeachers = linkedTeachers.map(t => ({
          id: t.id,
          fullName: t.user_name || t.full_name,
          role: "Docente", // Default role assignment
          area: t.area,
          email: t.email,
          degree: t.degree,
          projects: t.projects ? t.projects.map(p => p.title) : [], 
          imageUrl: t.image_url || "/images/foto-docente.png", // Default image fallback
        }));

        setTeachers(formattedTeachers);
      } catch (err) {
        console.error("[ERROR] Failed to fetch public teachers:", err);
        setError(err.message || "Error de red al intentar comunicarse con el servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicTeachers();
  }, []);

  return { teachers, isLoading, error };
}