import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import NoticiasHome from '../../pages/NoticiasHome'

const renderPage = () => {
  return render(
    <MemoryRouter>
      <NoticiasHome />
    </MemoryRouter>
  )
}

describe('NoticiasHome', () => {
  describe('Encabezado', () => {
    it('01 - Renderiza etiqueta "Actualidad"')
    it('02 - Renderiza título "Social"')
    it('03 - Renderiza texto descriptivo de la sección')
  })

  describe('Listado de noticias', () => {
    it('04 - Renderiza 3 tarjetas de noticias')
    it('05 - Renderiza título "Ejemplo 1"')
    it('06 - Renderiza título "Ejemplo 2"')
    it('07 - Renderiza título "Ejemplo 3"')
    it('08 - Renderiza resumen en cada tarjeta')
    it('09 - Renderiza texto "Leer más" en cada tarjeta')
  })

  describe('Imágenes', () => {
    it('10 - Renderiza imagen con alt "Seminario"')
    it('11 - Renderiza imagen con alt "Bibilioteca"')
    it('12 - Renderiza imagen con alt "Reunión"')
    it('13 - Las imágenes usan loading="lazy"')
  })

  describe('Categorías y fechas', () => {
    it('14 - Renderiza categoría en cada tarjeta')
    it('15 - Renderiza fecha "28 de Febrero, 2026"')
    it('16 - Renderiza fecha "15 de Febrero, 2026"')
    it('17 - Renderiza fecha "5 de Febrero, 2026"')
    it('18 - Renderiza icono de calendario por tarjeta')
  })

  describe('Navegación', () => {
    it('19 - Cada tarjeta tiene link hacia /noticias')
    it('20 - Existen 3 links principales de noticias')
    it('21 - Los links son detectables por rol')
  })

  describe('Estructura y accesibilidad', () => {
    it('22 - Existe un heading h2 con texto "Social"')
    it('23 - Cada noticia se renderiza dentro de un article')
    it('24 - CalendarIcon usa aria-hidden=true')
  })

  it('25 - Snapshot del estado inicial')
})
