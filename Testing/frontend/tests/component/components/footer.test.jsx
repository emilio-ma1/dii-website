import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Footer from '../../../src/components/footer'

const renderWithRouter = (ui) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('Footer', () => {
  beforeEach(() => {
    vi.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2026)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Layout y Logos', () => {
    it('01 - Renderiza tres logos institucionales', () => {
      renderWithRouter(<Footer />)
      const images = screen.getAllByRole('img')
      expect(images).toHaveLength(3)
    })
    it('02 - Logo footer tiene alt="Logo institucional (footer)"', () => {
      renderWithRouter(<Footer />)
      expect(screen.getByAltText('Logo institucional (footer)')).toBeInTheDocument()
    })
    it('03 - Imagen contacto tiene enlace externo a userena.cl', () => {
      renderWithRouter(<Footer />)
      const link = screen.getByRole('link', { name: /contacto/i })
      expect(link).toHaveAttribute('href', 'https://userena.cl/contactos-uls')
    })
    it('04 - Logo CNA alineado a la derecha en desktop', () => {
      renderWithRouter(<Footer />)
      const cnaImg = screen.getByAltText('Logo CNA')
      expect(cnaImg).toBeInTheDocument()
    })
  })

  describe('Información de Contacto', () => {
    it('05 - Link "Iniciar Sesión" navega a /login', () => {
      renderWithRouter(<Footer />)
      const link = screen.getByText('Iniciar Sesión')
      expect(link.closest('a')).toHaveAttribute('href', '/login')
    })
    it('06 - Muestra año actual en copyright (2026)', () => {
      renderWithRouter(<Footer />)
      expect(screen.getByText(/2026/)).toBeInTheDocument()
    })
    it('07 - Lista completa de desarrolladores', () => {
      renderWithRouter(<Footer />)
      expect(screen.getByText('Matias Wormald')).toBeInTheDocument()
      expect(screen.getByText('Emilio Maturana')).toBeInTheDocument()
      expect(screen.getByText('Felipe Urqueta')).toBeInTheDocument()
      expect(screen.getByText(/Joselyn/)).toBeInTheDocument()
    })
  })

  describe('FooterImage Component', () => {
    it('08 - Aplica heightClass correctamente', () => {
      renderWithRouter(<Footer />)
      const logoFooter = screen.getByAltText('Logo institucional (footer)')
      expect(logoFooter.className).toContain('h-[98px]')
    })
    it('09 - Imágenes con loading="lazy"', () => {
      renderWithRouter(<Footer />)
      const images = screen.getAllByRole('img')
      images.forEach(img => expect(img).toHaveAttribute('loading', 'lazy'))
    })
    it('10 - Object-contain y flex-shrink-0', () => {
      renderWithRouter(<Footer />)
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img.className).toContain('object-contain')
        expect(img.className).toContain('flex-shrink-0')
      })
    })
  })

  describe('Responsive', () => {
    it('11 - Grid 1-col mobile, 3-col desktop', () => {
      const { container } = renderWithRouter(<Footer />)
      const grid = container.querySelector('.grid')
      expect(grid.className).toContain('grid-cols-1')
      expect(grid.className).toContain('md:grid-cols-3')
    })
    it('12 - Logos centrados en mobile', () => {
      const { container } = renderWithRouter(<Footer />)
      const firstDiv = container.querySelector('.grid > div')
      expect(firstDiv.className).toContain('justify-center')
    })
  })

  describe('Accesibilidad', () => {
    it('13 - Alt texts descriptivos en todas las imágenes', () => {
      renderWithRouter(<Footer />)
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
        expect(img.getAttribute('alt').length).toBeGreaterThan(0)
      })
    })
    it('14 - Enlace externo con rel="noopener noreferrer"', () => {
      renderWithRouter(<Footer />)
      const externalLink = screen.getByRole('link', { name: /contacto/i })
      expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('15 - Snapshot: footer completo', () => {
    const { container } = renderWithRouter(<Footer />)
    expect(container).toMatchSnapshot()
  })
})