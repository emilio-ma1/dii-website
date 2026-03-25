import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import VinculacionDetalle from '../../pages/VinculacionDetalle'
import { useParams } from 'react-router-dom'

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
      <VinculacionDetalle />
    </MemoryRouter>
  )
}

describe('VinculacionDetalle', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Proyecto no encontrado', () => {
    it('01 - Renderiza "Proyecto no encontrado" cuando id no existe')
    it('02 - Renderiza mensaje descriptivo de error')
    it('03 - Renderiza enlace de retorno hacia /vinculacion-con-el-medio')
  })

  describe('Proyecto encontrado', () => {
    it('04 - Renderiza título del proyecto cuando id=ejemplo-1')
    it('05 - Renderiza badge "Vigente" para current')
    it('06 - Renderiza badge "No Vigente" para not_current')
    it('07 - Renderiza topic del proyecto')
    it('08 - Renderiza autor y rol')
    it('09 - Renderiza año del proyecto')
    it('10 - Renderiza imagen principal con alt igual al título')
    it('11 - Renderiza resumen del proyecto')
    it('12 - Renderiza heading "Descripción del Proyecto"')
  })

  describe('Descripción', () => {
    it('13 - Divide la descripción en párrafos usando "\\n\\n"')
    it('14 - No renderiza párrafos vacíos')
    it('15 - Renderiza múltiples párrafos cuando existen separaciones dobles')
  })

  describe('Navegación', () => {
    it('16 - Renderiza enlace superior "Volver a Vinculación con el Medio"')
    it('17 - El enlace superior apunta a /vinculacion-con-el-medio')
    it('18 - El enlace de la vista de error apunta a /vinculacion-con-el-medio')
  })

  describe('Casos borde', () => {
    it('19 - Renderiza proyecto current correctamente con id=ejemplo-1')
    it('20 - Renderiza proyecto not_current correctamente con id=ejemplo-2')
    it('21 - Renderiza proyecto not_current correctamente con id=ejemplo-3')
    it('22 - Tolera status desconocido sin romper render')
  })

  describe('Accesibilidad y estructura', () => {
    it('23 - Existe un único h1 en la vista encontrada')
    it('24 - La imagen principal tiene alt descriptivo')
    it('25 - La vista no encontrada también renderiza un h1')
  })

  it('26 - Snapshot del proyecto ejemplo-1')
})
