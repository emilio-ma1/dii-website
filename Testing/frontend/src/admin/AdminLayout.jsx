import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

/**
 * Layout principal del panel administrativo.
 * Incluye:
 * - Navbar superior
 * - Sidebar lateral fijo en desktop
 * - Sidebar tipo hamburguesa en mobile
 * - Área de contenido principal
 * - Footer inferior
 */
export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => setIsSidebarOpen(true);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      <Navbar />

      <div className="sticky top-20 z-40 border-b border-black/5 bg-white shadow-sm lg:hidden">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            type="button"
            onClick={openSidebar}
            aria-label="Abrir menú"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#722b4d]/15 text-[#722b4d] transition hover:bg-[#722b4d]/5"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <span className="ml-4 flex-1 text-lg font-bold text-[#722b4d]">
            Panel Administrativo
          </span>
        </div>
      </div>

      <div className="flex flex-1 gap-6 px-4 pt-24 sm:px-6 lg:px-6">
        <aside className="hidden w-[300px] shrink-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-md lg:block">
          <Sidebar />
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/40 lg:hidden"
            onClick={closeSidebar}
          />
        )}
        <aside
          className={`fixed left-0 top-20 z-50 h-[calc(100vh-5rem)] w-[320px] max-w-[85vw] rounded-r-2xl border-r border-gray-200 bg-white p-4 shadow-xl transition-transform duration-300 lg:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-lg font-bold text-[#722b4d]">Menú</span>

            <button
              type="button"
              onClick={closeSidebar}
              aria-label="Cerrar menú"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#722b4d]/15 text-[#722b4d] transition hover:bg-[#722b4d]/5"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <Sidebar onNavigate={closeSidebar} />
        </aside>
        <main className="min-w-0 flex-1 px-0 py-4 sm:px-2 lg:px-6 lg:py-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}