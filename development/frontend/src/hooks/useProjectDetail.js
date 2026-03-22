/**
 * @file useProjectDetail.js
 * @description Hook para obtener el detalle de un proyecto de investigación específico.
 */
import { useState, useEffect } from "react";

export function useProjectDetail(id) {
  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        // Hacemos fetch al endpoint del proyecto individual
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`);
        
        if (!response.ok) {
          throw new Error("Proyecto no encontrado");
        }

        const data = await response.json();

        // Extraemos los investigadores igual que en la vista general
        const researchersList = data.authors && data.authors.length > 0
          ? data.authors.map(a => a.name || a.full_name || a.user_name || "Autor").join(", ")
          : "Equipo de Investigación";

        const formattedProject = {
          id: data.id,
          status: data.status || "in_progress",
          topic: data.category_name || "Investigación",
          year: data.year || "2024",
          title: data.title,
          researcher: researchersList,
          role: "Investigador(es)",
          // Usamos abstract para el resumen y la descripción si no hay una descripción larga
          summary: data.abstract || "Sin resumen disponible.",
          image: data.image_url || "/images/Inve-ejemplo1.png",
          pdf_url: data.pdf_url || null, // Aseguramos capturar la URL del PDF
        };

        setProject(formattedProject);
      } catch (err) {
        console.error("[ERROR] Failed to fetch project detail:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  return { project, isLoading, error };
}