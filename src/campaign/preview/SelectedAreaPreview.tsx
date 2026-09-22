import React, { type ReactNode } from 'react'
import type { AreaKnowledge, BossKnowledge } from '../domain/model.ts'
import type { Knowledge, KnownOrUnknown } from '../domain/knowledge.ts'
import { localizeDanger, localizeKnowledgeState, localizeVerification } from '../localization/es.ts'

export interface SelectedAreaPreviewProps {
  /** The validated area selected by the campaign-map experience. */
  readonly area?: AreaKnowledge | null
}

/**
 * Renders only the preview side of the campaign-map experience.
 *
 * Selection belongs to the application boundary. Keeping the input as a
 * validated area record makes area and boss ownership explicit and lets the
 * map replace the complete preview by changing one prop.
 */
export function SelectedAreaPreview({ area }: SelectedAreaPreviewProps) {
  if (!area) return <PreviewPrompt />

  const areaLabel = localizeKnowledge(area.name, { gender: 'feminine', number: 'singular' }, (value) => value)
  const areaHeadingId = `selected-area-preview-${area.id}`

  return (
    <section
      className="campaign-preview"
      data-testid="selected-area-preview"
      aria-labelledby={areaHeadingId}
    >
      <header className="preview-heading">
        <p className="eyebrow">Área seleccionada</p>
        <h2 id={areaHeadingId}>{areaLabel}</h2>
      </header>

      <AreaRecord area={area} />

      {area.bosses.state === 'known' ? (
        <section className="preview-section boss-list" aria-labelledby={`${areaHeadingId}-bosses`}>
          <div className="section-heading">
            <p className="eyebrow">Encuentros</p>
            <h3 id={`${areaHeadingId}-bosses`}>Jefes conocidos</h3>
          </div>
          <div className="boss-stack">
            {area.bosses.value.map((boss, index) => (
              <BossRecord key={`${boss.id}-${index}`} boss={boss} />
            ))}
          </div>
        </section>
      ) : (
        <section className="preview-section" aria-labelledby={`${areaHeadingId}-bosses`}>
          <div className="section-heading">
            <p className="eyebrow">Encuentros</p>
            <h3 id={`${areaHeadingId}-bosses`}>Jefes</h3>
          </div>
          <dl className="preview-fields">
            <RecordField field="bosses" label="Jefe">
              {localizeKnowledgeState(area.bosses.state, 'masculine', 'singular')}
            </RecordField>
          </dl>
        </section>
      )}
    </section>
  )
}

function PreviewPrompt() {
  return (
    <section className="campaign-preview campaign-preview--prompt" aria-labelledby="campaign-preview-prompt">
      <div className="preview-prompt">
        <p className="eyebrow">Información de campaña</p>
        <h2 id="campaign-preview-prompt">Selecciona un área para consultar sus detalles.</h2>
        <p>Elige un área del mapa para ver su nivel, seguridad, recompensas y jefes conocidos.</p>
      </div>
    </section>
  )
}

function AreaRecord({ area }: { readonly area: AreaKnowledge }) {
  return (
    <section className="preview-section area-record" data-testid="area-record" aria-labelledby="area-record-heading">
      <div className="section-heading">
        <p className="eyebrow">Información del área</p>
        <h3 id="area-record-heading">Datos y seguridad</h3>
      </div>

      <dl className="preview-fields">
        <RecordField field="name" label="Área">
          {localizeKnowledge(area.name, { gender: 'feminine', number: 'singular' }, (value) => value)}
        </RecordField>
        <RecordField field="level" label="Nivel">
          {localizeKnowledge(area.level, { gender: 'masculine', number: 'singular' }, (value) => String(value))}
        </RecordField>
      </dl>

      <div className="preview-subsection preview-subsection--safety">
        <p className="subsection-label">Seguridad antes de entrar</p>
        <dl className="preview-fields">
          <RecordField field="danger" label="Peligro del área">
            <span className={`danger-value danger-value--${area.danger.toLowerCase()}`}>
              {localizeDanger(area.danger)}
            </span>
          </RecordField>
          <RecordField field="hc-warning" label="Advertencia Hardcore">
            {localizeKnowledge(area.hardcoreWarning, { gender: 'feminine', number: 'singular' }, (value) => value)}
          </RecordField>
        </dl>
      </div>

      <RecordTrust record={area.verification} />

      <div className="preview-subsection">
        <p className="subsection-label">Información adicional</p>
        <dl className="preview-fields">
          <ListKnowledgeField field="rewards" label="Recompensas" knowledge={area.rewards} emptyGrammar="feminine" />
          <ListKnowledgeField
            field="points-of-interest"
            label="Puntos de interés"
            knowledge={area.pointsOfInterest}
            emptyGrammar="masculine"
          />
          <ListKnowledgeField field="curiosities" label="Curiosidades" knowledge={area.curiosities} emptyGrammar="feminine" />
        </dl>
      </div>
    </section>
  )
}

