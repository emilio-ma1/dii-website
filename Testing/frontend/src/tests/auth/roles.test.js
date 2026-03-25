import { describe, it, expect } from 'vitest'
import { ROLES, ROLE_LABELS, MENU_BY_ROLE } from '../../auth/roles'

describe('roles', () => {
  describe('ROLES', () => {
    it('01 - Define ADMIN como "admin"')
    it('02 - Define EGRESADO como "egresado"')
    it('03 - Define DOCENTE como "docente"')
    it('04 - Contiene exactamente los tres roles esperados')
  })

  describe('ROLE_LABELS', () => {
    it('05 - Asocia admin con "Administrador"')
    it('06 - Asocia egresado con "Egresado"')
    it('07 - Asocia docente con "Docente"')
    it('08 - Tiene label para cada rol definido en ROLES')
  })

  describe('MENU_BY_ROLE', () => {
    it('09 - Define menú para ADMIN')
    it('10 - Define menú para EGRESADO')
    it('11 - Define menú para DOCENTE')
    it('12 - El menú de ADMIN contiene 7 opciones')
    it('13 - El menú de EGRESADO contiene 2 opciones')
    it('14 - El menú de DOCENTE contiene 1 opción')
  })

  describe('Menú ADMIN', () => {
    it('15 - Incluye "Gestión de Cuentas" con ruta /admin/cuentas')
    it('16 - Incluye "Gestión de Investigaciones" con ruta /admin/investigaciones')
    it('17 - Incluye "Gestión Vinculación con el Medio" con ruta /admin/vinculacion')
    it('18 - Incluye "Gestión de Docentes" con ruta /admin/docentes')
    it('19 - Incluye "Gestión de Estudiantes" con ruta /admin/estudiantes')
    it('20 - Incluye "Gestión de Contacto" con ruta /admin/contacto')
    it('21 - Incluye "Gestión de Equipamiento" con ruta /admin/equipamiento')
  })

  describe('Menú EGRESADO', () => {
    it('22 - Incluye "Gestión de Investigaciones" con ruta /admin/investigaciones')
    it('23 - Incluye "Gestión de Vinculación con el Medio" con ruta /admin/vinculacion')
  })

  describe('Menú DOCENTE', () => {
    it('24 - Incluye "Gestión de Investigaciones" con ruta /admin/investigaciones')
  })

  describe('Estructura de items', () => {
    it('25 - Todos los ítems del menú tienen propiedad label')
    it('26 - Todos los ítems del menú tienen propiedad to')
    it('27 - Todas las rutas del menú comienzan con /admin')
  })
})
