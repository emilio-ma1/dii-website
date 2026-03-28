import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Docentes from '../../pages/Docentes'

describe('Docentes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    document.body.style.overflow = 'auto'
  })

  afterEach(() => {
    document.body.style.overflow = 'auto'
  })

  describe('Hero', () => {
    it('01 - Renderiza badge "Nuestro Equipo"')
    it('02 - Renderiza título principal "Docentes"')
    it('03 - Renderiza texto descriptivo del hero')
  })

  describe('Listado de docentes', () => {
    it('04 - Renderiza las 6 tarjetas de docentes')
    it('05 - Renderiza nombres de docentes visibles en la grilla')
    it('06 - Renderiza roles de docentes en la grilla')
    it('07 - Renderiza áreas de especialización en la grilla')
    it('08 - Renderiza botón "Ver más información" en cada tarjeta')
    it('09 - Las imágenes de las tarjetas usan loading="lazy"')
  })

  describe('TeacherCard', () => {
    it('10 - Renderiza imagen con alt "Foto de ..."')
    it('11 - Click en "Ver más información" abre el modal con el docente correcto')
  })

  describe('TeacherModal', () => {
    it('12 - El modal no se renderiza al inicio')
    it('13 - Al abrir el modal muestra nombre del docente')
    it('14 - Al abrir el modal muestra rol del docente')
    it('15 - Al abrir el modal muestra grado académico')
    it('16 - Al abrir el modal muestra área de especialización')
    it('17 - Al abrir el modal muestra lista de proyectos')
    it('18 - Al abrir el modal muestra email de contacto')
    it('19 - El botón con aria-label="Cerrar modal" cierra el modal')
    it('20 - Click en el overlay cierra el modal')
  })

  describe('Teclado y efectos', () => {
    it('21 - Presionar Escape cierra el modal')
    it('22 - Al abrir el modal document.body.style.overflow = "hidden"')
    it('23 - Al cerrar el modal document.body.style.overflow = "auto"')
    it('24 - Limpia el event listener de keydown al cerrar')
  })

  describe('Contenido del modal', () => {
    it('25 - Renderiza heading "Grado Académico"')
    it('26 - Renderiza heading "Área de Especialización"')
    it('27 - Renderiza heading "Proyectos en los que ha trabajado"')
    it('28 - Renderiza heading "Contacto"')
    it('29 - Renderiza proyectos como lista')
  })

  describe('Accesibilidad y semántica', () => {
    it('30 - Solo existe un h1 principal: "Docentes"')
    it('31 - El botón de cierre tiene nombre accesible')
    it('32 - El modal no existe en el DOM cuando teacher es null')
  })

  it('33 - Snapshot del estado inicial')
})
