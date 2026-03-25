import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Home from '../../pages/home'

vi.mock('../../pages/NoticiasHome.jsx', () => ({
  default: () => <div data-testid="noticias-home">NoticiasHome</div>
}))

const renderPage = () => {
  return render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  )
}

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('HeroSection', () => {
    it('01 - Renderiza imagen principal con alt "Departamento de Ingeniería Industrial"')
    it('02 - Renderiza badge "Universidad de La Serena"')
    it('03 - Renderiza título principal del departamento')
    it('04 - Renderiza texto descriptivo del hero')
    it('05 - Renderiza botón "Explorar"')
    it('06 - Renderiza link "Conocer más" con ruta /quienes-somos')
  })

  describe('scrollToAreas', () => {
    it('07 - Click en "Explorar" llama scrollIntoView cuando existe #areas')
    it('08 - Click en "Explorar" no rompe si no existe #areas')
  })

  describe('AreasSection', () => {
    it('09 - Renderiza texto "Estructura Acádemica"')
    it('10 - Renderiza título "Áreas del Departamento"')
    it('11 - Renderiza texto descriptivo de la sección')
    it('12 - Renderiza 3 tarjetas de áreas')
    it('13 - Renderiza área "Investigaciones"')
    it('14 - Renderiza área "Académico"')
    it('15 - Renderiza área "Vinculación con el Medio"')
  })

  describe('AreaCard', () => {
    it('16 - Cada tarjeta renderiza título, descripción e imagen')
    it('17 - La tarjeta "Investigaciones" navega a /investigaciones')
    it('18 - La tarjeta "Académico" navega a /academico')
    it('19 - La tarjeta "Vinculación con el Medio" navega a /vinculacion-con-el-medio')
  })

  describe('Noticias', () => {
    it('20 - Renderiza el componente NoticiasHome')
  })

  describe('Accesibilidad y estructura', () => {
    it('21 - Existe un único h1 principal')
    it('22 - La sección de áreas tiene id="areas"')
    it('23 - Las imágenes de las áreas usan alt con el título')
    it('24 - Los enlaces de navegación son detectables por rol')
  })

  it('25 - Snapshot del estado inicial')
})
