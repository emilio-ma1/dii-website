/**
 * @file useContacts.js
 * @description 
 * Custom hook to fetch and format department contacts for public display.
 * * Responsibilities:
 * - Isolate network requests and error handling from the presentation layer.
 * - Transform flat backend records into the grouped structure expected by the UI.
 */
import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Custom hook to manage the public contacts directory state.
 * * WHY: By mapping the raw API data into grouped structures here, we prevent 
 * the UI components from handling complex data transformations on every render.
 *
 * @returns {object} State object containing contactGroups array, isLoading boolean, and error string.
 * @throws {Error} Internally catches network errors and sets the error state.
 */
export function useContacts() {
  const [contactGroups, setContactGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`${API_URL}/api/contacts`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch contacts from server");
        }

        const data = await response.json();

        // Transform the flat database payload into the grouped structure for the UI
        const formattedGroup = {
          id: "autoridades",
          title: "Autoridades del Departamento",
          description: "Máxima autoridad académica y administrativa.",
          accentColor: "#722b4d",
          contacts: data.map(c => ({
            id: c.id,
            initials: c.initials,
            fullName: c.full_name,
            role: c.role
          }))
        };

        // We wrap it in an array to maintain compatibility with the UI mapping logic
        setContactGroups([formattedGroup]);

      } catch (err) {
        console.error("[ERROR] fetchContacts failed:", err);
        setError("No se pudo cargar el directorio de contactos. Intente nuevamente más tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return { contactGroups, isLoading, error };
}