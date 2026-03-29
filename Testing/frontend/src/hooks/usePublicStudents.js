/**
 * @file usePublicStudents.js
 * @description 
 * Custom hook to fetch and format linked student/alumni profiles.
 * * Responsibilities:
 * - Isolate data fetching and transformation from the presentation layer.
 * - Filter out base users who lack an extended public profile.
 * - Map binary image tunnel URLs to avoid heavy payload responses.
 */
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Filters active profiles and maps the raw database payload to UI properties.
 * * WHY: To prepare the raw API data strictly for UI consumption, reducing
 * mapping logic inside React components and injecting the binary image tunnel.
 *
 * @param {Array<object>} rawStudentsList The unparsed list of users/alumni.
 * @returns {Array<object>} The processed list of linked students.
 * @throws {Error} Does not throw; handles non-array inputs gracefully.
 */
export const processPublicStudents = (rawStudentsList) => {
  if (!Array.isArray(rawStudentsList)) return [];

  // Filter out base users who haven't created an extended public profile yet
  const linkedStudents = rawStudentsList.filter(
    (s) => s.profile_id !== null && s.profile_id !== undefined
  );

  return linkedStudents.map((s) => ({
    id: s.id,
    fullName: s.full_name,
    specialty: s.specialty,
    degree: s.degree,
    email: s.email,
    projects: Array.isArray(s.projects) ? s.projects.map((p) => p.title) : [],
    
    imageUrl: `${API_URL}/api/alumni/${s.id}/image`, 
    
    videoUrlEmbed: s.video_url_embed || "",
    // Robust boolean fallback
    isProfilePublic: s.is_profile_public !== false 
  }));
};

/**
 * Custom hook to fetch and manage the public students state.
 *
 * @returns {object} State object containing students array, isLoading boolean, and error string.
 * @throws {Error} Internally catches network errors and sets the error state.
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

        const response = await fetch(`${API_URL}/api/alumni`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch public students from server");
        }

        const data = await response.json();
        
        const formattedStudents = processPublicStudents(data);

        setStudents(formattedStudents);
      } catch (err) {
        console.error("[ERROR] Failed to fetch public students:", err);
        setError("Error de red al intentar comunicarse con el servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return { students, isLoading, error };
}