function BossRecord({ boss }: { readonly boss: BossKnowledge }) {
  const bossName = localizeKnowledge(boss.name, { gender: 'masculine', number: 'singular' }, (value) => value)
  const bossHeadingId = `boss-${boss.id}`

  return (
    <article className="boss-record" aria-labelledby={bossHeadingId}>
      <header className="boss-heading">
        <p className="eyebrow">Jefe</p>
        <h4 id={bossHeadingId}>{bossName}</h4>
      </header>

      <dl className="preview-fields">
        <RecordField field="name" label="Jefe">
          {bossName}
        </RecordField>
        <RecordField field="description" label="Descripción">
          {localizeKnowledge(boss.description, { gender: 'feminine', number: 'singular' }, (value) => value)}
        </RecordField>
        <RecordField field="damage" label="Daño">
          {localizeListKnowledge(boss.damageTypes, { gender: 'masculine', number: 'singular' }, { gender: 'masculine', number: 'singular' })}
        </RecordField>
        <ListKnowledgeField field="weaknesses" label="Debilidades" knowledge={boss.weaknesses} emptyGrammar="feminine" absenceNumber="plural" />
        <ListKnowledgeField field="resistances" label="Resistencias" knowledge={boss.resistances} emptyGrammar="feminine" absenceNumber="plural" />
        <ListKnowledgeField
          field="mechanics"
          label="Mecánicas peligrosas"
          knowledge={boss.dangerousMechanics}
          emptyGrammar="feminine"
          absenceNumber="plural"
        />
      </dl>

      <div className="preview-subsection preview-subsection--reward">
        <p className="subsection-label">Recompensa del jefe</p>
        <dl className="preview-fields">
          <ListKnowledgeField field="rewards" label="Recompensas" knowledge={boss.rewards} emptyGrammar="feminine" />
        </dl>
      </div>

      <RecordTrust record={boss.verification} />
    </article>
  )
}

function RecordTrust({ record }: { readonly record: { readonly status: 'VERIFIED' | 'UNKNOWN'; readonly sources: readonly string[]; readonly verifiedAt: KnownOrUnknown<string> } }) {
  return (
    <div className="preview-subsection preview-subsection--trust">
      <p className="subsection-label">Verificación de este registro</p>
      <dl className="preview-fields">
        <RecordField field="verification" label="Estado">
          <span className={`verification-value verification-value--${record.status.toLowerCase()}`}>
            {localizeVerification(record.status)}
          </span>
        </RecordField>
        <RecordField field="sources" label="Fuentes">
          {record.sources.length > 0 ? record.sources.join(' · ') : 'Ninguna'}
        </RecordField>
        <RecordField field="verified-at" label="Fecha de verificación">
          {localizeKnowledge(record.verifiedAt, { gender: 'feminine', number: 'singular' }, (value) => value)}
        </RecordField>
      </dl>
    </div>
  )
}

function ListKnowledgeField({
  field,
  label,
  knowledge,
  emptyGrammar,
  absenceNumber,
}: {
  readonly field: string
  readonly label: string
  readonly knowledge: Knowledge<readonly string[]>
  readonly emptyGrammar: 'masculine' | 'feminine'
  readonly absenceNumber?: 'singular' | 'plural'
}) {
  return (
    <RecordField field={field} label={label}>
      {localizeListKnowledge(
        knowledge,
        { gender: emptyGrammar, number: 'plural' },
        { gender: emptyGrammar, number: absenceNumber ?? 'singular' },
      )}
    </RecordField>
  )
}

function localizeListKnowledge(
  knowledge: Knowledge<readonly string[]>,
  unknownGrammar: Readonly<{ gender: 'masculine' | 'feminine'; number: 'singular' | 'plural' }>,
  absenceGrammar: Readonly<{ gender: 'masculine' | 'feminine'; number: 'singular' | 'plural' }>,
) {
  if (knowledge.state === 'known') return knowledge.value.join(' · ')
  return localizeKnowledgeState(knowledge.state, knowledge.state === 'unknown' ? unknownGrammar.gender : absenceGrammar.gender, knowledge.state === 'unknown' ? unknownGrammar.number : absenceGrammar.number)
}

function localizeKnowledge<T>(
  knowledge: Knowledge<T> | KnownOrUnknown<T>,
  grammar: Readonly<{ gender: 'masculine' | 'feminine'; number: 'singular' | 'plural' }>,
  renderKnown: (value: T) => string,
) {
  if (knowledge.state === 'known') return renderKnown(knowledge.value)
  return localizeKnowledgeState(knowledge.state, grammar.gender, grammar.number)
}

function RecordField({ field, label, children }: { readonly field: string; readonly label: string; readonly children: ReactNode }) {
  return React.createElement(
    'div',
    { className: 'preview-field', 'data-testid': `record-field-${field}` },
    React.createElement('dt', null, label),
    React.createElement('dd', null, children),
  )
}

export default SelectedAreaPreview
