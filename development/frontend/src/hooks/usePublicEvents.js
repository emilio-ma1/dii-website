/**
 * @file usePublicEvents.js
 * @description 
 * Custom hook to fetch and format public news and community engagement events.
 * Acts as an adapter to map database fields to UI card properties.
 */
import { useState, useEffect } from "react";

/**
 * Retrieves a list of all active public events and news.
 *
 * @returns {object} An object containing the formatted events list, loading state, and error message.
 */
export function usePublicEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news`);
        
        if (!response.ok) {
          throw new Error("No se pudieron cargar las noticias.");
        }

        const data = await response.json();
        
        // Map Database payload to UI Card format
        const formattedEvents = data.map(e => ({
          id: e.id,
          status: e.is_active ? "current" : "not_current",
          slug: e.slug, // Used to build the detail view URL
          topic: "Noticia", 
          // Dynamic year fallback
          year: e.published_at 
            ? new Date(e.published_at).getFullYear().toString() 
            : new Date().getFullYear().toString(),
          title: e.title,
          author: "Depto. de Ingeniería Industrial",
          role: "Publicador",
          summary: e.content || "Sin contenido disponible.",
          // Keep the raw image URL for detailed views
          imageUrl: e.image_url 
        }));

        setEvents(formattedEvents);
      } catch (err) {
        console.error("[ERROR] Failed to fetch public events:", err);
        setError(err.message || "Error de red al intentar comunicarse con el servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, isLoading, error };
}