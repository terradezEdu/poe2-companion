import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SelectedAreaPreview } from '../../src/campaign/preview/SelectedAreaPreview.tsx'
import { SUPPORTED_CAMPAIGN_SCHEMA_VERSION } from '../../src/campaign/domain/model.ts'
import { validateCampaignDataset } from '../../src/campaign/validation/campaign-validator.ts'

function previewFor(overrides: Record<string, unknown> = {}) {
  const result = validateCampaignDataset({
    schemaVersion: SUPPORTED_CAMPAIGN_SCHEMA_VERSION,
    acts: [{
      id: 'act-1',
      areas: [{
        id: 'area-a',
        name: 'Área A',
        level: 12,
        danger: 'HIGH',
        hardcoreWarning: 'Daño físico explosivo',
        rewards: ['Recompensa A'],
        pointsOfInterest: ['Punto A'],
        curiosities: ['Curiosidad A'],
        bosses: [{
          id: 'boss-alfa',
          name: 'Jefe Alfa',
          description: 'Un jefe feroz.',
          damageTypes: ['Daño físico'],
          weaknesses: ['Frío'],
          resistances: ['Fuego'],
          dangerousMechanics: ['Golpe de onda'],
          rewards: ['Recompensa Alfa'],
          verification: { status: 'VERIFIED', sources: ['Fuente Alfa'], verifiedAt: '2025-01-01' },
        }],
        verification: { status: 'VERIFIED', sources: ['Fuente Área'], verifiedAt: '2025-02-01' },
        ...overrides,
      }],
    }],
    connections: [],
  })
  assert.equal(result.ok, true)
  if (!result.ok) throw new Error('Fixture should validate.')
  return result.dataset.act.areas[0]
}

function fieldText(html: string, field: string) {
  const fieldMarkup = html.match(new RegExp(`<div class="preview-field" data-testid="record-field-${field}">([\\s\\S]*?)<\\/div>`))?.[1]
  assert.ok(fieldMarkup, `Expected the ${field} field to be rendered.`)
  const label = fieldMarkup.match(/<dt>([\s\S]*?)<\/dt>/)?.[1]
  const value = fieldMarkup.match(/<dd>([\s\S]*?)<\/dd>/)?.[1]
  assert.ok(label, `Expected the ${field} field to have a label.`)
  assert.ok(value, `Expected the ${field} field to have a value.`)
  return `${label.replace(/<[^>]*>/g, '')} ${value.replace(/<[^>]*>/g, '')}`
}

test('renders the Spanish default prompt without a selected-area record', () => {
  const html = renderToStaticMarkup(createElement(SelectedAreaPreview))

  assert.match(html, /Selecciona un área para consultar sus detalles\./)
  assert.doesNotMatch(html, /data-testid="selected-area-preview"/)
})

test('keeps safety, area information, bosses, and trust metadata in the approved order', () => {
  const html = renderToStaticMarkup(createElement(SelectedAreaPreview, { area: previewFor() }))

  assert.match(html, /Área A/)
  assert.match(html, /Nivel.*12/)
  assert.match(html, /Peligro del área.*Alto/)
  assert.match(html, /Advertencia Hardcore.*Daño físico explosivo/)
  assert.match(html, /Recompensas.*Recompensa A/)
  assert.match(html, /Jefe Alfa/)
  assert.match(html, /Fuente Área/)
  assert.match(html, /Fuente Alfa/)
  assert.ok(html.indexOf('Peligro del área') < html.indexOf('Recompensa A'))
  assert.ok(html.indexOf('Advertencia Hardcore') < html.indexOf('Punto A'))
  assert.ok(html.indexOf('Golpe de onda') < html.indexOf('Recompensa Alfa'))
  assert.ok(html.indexOf('Fuente Área') < html.indexOf('Fuente Alfa'))
})

test('keeps each boss block independent and localizes its own trust metadata', () => {
  const area = previewFor({
    bosses: [
      {
        id: 'boss-alfa', name: 'Jefe Alfa', damageTypes: ['Daño físico'], weaknesses: ['Frío'],
        dangerousMechanics: ['Golpe de onda'], rewards: ['Recompensa Alfa'],
        verification: { status: 'VERIFIED', sources: ['Fuente Alfa'], verifiedAt: '2025-01-01' },
      },
      {
        id: 'boss-beta', name: 'Jefe Beta', damageTypes: ['Daño de fuego'], weaknesses: { state: 'verified-absent' },
        dangerousMechanics: ['Lluvia de fuego'], rewards: ['Recompensa Beta'],
        verification: { status: 'UNKNOWN', sources: ['Fuente Beta'], verifiedAt: '2025-01-02' },
      },
    ],
  })
  const html = renderToStaticMarkup(createElement(SelectedAreaPreview, { area }))
  const bossBlocks = html.match(/<article class="boss-record"[\s\S]*?<\/article>/g) ?? []

  assert.equal(bossBlocks.length, 2)
  assert.match(bossBlocks[0], /Jefe Alfa[\s\S]*Daño físico[\s\S]*Recompensa Alfa/)
  assert.match(bossBlocks[1], /Jefe Beta[\s\S]*Daño de fuego[\s\S]*Ningunas[\s\S]*Recompensa Beta/)
  assert.doesNotMatch(bossBlocks[0], /Fuente Beta/)
  assert.doesNotMatch(bossBlocks[1], /Fuente Alfa/)
  assert.match(bossBlocks[1], /Sin verificar/)
})

test('renders unknown and verified-absent optional knowledge explicitly', () => {
  const area = previewFor({
    danger: 'UNKNOWN',
    hardcoreWarning: { state: 'unknown' },
    rewards: { state: 'verified-absent' },
    pointsOfInterest: { state: 'unknown' },
    bosses: { state: 'unknown' },
  })
  const html = renderToStaticMarkup(createElement(SelectedAreaPreview, { area }))

  assert.match(html, /Peligro del área[\s\S]*Desconocido/)
  assert.match(html, /Advertencia Hardcore[\s\S]*Desconocida/)
  assert.equal(fieldText(html, 'rewards'), 'Recompensas: Ninguna')
  assert.equal(fieldText(html, 'bosses'), 'Jefe: Desconocido')
  assert.doesNotMatch(html, /Peligro del área[\s\S]*Bajo/)
})

test('renders the exact locked labels for unknown and verified-absent rewards and bosses', () => {
  const unknownHtml = renderToStaticMarkup(createElement(SelectedAreaPreview, {
    area: previewFor({ rewards: { state: 'unknown' }, bosses: { state: 'unknown' } }),
  }))
  const absentHtml = renderToStaticMarkup(createElement(SelectedAreaPreview, {
    area: previewFor({ rewards: { state: 'verified-absent' }, bosses: { state: 'verified-absent' } }),
  }))

  assert.equal(fieldText(unknownHtml, 'rewards'), 'Recompensas: Desconocidas')
  assert.equal(fieldText(unknownHtml, 'bosses'), 'Jefe: Desconocido')
  assert.equal(fieldText(absentHtml, 'rewards'), 'Recompensas: Ninguna')
  assert.equal(fieldText(absentHtml, 'bosses'), 'Jefe: Ninguno')
})
