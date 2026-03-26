/**
 * @file usePublicProjects.js
 * @description 
 * Custom hook to fetch and format public research projects.
 * Acts as an adapter to map database fields and relationships to UI card properties.
 */
import { useState, useEffect } from "react";

/**
 * Retrieves a list of all active public research projects.
 *
 * @returns {object} An object containing the formatted projects list, loading state, and error message.
 */
export function usePublicProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
        
        if (!response.ok) {
          throw new Error("No se pudieron cargar los proyectos de investigación.");
        }

        const data = await response.json();          
        
        // Map Database payload to UI Card format
        const formattedProjects = data.map(p => {
          // Extract researcher names if they arrive as an array
          const researchersList = p.authors && p.authors.length > 0
            ? p.authors.map(a => a.name || a.full_name || "Investigador").join(", ") 
            : "Equipo de Investigación";

          return {
            id: p.id,
            status: p.status || "in_progress", 
            topic: p.category_name || p.area || "Investigación",
            // Use the established year directly
            year: p.year,
            title: p.title,
            researcher: researchersList,
            role: "Investigador(es)",
            summary: p.summary || p.abstract || "Sin descripción disponible.",
          };
        });

        setProjects(formattedProjects);
      } catch (err) {
        console.error("[ERROR] Failed to fetch public projects:", err);
        setError(err.message || "Error de red al intentar comunicarse con el servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, isLoading, error };
}