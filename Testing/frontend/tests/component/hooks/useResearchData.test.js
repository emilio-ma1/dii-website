import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useResearchData } from '../../hooks/useResearchData'

describe('useResearchData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    import.meta.env.VITE_API_URL = 'http://localhost:3000'
    localStorage.setItem('token', 'fake-token')

    vi.stubGlobal('fetch', vi.fn())
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  describe('Estado inicial', () => {
    it('01 - Inicia con availableAuthors vacío')
    it('02 - Inicia con categories vacío')
  })

  describe('Control de ejecución', () => {
    it('03 - Si shouldFetch=false no ejecuta fetch')
    it('04 - Si shouldFetch=true ejecuta fetch de usuarios y categorías')
  })

  describe('Carga de autores', () => {
    it('05 - Hace fetch a /api/users con Authorization Bearer token')
    it('06 - Filtra solo usuarios con role teacher o alumni')
    it('07 - Excluye usuarios con otros roles')
    it('08 - Normaliza autores a { id, full_name, role }')
    it('09 - Guarda autores filtrados en availableAuthors')
  })

  describe('Carga de categorías', () => {
    it('10 - Hace fetch a /api/categories con Authorization Bearer token')
    it('11 - Guarda categorías en categories cuando la respuesta es ok')
    it('12 - Si categories response no es ok mantiene categories vacío')
  })

  describe('Manejo de respuestas no ok', () => {
    it('13 - Si users response no es ok mantiene availableAuthors vacío')
    it('14 - Si users response no es ok igual intenta cargar categorías')
    it('15 - Si categories response no es ok no rompe el hook')
  })

  describe('Errores de red', () => {
    it('16 - Si fetch falla hace console.error')
    it('17 - Si fetch falla mantiene availableAuthors vacío')
    it('18 - Si fetch falla mantiene categories vacío')
  })

  describe('Consistencia', () => {
    it('19 - Hace exactamente dos llamadas fetch cuando shouldFetch=true')
    it('20 - Ambas llamadas usan el mismo header Authorization')
  })

  it('21 - Snapshot lógico del estado inicial')
})
