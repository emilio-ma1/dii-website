/**
 * @file useProjectDetail.js
 * @description 
 * Custom hook to fetch and format the details of a specific research project.
 * Acts as an adapter, transforming the API payload into a UI-ready object.
 */
import { useState, useEffect } from "react";

/**
 * Formats an ISO date string into DD-MM-YYYY.
 */
const formatDate = (dateString) => {
  if (!dateString) return "Fecha no especificada";
  // Extraemos solo la parte de la fecha antes de la 'T'
  const [year, month, day] = dateString.split('T')[0].split('-');
  return `${day}-${month}-${year}`;
};

/**
 * Retrieves the detailed information of a research project by its ID.
 */
export function useProjectDetail(id) {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`);
        
        if (!response.ok) {
          throw new Error("Proyecto de investigación no encontrado.");
        }

        const data = await response.json();

        // Formateo de autores
        const researchersList = data.authors && data.authors.length > 0
          ? data.authors.map(a => a.name || a.full_name || a.user_name || "Autor").join(", ")
          : "Equipo de Investigación";

        const formattedProject = {
          id: data.id,
          status: data.status || "in_progress",
          topic: data.category_name || "Investigación",
          
          year: formatDate(data.year),
          
          title: data.title,
          researcher: researchersList,
          role: "Investigador(es)",
          summary: data.abstract || data.summary || "Sin resumen disponible.",
          
          image: `${import.meta.env.VITE_API_URL}/api/projects/${data.id}/image`,
          pdf_url: `${import.meta.env.VITE_API_URL}/api/projects/${data.id}/pdf`,
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