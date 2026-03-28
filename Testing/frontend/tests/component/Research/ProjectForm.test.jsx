import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProjectForm } from '../../components/Research/ProjectForm'

vi.mock('../../components/Research/AuthorAutocomplete', () => ({
  AuthorAutocomplete: vi.fn(({ onAddAuthor, onRemoveAuthor }) => (
    <div data-testid="author-autocomplete">
      <button type="button" onClick={() => onAddAuthor({ id: 10, full_name: 'Matias Wormald', role: 'teacher' })}>
        Agregar autor mock
      </button>
      <button type="button" onClick={() => onRemoveAuthor(10)}>
        Eliminar autor mock
      </button>
    </div>
  ))
}))

describe('ProjectForm', () => {
  const mockOnChange = vi.fn()
  const mockOnSubmit = vi.fn((event) => event.preventDefault())
  const mockOnCancel = vi.fn()
  const mockSetFormData = vi.fn()

  const baseFormData = {
    id: '',
    title: 'Proyecto de ejemplo',
    authors: [{ id: 1, full_name: 'Emilio Maturana', role: 'alumni' }],
    category_id: '2',
    year: '2026',
    abstract: 'Resumen del proyecto',
    pdf_url: 'https://example.com/doc.pdf',
    image_url: 'https://example.com/image.jpg',
    status: 'in_progress'
  }

  const categories = [
    { id: '1', name: 'Optimización' },
    { id: '2', name: 'Investigación Operativa' }
  ]

  const availableUsers = [
    { id: 1, full_name: 'Emilio Maturana', role: 'alumni' },
    { id: 2, full_name: 'Matias Wormald', role: 'teacher' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado general', () => {
    it('01 - Renderiza el formulario')
    it('02 - Renderiza input "Título"')
    it('03 - Renderiza AuthorAutocomplete')
    it('04 - Renderiza select "Categoría (Área)"')
    it('05 - Renderiza input "Año"')
    it('06 - Renderiza textarea "Resumen (Abstract)"')
    it('07 - Renderiza input "URL del PDF (Documento)"')
    it('08 - Renderiza input "URL de la Imagen"')
    it('09 - Renderiza select "Estado"')
    it('10 - Renderiza botón submit')
    it('11 - Renderiza botón "Cancelar"')
  })

  describe('Valores iniciales', () => {
    it('12 - Muestra title desde formData')
    it('13 - Muestra category_id seleccionado desde formData')
    it('14 - Muestra year desde formData')
    it('15 - Muestra abstract desde formData')
    it('16 - Muestra pdf_url desde formData')
    it('17 - Muestra image_url desde formData')
    it('18 - Muestra status desde formData')
  })

  describe('Categorías', () => {
    it('19 - Renderiza opción placeholder "Selecciona una categoría"')
    it('20 - Renderiza todas las categorías recibidas por props')
    it('21 - El placeholder de categoría está disabled')
  })

  describe('Estado y modo', () => {
    it('22 - isEditing=false muestra "Guardar Proyecto"')
    it('23 - isEditing=true muestra "Guardar Cambios"')
    it('24 - El select status contiene "En proceso" y "Completado"')
  })

  describe('Interacciones', () => {
    it('25 - onChange se llama al cambiar title')
    it('26 - onChange se llama al cambiar category_id')
    it('27 - onChange se llama al cambiar year')
    it('28 - onChange se llama al cambiar abstract')
    it('29 - onChange se llama al cambiar pdf_url')
    it('30 - onChange se llama al cambiar image_url')
    it('31 - onChange se llama al cambiar status')
    it('32 - onSubmit se llama al enviar el formulario')
    it('33 - onCancel se llama al hacer click en "Cancelar"')
  })

  describe('Integración con AuthorAutocomplete', () => {
    it('34 - AuthorAutocomplete recibe availableUsers')
    it('35 - AuthorAutocomplete recibe selectedAuthors desde formData.authors')
    it('36 - handleAddAuthor agrega autor usando setFormData(callback)')
    it('37 - handleRemoveAuthor elimina autor usando setFormData(callback)')
  })

  describe('Validaciones HTML', () => {
    it('38 - title es required')
    it('39 - category_id es required')
    it('40 - year es required')
    it('41 - abstract es required')
    it('42 - pdf_url no es required')
    it('43 - image_url no es required')
  })

  describe('Tipos de campos', () => {
    it('44 - title usa type="text"')
    it('45 - year usa type="number"')
    it('46 - pdf_url usa type="url"')
    it('47 - image_url usa type="url"')
  })

  describe('Accesibilidad y semántica', () => {
    it('48 - El formulario mantiene onSubmit')
    it('49 - El botón cancelar usa type="button"')
    it('50 - El botón principal usa type="submit"')
  })

  it('51 - Snapshot del modo creación')
})
