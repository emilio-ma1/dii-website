import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import InvestigacionDetalle from '../../pages/InvestigacionDetalle'
import { useAuth } from '../../auth/authContext'
import { useParams } from 'react-router-dom'

vi.mock('../../auth/authContext', () => ({
  useAuth: vi.fn()
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: vi.fn()
  }
})

const renderPage = () => {
  return render(
    <MemoryRouter>
      <InvestigacionDetalle />
    </MemoryRouter>
  )
}

describe('InvestigacionDetalle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuth).mockReturnValue({ user: null })
  })

  describe('Proyecto no encontrado', () => {
    it('01 - Renderiza "Investigación no encontrada" cuando id no existe')
    it('02 - Renderiza mensaje descriptivo de error')
    it('03 - Renderiza enlace "Volver a investigaciones" hacia /investigaciones')
  })

  describe('Proyecto encontrado', () => {
    it('04 - Renderiza título del proyecto cuando id=ejemplo-1')
    it('05 - Renderiza badge de estado "En proceso" para in_progress')
    it('06 - Renderiza badge de estado "Completado" para completed')
    it('07 - Renderiza topic del proyecto')
    it('08 - Renderiza investigador y rol')
    it('09 - Renderiza año del proyecto')
    it('10 - Renderiza imagen del hero con alt igual al título')
    it('11 - Renderiza resumen del proyecto')
    it('12 - Renderiza heading "Descripción del Proyecto"')
  })

  describe('Descripción', () => {
    it('13 - Divide la descripción en párrafos usando "\\n\\n"')
    it('14 - No renderiza párrafos vacíos')
    it('15 - Renderiza múltiples párrafos cuando existen separaciones dobles')
  })

  describe('Descarga del PDF', () => {
    it('16 - No muestra botón de descarga si no hay usuario')
    it('17 - No muestra botón de descarga si user.role no es "egresado"')
    it('18 - Muestra botón "Descargar proyecto" cuando user.role es "egresado" y hay pdf_url')
    it('19 - El enlace de descarga usa href del pdf_url')
    it('20 - El enlace de descarga tiene atributo download')
  })

  describe('Navegación', () => {
    it('21 - Renderiza enlace superior "Volver a Investigaciones"')
    it('22 - El enlace superior apunta a /investigaciones')
    it('23 - El enlace de la vista de error apunta a /investigaciones')
  })

  describe('Casos borde', () => {
    it('24 - Tolera status desconocido sin romper render')
    it('25 - No muestra descarga si project.pdf_url es falsy')
    it('26 - Renderiza proyecto completed correctamente con id=ejemplo-2')
    it('27 - Renderiza proyecto completed correctamente con id=ejemplo-3')
  })

  describe('Accesibilidad y estructura', () => {
    it('28 - Existe un único h1 en la vista encontrada')
    it('29 - La imagen principal tiene alt descriptivo')
    it('30 - La vista no encontrada también renderiza un h1')
  })

  it('31 - Snapshot del proyecto ejemplo-1')
})
