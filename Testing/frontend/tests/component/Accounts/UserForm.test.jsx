import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserForm } from '../../../src/components/Accounts/UserForm'

describe('UserForm', () => {
  const mockOnChange = vi.fn()
  const mockOnSubmit = vi.fn((event) => event.preventDefault())
  const mockOnCancel = vi.fn()
  const baseFormData = {
    fullName: 'Matias Wormald',
    email: 'matias@userena.cl',
    role: 'admin',
    password: '123456'
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado general', () => {
    it('01 - Renderiza el formulario', () => {
      const { container } = render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(container.querySelector('form')).toBeInTheDocument()
    })
    it('02 - Renderiza input "Nombre completo"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByPlaceholderText('Nombre completo')).toBeInTheDocument()
    })
    it('03 - Renderiza input "Correo electrónico"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByPlaceholderText('correo@userena.cl')).toBeInTheDocument()
    })
    it('04 - Renderiza select "Rol"', () => {
      const { container } = render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(container.querySelector('select')).toBeInTheDocument()
    })
    it('05 - Renderiza input "Contraseña"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument()
    })
    it('06 - Renderiza botón principal de envío', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByText('Crear Usuario')).toBeInTheDocument()
    })
    it('07 - Renderiza botón "Cancelar"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByText('Cancelar')).toBeInTheDocument()
    })
  })

  describe('Valores iniciales', () => {
    it('08 - Muestra fullName desde formData', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByPlaceholderText('Nombre completo').value).toBe('Matias Wormald')
    })
    it('09 - Muestra email desde formData', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByPlaceholderText('correo@userena.cl').value).toBe('matias@userena.cl')
    })
    it('10 - Muestra role seleccionado desde formData', () => {
      const { container } = render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(container.querySelector('select').value).toBe('admin')
    })
    it('11 - Muestra password desde formData', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByPlaceholderText('Contraseña').value).toBe('123456')
    })
  })

  describe('Opciones de rol', () => {
    it('12 - Renderiza opción "Administrador"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByText('Administrador')).toBeInTheDocument()
    })
    it('13 - Renderiza opción "Egresado"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByText('Egresado')).toBeInTheDocument()
    })
    it('14 - Renderiza opción "Docente"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByText('Docente')).toBeInTheDocument()
    })
    it('15 - Renderiza exactamente 3 opciones en el select', () => {
      const { container } = render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(container.querySelectorAll('option')).toHaveLength(3)
    })
  })

  describe('Modo creación', () => {
    it('16 - isEditing=false muestra botón "Crear Usuario"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByText('Crear Usuario')).toBeInTheDocument()
    })
    it('17 - isEditing=false hace password required', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByPlaceholderText('Contraseña')).toBeRequired()
    })
    it('18 - isEditing=false usa placeholder "Contraseña"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument()
    })
    it('19 - isEditing=false no muestra texto "(opcional)"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.queryByText('(opcional)')).not.toBeInTheDocument()
    })
  })

  describe('Modo edición', () => {
    it('20 - isEditing=true muestra botón "Guardar Cambios"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={true} isSaving={false} />)
      expect(screen.getByText('Guardar Cambios')).toBeInTheDocument()
    })
    it('21 - isEditing=true hace password no requerido', () => {
      render(<UserForm formData={{ ...baseFormData, password: '' }} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={true} isSaving={false} />)
      expect(screen.getByPlaceholderText('Dejar vacío para no cambiarla')).not.toBeRequired()
    })
    it('22 - isEditing=true muestra texto "(opcional)"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={true} isSaving={false} />)
      expect(screen.getByText('(opcional)')).toBeInTheDocument()
    })
    it('23 - isEditing=true usa placeholder "Dejar vacío para no cambiarla"', () => {
      render(<UserForm formData={{ ...baseFormData, password: '' }} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={true} isSaving={false} />)
      expect(screen.getByPlaceholderText('Dejar vacío para no cambiarla')).toBeInTheDocument()
    })
  })

  describe('Interacciones', () => {
    it('24 - onChange se llama al cambiar fullName', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      fireEvent.change(screen.getByPlaceholderText('Nombre completo'), { target: { value: 'Nuevo Nombre' } })
      expect(mockOnChange).toHaveBeenCalled()
    })
    it('25 - onChange se llama al cambiar email', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      fireEvent.change(screen.getByPlaceholderText('correo@userena.cl'), { target: { value: 'nuevo@userena.cl' } })
      expect(mockOnChange).toHaveBeenCalled()
    })
    it('26 - onChange se llama al cambiar role', () => {
      const { container } = render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      fireEvent.change(container.querySelector('select'), { target: { value: 'alumni' } })
      expect(mockOnChange).toHaveBeenCalled()
    })
    it('27 - onChange se llama al cambiar password', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'newpass' } })
      expect(mockOnChange).toHaveBeenCalled()
    })
    it('28 - onSubmit se llama al enviar el formulario', () => {
      const { container } = render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      fireEvent.submit(container.querySelector('form'))
      expect(mockOnSubmit).toHaveBeenCalled()
    })
    it('29 - onCancel se llama al hacer click en "Cancelar"', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      fireEvent.click(screen.getByText('Cancelar'))
      expect(mockOnCancel).toHaveBeenCalled()
    })
  })

  describe('Estado isSaving', () => {
    it('30 - isSaving=true deshabilita botón submit', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={true} />)
      expect(screen.getByText('Guardando...')).toBeDisabled()
    })
    it('31 - isSaving=true muestra texto "Guardando..."', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={true} />)
      expect(screen.getByText('Guardando...')).toBeInTheDocument()
    })
    it('32 - isSaving=false habilita botón submit', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByText('Crear Usuario')).not.toBeDisabled()
    })
  })

  describe('Accesibilidad y semántica', () => {
    it('33 - Los botones tienen type correcto', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByText('Crear Usuario')).toHaveAttribute('type', 'submit')
      expect(screen.getByText('Cancelar')).toHaveAttribute('type', 'button')
    })
    it('34 - fullName y email tienen atributo required', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      expect(screen.getByPlaceholderText('Nombre completo')).toBeRequired()
      expect(screen.getByPlaceholderText('correo@userena.cl')).toBeRequired()
    })
    it('35 - El botón submit usa disabled correctamente', () => {
      render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={true} />)
      expect(screen.getByText('Guardando...')).toHaveAttribute('disabled')
    })
    it('36 - El formulario conserva onSubmit', () => {
      const { container } = render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
      fireEvent.submit(container.querySelector('form'))
      expect(mockOnSubmit).toHaveBeenCalledTimes(1)
    })
  })

  it('37 - Snapshot del modo creación', () => {
    const { container } = render(<UserForm formData={baseFormData} onChange={mockOnChange} onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEditing={false} isSaving={false} />)
    expect(container).toMatchSnapshot()
  })
})