import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProjectCard } from '../../components/Research/ProjectCard'

describe('ProjectCard', () => {
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()

  const baseProject = {
    id: '1',
    title: 'Sistema de apoyo a la investigación',
    abstract: 'Proyecto orientado a la gestión y visualización de investigaciones.',
    category_name: 'Ingeniería de Software',
    status: 'in_progress',
    year: '2026',
    image_url: '/images/project.png',
    authors: [
      { id: 1, full_name: 'Matias Wormald' },
      { id: 2, full_name: 'Emilio Maturana' }
    ]
  }

  const fullPermissions = {
    editProject: true,
    deleteProject: true
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado general', () => {
    it('01 - Renderiza título del proyecto')
    it('02 - Renderiza abstract del proyecto')
    it('03 - Renderiza año del proyecto')
    it('04 - Renderiza imagen con alt igual al título')
  })

  describe('Categoría y estado', () => {
    it('05 - Renderiza category_name cuando existe')
    it('06 - Muestra "Sin categoría" cuando category_name no existe')
    it('07 - Muestra estado "En proceso" para in_progress')
    it('08 - Muestra estado "Completado" para completed')
    it('09 - Si status no está en STATUS_LABELS, muestra el valor original')
    it('10 - Aplica estilos verdes para status completed')
    it('11 - Aplica estilos vino/blanco para otros estados')
  })

  describe('Autores', () => {
    it('12 - Renderiza lista de autores separada por comas')
    it('13 - Muestra "Autores no especificados" si authors es array vacío')
    it('14 - Muestra "Autores no especificados" si authors no es array')
    it('15 - Renderiza prefijo "Por:" antes de autores')
  })

  describe('Imagen', () => {
    it('16 - Usa image_url entregada cuando existe')
    it('17 - Usa imagen por defecto si image_url está vacío')
    it('18 - Usa imagen por defecto si image_url contiene solo espacios')
  })

  describe('Acciones', () => {
    it('19 - Muestra botón "Editar" cuando permissions.editProject=true')
    it('20 - Muestra botón "Eliminar" cuando permissions.deleteProject=true')
    it('21 - Oculta botón "Editar" cuando permissions.editProject=false')
    it('22 - Oculta botón "Eliminar" cuando permissions.deleteProject=false')
    it('23 - Click en "Editar" llama onEdit(project)')
    it('24 - Click en "Eliminar" llama onDelete(project.id)')
  })

  describe('Casos borde', () => {
    it('25 - Tolera authors undefined sin romper render')
    it('26 - Tolera project sin image_url')
    it('27 - Tolera project sin category_name')
  })

  describe('Accesibilidad y semántica', () => {
    it('28 - La tarjeta usa elemento article')
    it('29 - Los botones tienen type="button"')
    it('30 - La imagen tiene atributo alt descriptivo')
  })

  it('31 - Snapshot del estado base')
})
