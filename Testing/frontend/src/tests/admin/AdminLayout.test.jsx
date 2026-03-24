import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import AdminLayout from '../../admin/AdminLayout'
import Sidebar from '../../components/Sidebar'

// Mock children Outlet
const mockChild = <div data-testid="outlet-content">Dashboard</div>

const renderLayout = () => {
  return render(
    <MemoryRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={mockChild} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

vi.mock('../../components/Sidebar')
vi.mock('../../components/Navbar')
vi.mock('../../components/footer')

describe('AdminLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.innerWidth = 1024  // Desktop por default
  })

  describe('Layout Base', () => {
    it('01 - Renderiza Navbar superior')
    it('02 - Sidebar fija desktop (w-[300px])')
    it('03 - Outlet en main flex-1')
    it('04 - Footer inferior')
  })

  describe('Mobile Sidebar', () => {
    it('05 - Botón hamburguesa sticky top-20 (solo mobile)')
    it('06 - "Panel Administrativo" título mobile')
    it('07 - Overlay bg-black/40 al abrir sidebar mobile')
    it('08 - Sidebar slide-in translate-x-0 / -translate-x-full')
    it('09 - Click overlay cierra sidebar')
  })

  describe('Botones Mobile', () => {
    it('10 - Hamburguesa: aria-label="Abrir menú"')
    it('11 - X cerrar: aria-label="Cerrar menú"')
    it('12 - Estilos hover border-[#722b4d]/15')
  })

  describe('Responsive', () => {
    it('13 - lg:block sidebar desktop')
    it('14 - lg:hidden mobile-only elementos')
    it('15 - Cambia layout window.innerWidth < 1024')
  })

  describe('Funcionalidad', () => {
    it('16 - openSidebar() → isSidebarOpen true')
    it('17 - closeSidebar() → isSidebarOpen false')
    it('18 - Sidebar recibe onNavigate=closeSidebar en mobile')
  })

  describe('Estilos', () => {
    it('19 - bg-[#f5f5h] min-h-screen flex-col')
    it('20 - Sidebar mobile: rounded-r-2xl shadow-xl')
  })

  it('21 - Snapshot: desktop layout')
})
