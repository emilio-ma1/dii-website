/**
 * @file useProjectDetail.js
 * @description 
 * Custom hook to fetch and format the details of a specific research project.
 * Acts as an adapter, transforming the API payload into a UI-ready object.
 */
import { useState, useEffect } from "react";

/**
 * Retrieves the detailed information of a research project by its ID.
 *
 * @param {string|number} id - The unique identifier of the project.
 * @returns {object} An object containing the formatted project data, loading state, and error message.
 */
export function useProjectDetail(id) {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Early return if no ID is provided
    if (!id) return;

    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch data from the specific project endpoint
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`);
        
        if (!response.ok) {
          throw new Error("Proyecto de investigación no encontrado.");
        }

        const data = await response.json();

        // Extract and format the researchers list as done in the general view
        const researchersList = data.authors && data.authors.length > 0
          ? data.authors.map(a => a.name || a.full_name || a.user_name || "Autor").join(", ")
          : "Equipo de Investigación";

        // Transform API data to match frontend component props
        const formattedProject = {
          id: data.id,
          status: data.status || "in_progress",
          topic: data.category_name || "Investigación",
          year: data.year || new Date().getFullYear().toString(),
          title: data.title,
          researcher: researchersList,
          role: "Investigador(es)",
          // Use abstract for summary/description if a long description isn't available
          summary: data.abstract || "Sin resumen disponible.",
          image: data.image_url || "/images/Inve-ejemplo1.png",
          pdf_url: data.pdf_url || null, // Ensure PDF URL is captured
        };

        setProject(formattedProject);
      } catch (err) {
        console.error("[ERROR] Failed to fetch project detail:", err);
        setError(err.message || "Error de red al intentar obtener el proyecto.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, isLoading, error };
}