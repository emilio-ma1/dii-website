import { describe, it, expect } from 'vitest'
import { ROLES, ROLE_LABELS, MENU_BY_ROLE } from '../../src/auth/roles'

describe('roles', () => {
  describe('ROLES', () => {
    it('01 - Define ADMIN como "admin"', () => {
      expect(ROLES.ADMIN).toBe('admin')
    })
    it('02 - Define EGRESADO como "egresado"', () => {
      expect(ROLES.EGRESADO).toBe('egresado')
    })
    it('03 - Define DOCENTE como "docente"', () => {
      expect(ROLES.DOCENTE).toBe('docente')
    })
    it('04 - Contiene exactamente los tres roles esperados', () => {
      expect(Object.keys(ROLES)).toHaveLength(3)
    })
  })

  describe('ROLE_LABELS', () => {
    it('05 - Asocia admin con "Administrador"', () => {
      expect(ROLE_LABELS['admin']).toBe('Administrador')
    })
    it('06 - Asocia egresado con "Egresado"', () => {
      expect(ROLE_LABELS['egresado']).toBe('Egresado')
    })
    it('07 - Asocia docente con "Docente"', () => {
      expect(ROLE_LABELS['docente']).toBe('Docente')
    })
    it('08 - Tiene label para cada rol definido en ROLES', () => {
      Object.values(ROLES).forEach(role => {
        expect(ROLE_LABELS[role]).toBeDefined()
      })
    })
  })

  describe('MENU_BY_ROLE', () => {
    it('09 - Define menú para ADMIN', () => {
      expect(MENU_BY_ROLE['admin']).toBeDefined()
    })
    it('10 - Define menú para EGRESADO', () => {
      expect(MENU_BY_ROLE['egresado']).toBeDefined()
    })
    it('11 - Define menú para DOCENTE', () => {
      expect(MENU_BY_ROLE['docente']).toBeDefined()
    })
    it('12 - El menú de ADMIN contiene 7 opciones', () => {
      expect(MENU_BY_ROLE['admin']).toHaveLength(7)
    })
    it('13 - El menú de EGRESADO contiene 2 opciones', () => {
      expect(MENU_BY_ROLE['egresado']).toHaveLength(2)
    })
    it('14 - El menú de DOCENTE contiene 1 opción', () => {
      expect(MENU_BY_ROLE['docente']).toHaveLength(1)
    })
  })

  describe('Menú ADMIN', () => {
    it('15 - Incluye "Gestión de Cuentas" con ruta /admin/cuentas', () => {
      expect(MENU_BY_ROLE['admin']).toContainEqual({ label: 'Gestión de Cuentas', to: '/admin/cuentas' })
    })
    it('16 - Incluye "Gestión de Investigaciones" con ruta /admin/investigaciones', () => {
      expect(MENU_BY_ROLE['admin']).toContainEqual({ label: 'Gestión de Investigaciones', to: '/admin/investigaciones' })
    })
    it('17 - Incluye "Gestión Vinculación con el Medio" con ruta /admin/vinculacion', () => {
      expect(MENU_BY_ROLE['admin']).toContainEqual({ label: 'Gestión Vinculación con el Medio', to: '/admin/vinculacion' })
    })
    it('18 - Incluye "Gestión de Docentes" con ruta /admin/docentes', () => {
      expect(MENU_BY_ROLE['admin']).toContainEqual({ label: 'Gestión de Docentes', to: '/admin/docentes' })
    })
    it('19 - Incluye "Gestión de Estudiantes" con ruta /admin/estudiantes', () => {
      expect(MENU_BY_ROLE['admin']).toContainEqual({ label: 'Gestión de Estudiantes', to: '/admin/estudiantes' })
    })
    it('20 - Incluye "Gestión de Contacto" con ruta /admin/contacto', () => {
      expect(MENU_BY_ROLE['admin']).toContainEqual({ label: 'Gestión de Contacto', to: '/admin/contacto' })
    })
    it('21 - Incluye "Gestión de Equipamiento" con ruta /admin/equipamiento', () => {
      expect(MENU_BY_ROLE['admin']).toContainEqual({ label: 'Gestión de Equipamiento', to: '/admin/equipamiento' })
    })
  })

  describe('Menú EGRESADO', () => {
    it('22 - Incluye "Gestión de Investigaciones" con ruta /admin/investigaciones', () => {
      expect(MENU_BY_ROLE['egresado']).toContainEqual({ label: 'Gestión de Investigaciones', to: '/admin/investigaciones' })
    })
    it('23 - Incluye "Gestión de Vinculación con el Medio" con ruta /admin/vinculacion', () => {
      expect(MENU_BY_ROLE['egresado']).toContainEqual({ label: 'Gestión de Vinculación con el Medio', to: '/admin/vinculacion' })
    })
  })

  describe('Menú DOCENTE', () => {
    it('24 - Incluye "Gestión de Investigaciones" con ruta /admin/investigaciones', () => {
      expect(MENU_BY_ROLE['docente']).toContainEqual({ label: 'Gestión de Investigaciones', to: '/admin/investigaciones' })
    })
  })

  describe('Estructura de items', () => {
    it('25 - Todos los ítems del menú tienen propiedad label', () => {
      Object.values(MENU_BY_ROLE).flat().forEach(item => {
        expect(item).toHaveProperty('label')
      })
    })
    it('26 - Todos los ítems del menú tienen propiedad to', () => {
      Object.values(MENU_BY_ROLE).flat().forEach(item => {
        expect(item).toHaveProperty('to')
      })
    })
    it('27 - Todas las rutas del menú comienzan con /admin', () => {
      Object.values(MENU_BY_ROLE).flat().forEach(item => {
        expect(item.to).toMatch(/^\/admin/)
      })
    })
  })
})