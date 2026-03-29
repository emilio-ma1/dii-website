import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import ScrollToTopButton from '../../../src/components/ScrollToTopButton'

describe('ScrollToTopButton', () => {
  beforeEach(() => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    vi.spyOn(window, 'addEventListener')
    vi.spyOn(window, 'removeEventListener')
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Visibilidad', () => {
    it('01 - No renderiza si scrollY <= 300', () => {
      window.scrollY = 0
      render(<ScrollToTopButton />)
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
    it('02 - Visible si scrollY > 300', () => {
      render(<ScrollToTopButton />)
      act(() => {
        window.scrollY = 400
        window.dispatchEvent(new Event('scroll'))
      })
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
    it('03 - Cambia visibilidad al hacer scroll', () => {
      render(<ScrollToTopButton />)
      act(() => {
        window.scrollY = 400
        window.dispatchEvent(new Event('scroll'))
      })
      expect(screen.getByRole('button')).toBeInTheDocument()
      act(() => {
        window.scrollY = 100
        window.dispatchEvent(new Event('scroll'))
      })
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  describe('Interacción', () => {
    it('04 - Click ejecuta window.scrollTo({top: 0, behavior: "smooth"})', () => {
      render(<ScrollToTopButton />)
      act(() => {
        window.scrollY = 400
        window.dispatchEvent(new Event('scroll'))
      })
      fireEvent.click(screen.getByRole('button'))
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
    })
    it('05 - aria-label="Volver arriba" presente', () => {
      render(<ScrollToTopButton />)
      act(() => {
        window.scrollY = 400
        window.dispatchEvent(new Event('scroll'))
      })
      expect(screen.getByLabelText('Volver arriba')).toBeInTheDocument()
    })
  })

  describe('Estilos y Posicionamiento', () => {
    it('06 - Fixed bottom-6 right-6 z-50', () => {
      render(<ScrollToTopButton />)
      act(() => {
        window.scrollY = 400
        window.dispatchEvent(new Event('scroll'))
      })
      const btn = screen.getByRole('button')
      expect(btn.className).toContain('fixed')
      expect(btn.className).toContain('bottom-6')
      expect(btn.className).toContain('right-6')
      expect(btn.className).toContain('z-50')
    })
    it('07 - Hover: scale-105 y bg-[#5e2340]', () => {
      render(<ScrollToTopButton />)
      act(() => {
        window.scrollY = 400
        window.dispatchEvent(new Event('scroll'))
      })
      const btn = screen.getByRole('button')
      expect(btn.className).toContain('hover:scale-105')
      expect(btn.className).toContain('hover:bg-[#5e2340]')
    })
    it('08 - Oculto retorna null correctamente', () => {
      window.scrollY = 0
      const { container } = render(<ScrollToTopButton />)
      expect(container.firstChild).toBeNull()
    })
  })

  describe('Event Listeners', () => {
    it('09 - Agrega/remove scroll listener en mount/unmount', () => {
      const { unmount } = render(<ScrollToTopButton />)
      expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
      unmount()
      expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function))
    })
    it('10 - Limpieza de memoria: no memory leaks', () => {
      const { unmount } = render(<ScrollToTopButton />)
      unmount()
      expect(window.removeEventListener).toHaveBeenCalled()
    })
  })

  describe('Accesibilidad', () => {
    it('11 - Button role semántico', () => {
      render(<ScrollToTopButton />)
      act(() => {
        window.scrollY = 400
        window.dispatchEvent(new Event('scroll'))
      })
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
    it('12 - aria-label descriptivo', () => {
      render(<ScrollToTopButton />)
      act(() => {
        window.scrollY = 400
        window.dispatchEvent(new Event('scroll'))
      })
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Volver arriba')
    })
  })

  it('13 - Snapshot: visible state', () => {
    render(<ScrollToTopButton />)
    act(() => {
      window.scrollY = 400
      window.dispatchEvent(new Event('scroll'))
    })
    expect(screen.getByRole('button')).toMatchSnapshot()
  })
})