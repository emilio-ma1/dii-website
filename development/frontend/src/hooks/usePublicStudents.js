/**
 * @file usePublicStudents.js
 * @description Custom hook para obtener los perfiles enlazados de estudiantes/egresados.
 */
import { useState, useEffect } from "react";

export function usePublicStudents() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/alumni`);
        
        if (response.ok) {
          const data = await response.json();
          
          const linkedStudents = data.filter(s => s.profile_id !== null && s.profile_id !== undefined);
          
          const formattedStudents = linkedStudents.map(s => ({
            id: s.id,
            fullName: s.full_name,
            specialty: s.specialty,
            degree: s.degree,
            email: s.email,
            projects: s.projects ? s.projects.map(p => p.title) : [],
            imageUrl: s.image_url || "/images/foto-docente.png",
            videoUrlEmbed: s.video_url_embed || "",
            isProfilePublic: s.is_profile_public
          }));

          setStudents(formattedStudents);
        }
      } catch (error) {
        console.error("[ERROR] Failed to fetch public students:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { students, isLoading };
}