/**
 * @file usePublicProjects.js
 * @description Custom hook para obtener los proyectos de investigación públicos.
 */
import { useState, useEffect } from "react";

export function usePublicProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`);
        
        if (response.ok) {
          const data = await response.json();          
          // Mapeamos los datos de la Base de Datos al formato de las tarjetas
          const formattedProjects = data.map(p => {
            // Extraemos los nombres de los investigadores si vienen como arreglo
            const researchersList = p.authors 
              ? p.authors.map(a => a.name).join(", ") 
              : "Equipo de Investigación";

            return {
              id: p.id,
              status: p.status || "in_progress", 
              topic: p.category_name || p.area || "Investigación",
              // Extraemos solo el año de la fecha de inicio
              year: p.year,
              title: p.title,
              researcher: researchersList,
              role: "Investigador(es)",
              summary: p.summary || p.abstract || "Sin descripción disponible.",
            };
          });

          setProjects(formattedProjects);
        }
      } catch (error) {
        console.error("[ERROR] Failed to fetch public projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, isLoading };
}