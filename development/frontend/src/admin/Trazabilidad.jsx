/**
 * @file Trazabilidad.jsx
 * @description
 * User interface component for the system's audit logs.
 * Displays a chronological list of administrative actions and allows exporting them.
 */
import React from "react";
import { useAuditLogs } from "../hooks/useAuditLogs"; 

export default function Trazabilidad() {
  const { logs, isLoading, error, refreshLogs } = useAuditLogs();

  const formatTimestamp = (dateString) => {
    if (!dateString) return "Fecha desconocida";
    return new Date(dateString).toLocaleString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDetails = (details) => {
    if (!details) return "Sin detalles";
    if (typeof details === "object") {
      return JSON.stringify(details); 
    }
    return details;
  };

  const handleExport = () => {
    const textContent = logs.map(log => {
      const time = formatTimestamp(log.created_at);
      return `[${time}] USUARIO ID: ${log.user_id || "Sistema"} | ACCIÓN: ${log.action} | TABLA: ${log.entity_type || "N/A"} | REGISTRO ID: ${log.entity_id || "N/A"} | DETALLE: ${formatDetails(log.details)}`;
    }).join("\n");

    const blob = new Blob([textContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Trazabilidad_DII_${new Date().toISOString().split("T")[0]}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
          Trazabilidad
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={refreshLogs}
            disabled={isLoading}
            className="rounded-xl border border-[#722b4d] bg-white px-5 py-3 text-sm font-semibold text-[#722b4d] shadow-sm transition hover:bg-gray-50 disabled:opacity-50"
          >
            {isLoading ? "Actualizando..." : "Actualizar"}
          </button>

          <button
            type="button"
            onClick={handleExport}
            disabled={isLoading || logs?.length === 0}
            className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-50"
          >
            Exportar traza
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[#722b4d]/20 bg-white p-6 shadow-sm">
        <label className="mb-3 block text-sm font-medium text-[#722b4d]">
          Registro de trazabilidad del sistema
        </label>

        <div className="min-h-[420px] max-h-[500px] overflow-y-auto rounded-xl border border-gray-300 bg-gray-50 px-4 py-4 font-mono text-sm leading-7 text-gray-700 shadow-inner">
          
          {isLoading && (
            <p className="animate-pulse text-blue-600">
              <span className="font-bold">Sistema:</span> Cargando registros de auditoría...
            </p>
          )}

          {error && !isLoading && (
            <p className="text-red-500">
              <span className="font-bold">[ERROR CRÍTICO]:</span> {error}
            </p>
          )}

          {!isLoading && !error && (!logs || logs.length === 0) && (
            <p className="text-gray-400">
              <span className="font-bold">Sistema:</span> No hay registros de trazabilidad disponibles en la base de datos.
            </p>
          )}

          {!isLoading && !error && logs?.length > 0 && (
            <ul className="space-y-2">
              {logs.map((log) => (
                <li key={log.id} className="border-b border-gray-200 pb-2 last:border-0 hover:bg-gray-100 transition-colors">
                  <span className="text-gray-500">[{formatTimestamp(log.created_at)}]</span>{" "}
                  <span className="font-semibold text-[#722b4d]">
                    Usuario ID: {log.user_id}
                  </span>{" "}
                  ejecutó:{" "}
                  <span className="font-bold text-gray-800">{log.action}</span>{" "}
                  sobre la tabla <span className="italic text-[#722b4d]">'{log.entity_type}'</span>{" "}
                  (ID Registro: {log.entity_id || "N/A"})
                  {log.details && (
                    <span className="ml-0 mt-1 block text-xs italic text-gray-500 sm:inline sm:ml-2 sm:mt-0">
                      ➔ Detalle: {formatDetails(log.details)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
    </section>
  );
}