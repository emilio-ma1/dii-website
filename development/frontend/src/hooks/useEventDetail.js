/**
 * @file useEventDetail.js
 * @description 
 * Custom hook to fetch and format the details of a specific news event.
 * Acts as an adapter, transforming the API payload into a UI-ready object.
 */
import { useState, useEffect } from "react";

/**
 * Retrieves the details of a specific event or news item.
 *
 * @param {string} slugOrId - The unique URL slug or ID of the news item.
 * @returns {object} An object containing the formatted event data, loading state, and error message.
 */
export function useEventDetail(slugOrId) {
  const [eventData, setEventData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
    // Early return if no identifier is provided
    if (!slugOrId) return;

    const fetchEvent = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news/slug/${slugOrId}`);        
        
        if (!response.ok) {
          throw new Error("Evento o noticia no encontrada.");
        }

        const data = await response.json();

        // Transform API data to match frontend component props
        const formattedEvent = {
          id: data.id,
          status: data.is_active ? "current" : "not_current",
          topic: "Noticia",
          year: data.published_at 
            ? new Date(data.published_at).getFullYear().toString() 
            : new Date().getFullYear().toString(),
          title: data.title,
          author: "Depto. de Ingeniería Industrial",
          role: "Publicador",
          description: data.content || "Sin descripción detallada disponible.",
          image: data.image_url || "/images/Vinculacion-ejemplo.jpg",
        };

        setEventData(formattedEvent);
      } catch (err) {
        console.error("[ERROR] Failed to fetch event detail:", err);
        setError(err.message || "Error de conexión al obtener la noticia.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [slugOrId]);

  return { eventData, isLoading, error };
}