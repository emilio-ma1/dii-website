/**
 * @file usePublicEvents.js
 * @description Custom hook para obtener los eventos o noticias de Vinculación con el Medio.
 */
import { useState, useEffect } from "react";

export function usePublicEvents() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/news`);
        
        if (response.ok) {
          const data = await response.json();
          
          // Mapeamos los datos de la Base de Datos al formato de las tarjetas
          const formattedEvents = data.map(e => ({
            id: e.id,
            status: e.is_active ? "current" : "not_current",

            slug: e.slug, // Para construir la URL de detalle
            
            topic: "Noticia", 
            
            year: e.published_at ? new Date(e.published_at).getFullYear().toString() : new Date().getFullYear().toString(),
            
            title: e.title,
            
            author:"Depto. de Ingeniería Industrial",
            role: "Publicador",
            
            summary: e.content || "Sin contenido disponible.",
            
            // Guardamos la imagen por si la necesitas en la vista de Detalles
            imageUrl: e.image_url 
          }));

          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("[ERROR] Failed to fetch public events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, isLoading };
}