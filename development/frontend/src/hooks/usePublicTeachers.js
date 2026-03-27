/**
 * @file usePublicTeachers.js
 * @description 
 * Custom hook to fetch and format linked professor profiles for public display.
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
 * @param {Array<object>} rawTeachersList The unparsed list of users/professors.
 * @returns {Array<object>} The processed list of linked teachers.
 * @throws {Error} Does not throw; handles non-array inputs gracefully.
 */
export const processPublicTeachers = (rawTeachersList) => {
  if (!Array.isArray(rawTeachersList)) return [];

  const linkedTeachers = rawTeachersList.filter(
    (t) => t.profile_id !== null && t.profile_id !== undefined
  );

  return linkedTeachers.map((t) => ({
    id: t.id,
    fullName: t.user_name || t.full_name,
    role: "Docente", 
    area: t.area,
    email: t.email,
    degree: t.degree,
    projects: Array.isArray(t.projects) ? t.projects.map((p) => p.title) : [], 
    
    imageUrl: `${API_URL}/api/professors/${t.id}/image`, 
  }));
};

/**
 * Custom hook to fetch and manage the public teachers state.
 *
 * @returns {object} State object containing teachers array, isLoading boolean, and error string.
 * @throws {Error} Internally catches network errors and sets the error state.
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

        const response = await fetch(`${API_URL}/api/professors`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch public teachers from server");
        }

        const data = await response.json();
        
        const formattedTeachers = processPublicTeachers(data);

        setTeachers(formattedTeachers);
      } catch (err) {
        console.error("[ERROR] Failed to fetch public teachers:", err);
        setError("Error de red al intentar comunicarse con el servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicTeachers();
  }, []);

  return { teachers, isLoading, error };
}