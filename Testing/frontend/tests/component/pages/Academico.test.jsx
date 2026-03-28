import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import Academico from '../../pages/Academico'

const renderPage = () => {
  return render(
    <MemoryRouter>
      <Academico />
    </MemoryRouter>
  )
}

describe('Academico', () => {
  beforeEach(() => {
    // espacio para futuros mocks si QA los necesita
  })

  describe('Hero', () => {
    it('01 - Renderiza badge "Área Académica"')
    it('02 - Renderiza título principal "Nuestras Carreras"')
    it('03 - Renderiza texto descriptivo del hero')
  })

  describe('Listado de carreras', () => {
    it('04 - Renderiza dos programas académicos')
    it('05 - Renderiza "Ingeniería Civil Industrial"')
    it('06 - Renderiza "Ingeniería Civil en Computación e Informática"')
    it('07 - Renderiza texto "Pregrado · 5 años" en cada tarjeta')
    it('08 - Renderiza botón visual "Ver sitio de la carrera" en cada tarjeta')
  })

  describe('Imágenes', () => {
    it('09 - Renderiza imagen con alt "Logo de Ingeniería Civil Industrial"')
    it('10 - Renderiza imagen con alt "Logo de Ingeniería Civil en Computación e Informática"')
    it('11 - Las imágenes usan loading="lazy"')
  })

  describe('Navegación', () => {
    it('12 - La carrera de Ingeniería Civil Industrial usa enlace externo con href correcto')
    it('13 - El enlace externo usa target="_blank"')
    it('14 - El enlace externo usa rel="noopener noreferrer"')
    it('15 - La carrera de Computación se renderiza como enlace interno o Link')
  })

  describe('Estructura visual', () => {
    it('16 - Renderiza contenedor principal con min-h-screen')
    it('17 - Renderiza grid de programas académicos')
    it('18 - Cada tarjeta usa article como contenedor semántico')
  })

  describe('Accesibilidad', () => {
    it('19 - Las imágenes tienen texto alternativo descriptivo')
    it('20 - Los enlaces son detectables por su nombre accesible')
    it('21 - El heading principal de la página es único')
  })

  it('22 - Snapshot del estado inicial')
})
