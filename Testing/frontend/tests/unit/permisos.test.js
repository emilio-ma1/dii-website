import { describe, it, expect } from 'vitest'
import { PERMISSIONS } from '../../src/auth/permisos'
import { ROLES } from '../../src/auth/roles'

describe('permisos', () => {
  const allPermissionKeys = [
    'createProject', 'editProject', 'deleteProject', 'manageAccounts',
    'createTeacher', 'editTeacher', 'deleteTeacher',
    'createStudent', 'editStudent', 'deleteStudent',
    'createContact', 'editContact', 'deleteContact',
    'createEquipment', 'editEquipment', 'deleteEquipment',
  ]

  describe('Estructura general', () => {
    it('01 - Exporta permisos para ADMIN', () => {
      expect(PERMISSIONS[ROLES.ADMIN]).toBeDefined()
    })
    it('02 - Exporta permisos para EGRESADO', () => {
      expect(PERMISSIONS[ROLES.EGRESADO]).toBeDefined()
    })
    it('03 - Exporta permisos para DOCENTE', () => {
      expect(PERMISSIONS[ROLES.DOCENTE]).toBeDefined()
    })
    it('04 - Cada rol tiene todas las claves de permisos esperadas', () => {
      Object.values(ROLES).forEach(role => {
        allPermissionKeys.forEach(key => {
          expect(PERMISSIONS[role]).toHaveProperty(key)
        })
      })
    })
  })

  describe('Permisos ADMIN', () => {
    it('05 - ADMIN puede createProject', () => {
      expect(PERMISSIONS[ROLES.ADMIN].createProject).toBe(true)
    })
    it('06 - ADMIN puede editProject', () => {
      expect(PERMISSIONS[ROLES.ADMIN].editProject).toBe(true)
    })
    it('07 - ADMIN puede deleteProject', () => {
      expect(PERMISSIONS[ROLES.ADMIN].deleteProject).toBe(true)
    })
    it('08 - ADMIN puede manageAccounts', () => {
      expect(PERMISSIONS[ROLES.ADMIN].manageAccounts).toBe(true)
    })
    it('09 - ADMIN puede createTeacher', () => {
      expect(PERMISSIONS[ROLES.ADMIN].createTeacher).toBe(true)
    })
    it('10 - ADMIN puede editTeacher', () => {
      expect(PERMISSIONS[ROLES.ADMIN].editTeacher).toBe(true)
    })
    it('11 - ADMIN puede deleteTeacher', () => {
      expect(PERMISSIONS[ROLES.ADMIN].deleteTeacher).toBe(true)
    })
    it('12 - ADMIN puede createStudent', () => {
      expect(PERMISSIONS[ROLES.ADMIN].createStudent).toBe(true)
    })
    it('13 - ADMIN puede editStudent', () => {
      expect(PERMISSIONS[ROLES.ADMIN].editStudent).toBe(true)
    })
    it('14 - ADMIN puede deleteStudent', () => {
      expect(PERMISSIONS[ROLES.ADMIN].deleteStudent).toBe(true)
    })
    it('15 - ADMIN puede createContact', () => {
      expect(PERMISSIONS[ROLES.ADMIN].createContact).toBe(true)
    })
    it('16 - ADMIN puede editContact', () => {
      expect(PERMISSIONS[ROLES.ADMIN].editContact).toBe(true)
    })
    it('17 - ADMIN puede deleteContact', () => {
      expect(PERMISSIONS[ROLES.ADMIN].deleteContact).toBe(true)
    })
    it('18 - ADMIN puede createEquipment', () => {
      expect(PERMISSIONS[ROLES.ADMIN].createEquipment).toBe(true)
    })
    it('19 - ADMIN puede editEquipment', () => {
      expect(PERMISSIONS[ROLES.ADMIN].editEquipment).toBe(true)
    })
    it('20 - ADMIN puede deleteEquipment', () => {
      expect(PERMISSIONS[ROLES.ADMIN].deleteEquipment).toBe(true)
    })
  })

  describe('Permisos EGRESADO', () => {
    it('21 - EGRESADO puede createProject', () => {
      expect(PERMISSIONS[ROLES.EGRESADO].createProject).toBe(true)
    })
    it('22 - EGRESADO puede editProject', () => {
      expect(PERMISSIONS[ROLES.EGRESADO].editProject).toBe(true)
    })
    it('23 - EGRESADO no puede deleteProject', () => {
      expect(PERMISSIONS[ROLES.EGRESADO].deleteProject).toBe(false)
    })
    it('24 - EGRESADO no puede manageAccounts', () => {
      expect(PERMISSIONS[ROLES.EGRESADO].manageAccounts).toBe(false)
    })
    it('25 - EGRESADO no puede gestionar docentes', () => {
      expect(PERMISSIONS[ROLES.EGRESADO].createTeacher).toBe(false)
      expect(PERMISSIONS[ROLES.EGRESADO].editTeacher).toBe(false)
      expect(PERMISSIONS[ROLES.EGRESADO].deleteTeacher).toBe(false)
    })
    it('26 - EGRESADO no puede gestionar estudiantes', () => {
      expect(PERMISSIONS[ROLES.EGRESADO].createStudent).toBe(false)
      expect(PERMISSIONS[ROLES.EGRESADO].editStudent).toBe(false)
      expect(PERMISSIONS[ROLES.EGRESADO].deleteStudent).toBe(false)
    })
    it('27 - EGRESADO no puede gestionar contacto', () => {
      expect(PERMISSIONS[ROLES.EGRESADO].createContact).toBe(false)
      expect(PERMISSIONS[ROLES.EGRESADO].editContact).toBe(false)
      expect(PERMISSIONS[ROLES.EGRESADO].deleteContact).toBe(false)
    })
    it('28 - EGRESADO no puede gestionar equipamiento', () => {
      expect(PERMISSIONS[ROLES.EGRESADO].createEquipment).toBe(false)
      expect(PERMISSIONS[ROLES.EGRESADO].editEquipment).toBe(false)
      expect(PERMISSIONS[ROLES.EGRESADO].deleteEquipment).toBe(false)
    })
  })

  describe('Permisos DOCENTE', () => {
    it('29 - DOCENTE puede createProject', () => {
      expect(PERMISSIONS[ROLES.DOCENTE].createProject).toBe(true)
    })
    it('30 - DOCENTE puede editProject', () => {
      expect(PERMISSIONS[ROLES.DOCENTE].editProject).toBe(true)
    })
    it('31 - DOCENTE no puede deleteProject', () => {
      expect(PERMISSIONS[ROLES.DOCENTE].deleteProject).toBe(false)
    })
    it('32 - DOCENTE no puede manageAccounts', () => {
      expect(PERMISSIONS[ROLES.DOCENTE].manageAccounts).toBe(false)
    })
    it('33 - DOCENTE no puede gestionar docentes', () => {
      expect(PERMISSIONS[ROLES.DOCENTE].createTeacher).toBe(false)
      expect(PERMISSIONS[ROLES.DOCENTE].editTeacher).toBe(false)
      expect(PERMISSIONS[ROLES.DOCENTE].deleteTeacher).toBe(false)
    })
    it('34 - DOCENTE no puede gestionar estudiantes', () => {
      expect(PERMISSIONS[ROLES.DOCENTE].createStudent).toBe(false)
      expect(PERMISSIONS[ROLES.DOCENTE].editStudent).toBe(false)
      expect(PERMISSIONS[ROLES.DOCENTE].deleteStudent).toBe(false)
    })
    it('35 - DOCENTE no puede gestionar contacto', () => {
      expect(PERMISSIONS[ROLES.DOCENTE].createContact).toBe(false)
      expect(PERMISSIONS[ROLES.DOCENTE].editContact).toBe(false)
      expect(PERMISSIONS[ROLES.DOCENTE].deleteContact).toBe(false)
    })
    it('36 - DOCENTE no puede gestionar equipamiento', () => {
      expect(PERMISSIONS[ROLES.DOCENTE].createEquipment).toBe(false)
      expect(PERMISSIONS[ROLES.DOCENTE].editEquipment).toBe(false)
      expect(PERMISSIONS[ROLES.DOCENTE].deleteEquipment).toBe(false)
    })
  })

  describe('Consistencia', () => {
    it('37 - ADMIN tiene todos los permisos en true', () => {
      allPermissionKeys.forEach(key => {
        expect(PERMISSIONS[ROLES.ADMIN][key]).toBe(true)
      })
    })
    it('38 - EGRESADO solo tiene createProject y editProject en true', () => {
      const trueKeys = allPermissionKeys.filter(key => PERMISSIONS[ROLES.EGRESADO][key] === true)
      expect(trueKeys).toEqual(['createProject', 'editProject'])
    })
    it('39 - DOCENTE solo tiene createProject y editProject en true', () => {
      const trueKeys = allPermissionKeys.filter(key => PERMISSIONS[ROLES.DOCENTE][key] === true)
      expect(trueKeys).toEqual(['createProject', 'editProject'])
    })
    it('40 - EGRESADO y DOCENTE tienen exactamente los mismos permisos', () => {
      expect(PERMISSIONS[ROLES.EGRESADO]).toEqual(PERMISSIONS[ROLES.DOCENTE])
    })
  })
})