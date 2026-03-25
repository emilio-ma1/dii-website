import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Noticias from '../../pages/Noticias'

describe('Noticias', () => {
  describe('Renderizado general', () => {
    it('01 - Renderiza el título principal "NOTICIAS"')
    it('02 - Renderiza el contenedor principal')
    it('03 - Renderiza el contenedor centrado interno')
    it('04 - Renderiza la barra decorativa inferior al título')
  })

  describe('Accesibilidad y semántica', () => {
    it('05 - Existe un único heading principal h1')
    it('06 - El heading principal tiene el texto correcto')
  })

  it('07 - Snapshot del estado inicial')
})
