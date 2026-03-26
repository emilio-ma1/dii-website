import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../config/db', () => ({
  query: vi.fn(),
  connect: vi.fn(),
}))

const pool = require('../../config/db')
const ProjectModel = require('../../models/projectModel')

describe('projectModel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('getAll', () => {
    it('01 - Llama pool.query una vez')
    it('02 - Ejecuta la consulta de proyectos con authors y category_name')
    it('03 - Retorna rows cuando la consulta es exitosa')
    it('04 - Retorna arreglo vacío si no hay proyectos')
    it('05 - Hace console.error y relanza error si la consulta falla')
  })

  describe('getById', () => {
    it('06 - Llama pool.query con WHERE p.id = $1')
    it('07 - Retorna rows[0] si el proyecto existe')
    it('08 - Retorna null si el proyecto no existe')
    it('09 - Hace console.error y relanza error si la consulta falla')
  })

  describe('create', () => {
    it('10 - Llama pool.connect y comienza transacción con BEGIN')
    it('11 - Inserta el proyecto con campos binarios y retorna info ligera')
    it('12 - Si authorIds existe inserta relaciones en project_authors')
    it('13 - Si authorIds está vacío no inserta autores')
    it('14 - Hace COMMIT cuando create es exitoso')
    it('15 - Retorna el proyecto creado')
    it('16 - Hace ROLLBACK si ocurre error')
    it('17 - Libera client con release al finalizar')
    it('18 - Hace console.error y relanza error si create falla')
  })

  describe('update', () => {
    it('19 - Llama pool.connect y comienza transacción con BEGIN')
    it('20 - Actualiza el proyecto con COALESCE para archivos')
    it('21 - Elimina autores previos de project_authors')
    it('22 - Inserta autores nuevos si authorIds existe')
    it('23 - Si authorIds está vacío no inserta autores nuevos')
    it('24 - Hace COMMIT cuando update es exitoso')
    it('25 - Retorna el proyecto actualizado')
    it('26 - Hace ROLLBACK si ocurre error')
    it('27 - Libera client con release al finalizar')
    it('28 - Hace console.error y relanza error si update falla')
  })

  describe('delete', () => {
    it('29 - Llama pool.query con DELETE FROM projects WHERE id = $1')
    it('30 - Retorna rows[0] si elimina un proyecto existente')
    it('31 - Retorna null si el proyecto no existe')
    it('32 - Hace console.error y relanza error si delete falla')
  })

  describe('getByAuthorId', () => {
    it('33 - Llama pool.query con WHERE pa.user_id = $1')
    it('34 - Retorna rows cuando la consulta es exitosa')
    it('35 - Retorna arreglo vacío si no hay proyectos del autor')
    it('36 - Hace console.error y relanza error si la consulta falla')
  })

  describe('getImage', () => {
    it('37 - Llama pool.query con SELECT image_data, image_mimetype')
    it('38 - Retorna rows[0] si la imagen existe')
    it('39 - Retorna null si la imagen no existe')
    it('40 - Hace console.error y relanza error si la consulta falla')
  })

  describe('getPdf', () => {
    it('41 - Llama pool.query con SELECT pdf_data, pdf_mimetype')
    it('42 - Retorna rows[0] si el PDF existe')
    it('43 - Retorna null si el PDF no existe')
    it('44 - Hace console.error y relanza error si la consulta falla')
  })
})