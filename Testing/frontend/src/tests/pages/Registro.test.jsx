import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Registro from '../../pages/Registro'

const renderPage = () => {
  return render(
    <MemoryRouter>
      <Registro />
    </MemoryRouter>
  )
}

describe('Registro', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
  })

  describe('Renderizado general', () => {
    it('01 - Renderiza título "Crear Cuenta"')
    it('02 - Renderiza input de correo')
    it('03 - Renderiza input de contraseña')
    it('04 - Renderiza input de confirmación de contraseña')
    it('05 - Renderiza botón "Crear Cuenta"')
    it('06 - Renderiza link "Iniciar Sesión"')
  })

  describe('Inputs', () => {
    it('07 - El input de correo usa type="email"')
    it('08 - Los inputs de contraseña usan type="password"')
    it('09 - Todos los inputs requeridos tienen required')
    it('10 - Permite escribir en contraseña')
    it('11 - Permite escribir en confirmación')
  })

  describe('Validación de contraseñas', () => {
    it('12 - No muestra mensaje de error al inicio')
    it('13 - Muestra error cuando confirm tiene contenido y no coincide con password')
    it('14 - No muestra error cuando password y confirm coinciden')
    it('15 - Aplica clase border-red-400 al input confirm cuando hay mismatch')
    it('16 - Remueve clase border-red-400 cuando deja de haber mismatch')
  })

  describe('Submit', () => {
    it('17 - Si las contraseñas no coinciden no llama alert')
    it('18 - Si las contraseñas coinciden llama alert("Cuenta creada")')
    it('19 - El botón principal tiene type="submit"')
  })

  describe('Navegación', () => {
    it('20 - El link "Iniciar Sesión" apunta a /login')
  })

  describe('Accesibilidad y semántica', () => {
    it('21 - Existe un único h1 principal')
    it('22 - El formulario renderiza correctamente')
  })

  it('23 - Snapshot del estado inicial')
})
