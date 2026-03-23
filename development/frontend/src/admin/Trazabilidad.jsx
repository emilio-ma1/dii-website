export default function Trazabilidad() {
  return (
    <section className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-extrabold text-[#722b4d] sm:text-4xl">
          Trazabilidad
        </h1>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-xl bg-[#722b4d] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            Exportar traza
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-[#722b4d]/20 bg-white p-6 shadow-sm">
        <label className="mb-3 block text-sm font-medium text-[#722b4d]">
          Registro de trazabilidad
        </label>

        <div className="min-h-[420px] max-h-[500px] overflow-y-auto rounded-xl border border-gray-300 bg-gray-50 px-4 py-4 font-mono text-sm leading-7 text-gray-700">
          <p className="text-gray-400">
            Aquí se mostrará la trazabilidad...
          </p>
        </div>
      </div>
    </section>
  );
}