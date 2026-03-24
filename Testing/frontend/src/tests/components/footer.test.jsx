import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
//import Footer from '../../components/Footer'

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('Footer', () => {
  beforeEach(() => {
    // Mock Date para año consistente en tests
    vi.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2026)
  })

  describe('Layout y Logos', () => {
    it('01 - Renderiza tres logos institucionales')
    it('02 - Logo footer tiene alt="Logo institucional (footer)"')
    it('03 - Imagen contacto tiene enlace externo a userena.cl')
    it('04 - Logo CNA alineado a la derecha en desktop')
  })

  describe('Información de Contacto', () => {
    it('05 - Link "Iniciar Sesión" navega a /login')
    it('06 - Muestra año actual en copyright (2026)')
    it('07 - Lista completa de desarrolladores')
  })

  describe('FooterImage Component', () => {
    it('08 - Aplica heightClass correctamente')
    it('09 - Imágenes con loading="lazy"')
    it('10 - Object-contain y flex-shrink-0')
  })

  describe('Responsive', () => {
    it('11 - Grid 1-col mobile, 3-col desktop')
    it('12 - Logos centrados en mobile')
  })

  describe('Accesibilidad', () => {
    it('13 - Alt texts descriptivos en todas las imágenes')
    it('14 - Enlace externo con rel="noopener noreferrer"')
  })

  it('15 - Snapshot: footer completo')
})
