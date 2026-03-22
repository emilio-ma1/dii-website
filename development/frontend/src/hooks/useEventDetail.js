/**
 * @file useEventDetail.js
 * @description Hook para obtener el detalle de un evento/noticia específica.
 */
import { useState, useEffect } from "react";

  export function useEventDetail(SlugOrId) {
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!SlugOrId) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news/slug/${SlugOrId}`);        
        if (!response.ok) {
          throw new Error("Evento/Noticia no encontrada");
        }

        const data = await response.json();

        const formattedEvent = {
          id: data.id,
          status: data.is_active ? "current" : "not_current",
          topic: "Noticia",
          year: data.published_at ? new Date(data.published_at).getFullYear().toString() : new Date().getFullYear().toString(),
          title: data.title,
          author: "Depto. de Ingeniería Industrial",
          role: "Publicador",
          // El contenido principal de la noticia
          description: data.content || "Sin descripción detallada disponible.",
          image: data.image_url || "/images/Vinculacion-ejemplo.jpg",
        };

        setEventData(formattedEvent);
      } catch (err) {
        console.error("[ERROR] Failed to fetch event detail:", err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [SlugOrId]);

  return { eventData, isLoading, error };
}