import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserCard } from '../../../src/components/Accounts/UserCard'

describe('UserCard', () => {
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  const baseUser = {
    id: '1',
    fullName: 'Matias Wormald',
    email: 'matias@userena.cl',
    role: 'admin',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Renderizado general', () => {
    it('01 - Renderiza nombre completo del usuario', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      expect(screen.getByText('Matias Wormald')).toBeInTheDocument()
    })
    it('02 - Renderiza correo del usuario', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      expect(screen.getByText('matias@userena.cl')).toBeInTheDocument()
    })
    it('03 - Renderiza letra inicial basada en fullName', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      expect(screen.getByText('M')).toBeInTheDocument()
    })
    it('04 - Renderiza el contenedor article de la tarjeta', () => {
      const { container } = render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      expect(container.querySelector('article')).toBeInTheDocument()
    })
  })

  describe('Rol y badge', () => {
    it('05 - Muestra "Administrador" cuando role=admin', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      expect(screen.getByText('Administrador')).toBeInTheDocument()
    })
    it('06 - Muestra "Egresado" cuando role=alumni', () => {
      render(<UserCard user={{ ...baseUser, role: 'alumni' }} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      expect(screen.getByText('Egresado')).toBeInTheDocument()
    })
    it('07 - Muestra "Docente" cuando role=teacher', () => {
      render(<UserCard user={{ ...baseUser, role: 'teacher' }} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      expect(screen.getByText('Docente')).toBeInTheDocument()
    })
    it('08 - Si role no existe en ROLE_OPTIONS, muestra el valor original', () => {
      render(<UserCard user={{ ...baseUser, role: 'unknown' }} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      expect(screen.getByText('unknown')).toBeInTheDocument()
    })
    it('09 - Aplica estilos badge admin correctamente', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      const badge = screen.getByText('Administrador')
      expect(badge.className).toContain('bg-[#722b4d]/10')
      expect(badge.className).toContain('text-[#722b4d]')
    })
    it('10 - Aplica estilos badge alumni correctamente', () => {
      render(<UserCard user={{ ...baseUser, role: 'alumni' }} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      const badge = screen.getByText('Egresado')
      expect(badge.className).toContain('bg-blue-100')
      expect(badge.className).toContain('text-blue-700')
    })
    it('11 - Aplica estilos badge default para otros roles', () => {
      render(<UserCard user={{ ...baseUser, role: 'teacher' }} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      const badge = screen.getByText('Docente')
      expect(badge.className).toContain('bg-gray-100')
      expect(badge.className).toContain('text-gray-700')
    })
  })

  describe('Acciones', () => {
    it('12 - Botón "Editar" siempre visible', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={false} />)
      expect(screen.getByText('Editar')).toBeInTheDocument()
    })
    it('13 - Click en "Editar" llama onEdit(user)', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      fireEvent.click(screen.getByText('Editar'))
      expect(mockOnEdit).toHaveBeenCalledWith(baseUser)
    })
    it('14 - Botón "Eliminar" visible cuando canDelete=true', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      expect(screen.getByText('Eliminar')).toBeInTheDocument()
    })
    it('15 - Click en "Eliminar" llama onDelete(user.id)', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      fireEvent.click(screen.getByText('Eliminar'))
      expect(mockOnDelete).toHaveBeenCalledWith('1')
    })
    it('16 - Botón "Eliminar" no aparece cuando canDelete=false', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={false} />)
      expect(screen.queryByText('Eliminar')).not.toBeInTheDocument()
    })
  })

  describe('Casos borde', () => {
    it('17 - Usa "U" como inicial si fullName está vacío', () => {
      render(<UserCard user={{ ...baseUser, fullName: '' }} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      expect(screen.getByText('U')).toBeInTheDocument()
    })
    it('18 - Usa "U" como inicial si fullName es undefined', () => {
      render(<UserCard user={{ ...baseUser, fullName: undefined }} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      expect(screen.getByText('U')).toBeInTheDocument()
    })
    it('19 - Tolera user.role desconocido sin romper render', () => {
      expect(() => {
        render(<UserCard user={{ ...baseUser, role: 'xyz' }} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      }).not.toThrow()
    })
  })

  describe('Accesibilidad', () => {
    it('20 - Renderiza dos botones cuando canDelete=true', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      expect(screen.getAllByRole('button')).toHaveLength(2)
    })
    it('21 - Renderiza un solo botón cuando canDelete=false', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={false} />)
      expect(screen.getAllByRole('button')).toHaveLength(1)
    })
    it('22 - Los botones tienen type="button"', () => {
      render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
      screen.getAllByRole('button').forEach(btn => expect(btn).toHaveAttribute('type', 'button'))
    })
  })

  it('23 - Snapshot del estado con admin y canDelete=true', () => {
    const { container } = render(<UserCard user={baseUser} onEdit={mockOnEdit} onDelete={mockOnDelete} canDelete={true} />)
    expect(container).toMatchSnapshot()
  })
})