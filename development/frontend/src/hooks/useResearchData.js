import { useState, useEffect } from "react";

/**
 * Custom hook to fetch required data for the research management form.
 *
 * @param {boolean} shouldFetch Determines if the fetch should be executed based on permissions.
 * @returns {{ availableAuthors: Array<object>, categories: Array<object> }} An object containing fetched authors and categories.
 * @throws {Error} Implicitly logs network errors to console.
 */
export function useResearchData(shouldFetch) {
  const [availableAuthors, setAvailableAuthors] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { "Authorization": `Bearer ${token}` };

        // Fetch de Usuarios (Autores)
        const usersRes = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, { headers });
        if (usersRes.ok) {
          const data = await usersRes.json();
          const authorsOnly = data.filter(u => u.role === 'teacher' || u.role === 'alumni');
          setAvailableAuthors(authorsOnly.map(u => ({
            id: u.id,
            full_name: u.full_name, 
            role: u.role
          })));
        }

        // Fetch de Categorías
        const catRes = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, { headers });
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }

      } catch (error) {
        console.error("[ERROR] Failed to load research form dependencies:", error);
      }
    };

    if (shouldFetch) {
      fetchDependencies();
    }
  }, [shouldFetch]);

  return { availableAuthors, categories };
}