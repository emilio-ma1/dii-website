/**
 * @file useAuditLogs.js
 * @description
 * Custom hook to fetch and manage the system's audit logs (traceability).
 * Provides the necessary state and methods to display the administrator activity history.
 */
import { useState, useEffect, useCallback } from "react";

/**
 * Retrieves the list of audit logs from the secure backend endpoint.
 *
 * @param {boolean} shouldFetch - Determines if the initial data fetch should execute.
 * @returns {object} Object containing the logs array, loading state, error message, and a manual refresh function.
 */
export function useAuditLogs(shouldFetch = true) {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      // Security Check: Audit logs require strict authentication
      if (!token) {
        throw new Error("No se encontró un token de autenticación. Inicia sesión nuevamente.");
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/audit-logs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al obtener el historial de auditoría.");
      }

      const data = await response.json();
      setLogs(data);

    } catch (err) {
      console.error("[ERROR] Failed to fetch audit logs:", err);
      setError(err.message || "Error de red al intentar comunicarse con el servidor.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (shouldFetch) {
      fetchLogs();
    }
  }, [shouldFetch, fetchLogs]);

  return {
    logs,
    isLoading,
    error,
    refreshLogs: fetchLogs // Exposed to allow manual reloading via a "Refresh" UI button
  };
}