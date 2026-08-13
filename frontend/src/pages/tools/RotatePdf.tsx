import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'
import { PageRangeField } from '@/components/PageRangeField'

export function RotatePdf() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="rotate"
      title={t('tools.rotate.label')}
      description={t('tools.rotate.description')}
      submitLabel={t('tools.rotate.label')}
      optionsForm={(options, setOptions) => (
        <div className="space-y-4">
          <label className="block text-left text-sm">
            <span className="font-medium" style={{ color: 'var(--text-h)' }}>
              {t('common.rotationLabel')}
            </span>
            <select
              value={options.degrees ?? '90'}
              onChange={(e) => setOptions({ ...options, degrees: e.target.value })}
              className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
            >
              <option value="90">{t('common.rotate90')}</option>
              <option value="180">{t('common.rotate180')}</option>
              <option value="270">{t('common.rotate270')}</option>
            </select>
          </label>

          <PageRangeField
            label={t('common.pagesOptional')}
            value={options.pages ?? ''}
            onChange={(pages) => setOptions({ ...options, pages })}
          />
        </div>
      )}
    />
  )
}
