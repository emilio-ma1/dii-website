import { vi } from 'vitest'

// Obtener el prototipo nivel 2 donde vive query
const poolModule = await import('../../../config/db')
const pool = poolModule.default ?? poolModule

let proto = pool
for (let i = 0; i < 2; i++) proto = Object.getPrototypeOf(proto)

// Reemplazar query en ese prototipo exacto
proto.query = vi.fn()

const alumniModule = await import('../../../models/alumniModel')
const AlumniModel = alumniModule.default ?? alumniModule

describe('alumniModel', () => {
  beforeEach(() => {
    proto.query.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAll', () => {
    it('01 - Llama pool.query una vez', async () => {
      proto.query.mockResolvedValue({ rows: [] })
      await AlumniModel.getAll()
      expect(proto.query).toHaveBeenCalledTimes(1)
    })

    it('02 - Ejecuta la consulta con joins de users, alumni_profiles, project_authors y projects', async () => {
      proto.query.mockResolvedValue({ rows: [] })
      await AlumniModel.getAll()
      const sql = proto.query.mock.calls[0][0]
      expect(sql).toMatch(/alumni_profiles/)
      expect(sql).toMatch(/project_authors/)
      expect(sql).toMatch(/projects/)
      expect(sql).toMatch(/users/)
    })

    it('03 - Filtra por u.role = alumni', async () => {
      proto.query.mockResolvedValue({ rows: [] })
      await AlumniModel.getAll()
      const sql = proto.query.mock.calls[0][0]
      expect(sql).toMatch(/u\.role\s*=\s*'alumni'/)
    })

    it('04 - Retorna rows cuando la consulta es exitosa', async () => {
      const fakeRows = [{ id: 1, full_name: 'Juan' }]
      proto.query.mockResolvedValue({ rows: fakeRows })
      const result = await AlumniModel.getAll()
      expect(result).toEqual(fakeRows)
    })

    it('05 - Retorna arreglo vacío si no hay egresados', async () => {
      proto.query.mockResolvedValue({ rows: [] })
      const result = await AlumniModel.getAll()
      expect(result).toEqual([])
    })

    it('06 - Hace console.error y relanza error si la consulta falla', async () => {
      proto.query.mockRejectedValue(new Error('DB error'))
      await expect(AlumniModel.getAll()).rejects.toThrow('DB error')
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('upsert', () => {
    const payload = {
      user_id: 1,
      degree: 'Ingeniería',
      specialty: 'Software',
      video_url_embed: 'https://video.url',
      is_profile_public: true,
      imageData: null,
      imageMimetype: null,
    }

    it('07 - Llama pool.query con INSERT INTO alumni_profiles', async () => {
      proto.query.mockResolvedValue({ rows: [payload] })
      await AlumniModel.upsert(payload)
      const sql = proto.query.mock.calls[0][0]
      expect(sql).toMatch(/INSERT INTO alumni_profiles/)
    })

    it('08 - Ejecuta ON CONFLICT (user_id)', async () => {
      proto.query.mockResolvedValue({ rows: [payload] })
      await AlumniModel.upsert(payload)
      const sql = proto.query.mock.calls[0][0]
      expect(sql).toMatch(/ON CONFLICT \(user_id\)/)
    })

    it('09 - Usa COALESCE para image_data e image_mimetype', async () => {
      proto.query.mockResolvedValue({ rows: [payload] })
      await AlumniModel.upsert(payload)
      const sql = proto.query.mock.calls[0][0]
      expect(sql).toMatch(/COALESCE\(EXCLUDED\.image_data/)
      expect(sql).toMatch(/COALESCE\(EXCLUDED\.image_mimetype/)
    })

    it('10 - Envía values en el orden correcto', async () => {
      proto.query.mockResolvedValue({ rows: [payload] })
      await AlumniModel.upsert(payload)
      const values = proto.query.mock.calls[0][1]
      expect(values).toEqual([
        payload.user_id,
        payload.degree,
        payload.specialty,
        payload.video_url_embed,
        payload.is_profile_public,
        payload.imageData,
        payload.imageMimetype,
      ])
    })

    it('11 - Retorna rows[0] cuando el upsert es exitoso', async () => {
      const fakeRow = { user_id: 1, degree: 'Ingeniería', specialty: 'Software' }
      proto.query.mockResolvedValue({ rows: [fakeRow] })
      const result = await AlumniModel.upsert(payload)
      expect(result).toEqual(fakeRow)
    })

    it('12 - Hace console.error y relanza error si el upsert falla', async () => {
      proto.query.mockRejectedValue(new Error('upsert fail'))
      await expect(AlumniModel.upsert(payload)).rejects.toThrow('upsert fail')
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('delete', () => {
    it('13 - Llama pool.query con DELETE FROM alumni_profiles WHERE user_id = $1', async () => {
      proto.query.mockResolvedValue({ rows: [{ user_id: 1 }] })
      await AlumniModel.delete(1)
      const sql = proto.query.mock.calls[0][0]
      expect(sql).toMatch(/DELETE FROM alumni_profiles WHERE user_id = \$1/)
    })

    it('14 - Retorna rows[0] si elimina un perfil existente', async () => {
      const fakeRow = { user_id: 1 }
      proto.query.mockResolvedValue({ rows: [fakeRow] })
      const result = await AlumniModel.delete(1)
      expect(result).toEqual(fakeRow)
    })

    it('15 - Retorna null si no existe perfil para ese user_id', async () => {
      proto.query.mockResolvedValue({ rows: [] })
      const result = await AlumniModel.delete(999)
      expect(result).toBeNull()
    })

    it('16 - Hace console.error y relanza error si delete falla', async () => {
      proto.query.mockRejectedValue(new Error('delete fail'))
      await expect(AlumniModel.delete(1)).rejects.toThrow('delete fail')
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('getImage', () => {
    it('17 - Llama pool.query con SELECT image_data, image_mimetype', async () => {
      proto.query.mockResolvedValue({ rows: [{ image_data: Buffer.from('img'), image_mimetype: 'image/png' }] })
      await AlumniModel.getImage(1)
      const sql = proto.query.mock.calls[0][0]
      expect(sql).toMatch(/SELECT image_data, image_mimetype/)
    })

    it('18 - Retorna rows[0] si la imagen existe', async () => {
      const fakeRow = { image_data: Buffer.from('img'), image_mimetype: 'image/png' }
      proto.query.mockResolvedValue({ rows: [fakeRow] })
      const result = await AlumniModel.getImage(1)
      expect(result).toEqual(fakeRow)
    })

    it('19 - Retorna null si la imagen no existe', async () => {
      proto.query.mockResolvedValue({ rows: [] })
      const result = await AlumniModel.getImage(999)
      expect(result).toBeNull()
    })

    it('20 - Hace console.error y relanza error si getImage falla', async () => {
      proto.query.mockRejectedValue(new Error('getImage fail'))
      await expect(AlumniModel.getImage(1)).rejects.toThrow('getImage fail')
      expect(console.error).toHaveBeenCalled()
    })
  })
})