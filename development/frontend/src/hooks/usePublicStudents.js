/**
 * @file usePublicStudents.js
 * @description 
 * Custom hook to fetch and format linked student/alumni profiles.
 * Acts as an adapter to filter incomplete profiles and map database fields to UI properties.
 */
import { useState, useEffect } from "react";

/**
 * Retrieves a list of public students/alumni with active profiles.
 *
 * @returns {object} An object containing the formatted students list, loading state, and error message.
 */
export function usePublicStudents() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alumni`);
        
        if (!response.ok) {
          throw new Error("No se pudieron cargar los perfiles de los estudiantes.");
        }

        const data = await response.json();
        
        // Filter out base users who haven't created an extended public profile yet
        const linkedStudents = data.filter(s => s.profile_id !== null && s.profile_id !== undefined);
        
        // Map Database payload to UI Card format
        const formattedStudents = linkedStudents.map(s => ({
          id: s.id,
          fullName: s.full_name,
          specialty: s.specialty,
          degree: s.degree,
          email: s.email,
          projects: s.projects ? s.projects.map(p => p.title) : [],
          imageUrl: s.image_url || "/images/foto-docente.png", //Ensure this fallback image exists
          videoUrlEmbed: s.video_url_embed || "",
          isProfilePublic: s.is_profile_public
        }));

        setStudents(formattedStudents);
      } catch (err) {
        console.error("[ERROR] Failed to fetch public students:", err);
        setError(err.message || "Error de red al intentar comunicarse con el servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { students, isLoading, error };
}