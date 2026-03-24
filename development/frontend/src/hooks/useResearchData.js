/**
 * @file useResearchData.js
 * @description 
 * Custom hook to fetch required data dependencies for the research management form.
 * Handles parallel fetching of authors and categories to optimize rendering time.
 */
import { useState, useEffect } from "react";

/**
 * Retrieves the necessary data arrays (authors and categories) to populate form selectors.
 *
 * @param {boolean} shouldFetch - Determines if the fetch should be executed based on mount or permissions.
 * @returns {object} Object containing available authors, categories, loading state, and error message.
 */
export function useResearchData(shouldFetch) {
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        const [usersRes, catRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/users/authors`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/categories`, { headers })
        ]);

        if (!usersRes.ok || !catRes.ok) {
          throw new Error("No se pudieron cargar las dependencias del formulario.");
        }

        // Parse JSON concurrently as well
        const [usersData, catData] = await Promise.all([
          usersRes.json(),
          catRes.json()
        ]);

        // Process Authors (Users filtered by role)
        const authorsOnly = usersData.filter(u => u.role === 'teacher' || u.role === 'alumni');
        setAvailableAuthors(authorsOnly.map(u => ({
          id: u.id,
          full_name: u.full_name, 
          role: u.role
        })));

        // Process Categories
        setCategories(catData);

      } catch (err) {
        console.error("[ERROR] Failed to load research form dependencies:", err);
        setError(err.message || "Error de red al intentar cargar las opciones.");
      } finally {
        setIsLoading(false);
      }
    };

    if (shouldFetch) {
      fetchDependencies();
    }
  }, [shouldFetch]);

  return { availableAuthors, categories, isLoading, error };
}