import { describe, it, expect } from 'vitest'
import { PERMISSIONS } from '../../auth/permisos'
import { ROLES } from '../../auth/roles'

describe('permisos', () => {
  const allPermissionKeys = [
    'createProject',
    'editProject',
    'deleteProject',
    'manageAccounts',
    'createTeacher',
    'editTeacher',
    'deleteTeacher',
    'createStudent',
    'editStudent',
    'deleteStudent',
    'createContact',
    'editContact',
    'deleteContact',
    'createEquipment',
    'editEquipment',
    'deleteEquipment',
  ]

  describe('Estructura general', () => {
    it('01 - Exporta permisos para ADMIN')
    it('02 - Exporta permisos para EGRESADO')
    it('03 - Exporta permisos para DOCENTE')
    it('04 - Cada rol tiene todas las claves de permisos esperadas')
  })

  describe('Permisos ADMIN', () => {
    it('05 - ADMIN puede createProject')
    it('06 - ADMIN puede editProject')
    it('07 - ADMIN puede deleteProject')
    it('08 - ADMIN puede manageAccounts')
    it('09 - ADMIN puede createTeacher')
    it('10 - ADMIN puede editTeacher')
    it('11 - ADMIN puede deleteTeacher')
    it('12 - ADMIN puede createStudent')
    it('13 - ADMIN puede editStudent')
    it('14 - ADMIN puede deleteStudent')
    it('15 - ADMIN puede createContact')
    it('16 - ADMIN puede editContact')
    it('17 - ADMIN puede deleteContact')
    it('18 - ADMIN puede createEquipment')
    it('19 - ADMIN puede editEquipment')
    it('20 - ADMIN puede deleteEquipment')
  })

  describe('Permisos EGRESADO', () => {
    it('21 - EGRESADO puede createProject')
    it('22 - EGRESADO puede editProject')
    it('23 - EGRESADO no puede deleteProject')
    it('24 - EGRESADO no puede manageAccounts')
    it('25 - EGRESADO no puede gestionar docentes')
    it('26 - EGRESADO no puede gestionar estudiantes')
    it('27 - EGRESADO no puede gestionar contacto')
    it('28 - EGRESADO no puede gestionar equipamiento')
  })

  describe('Permisos DOCENTE', () => {
    it('29 - DOCENTE puede createProject')
    it('30 - DOCENTE puede editProject')
    it('31 - DOCENTE no puede deleteProject')
    it('32 - DOCENTE no puede manageAccounts')
    it('33 - DOCENTE no puede gestionar docentes')
    it('34 - DOCENTE no puede gestionar estudiantes')
    it('35 - DOCENTE no puede gestionar contacto')
    it('36 - DOCENTE no puede gestionar equipamiento')
  })

  describe('Consistencia', () => {
    it('37 - ADMIN tiene todos los permisos en true')
    it('38 - EGRESADO solo tiene createProject y editProject en true')
    it('39 - DOCENTE solo tiene createProject y editProject en true')
    it('40 - EGRESADO y DOCENTE tienen exactamente los mismos permisos')
  })
})
