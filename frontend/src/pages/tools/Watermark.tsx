import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function Watermark() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="watermark"
      title={t('tools.watermark.label')}
      description={t('tools.watermark.description')}
      submitLabel={t('tools.watermark.label')}
      optionsForm={(options, setOptions) => (
        <label className="block text-left text-sm">
          <span className="font-medium" style={{ color: 'var(--text-h)' }}>
            {t('common.watermarkTextLabel')}
          </span>
          <input
            type="text"
            value={options.text ?? ''}
            onChange={(e) => setOptions({ ...options, text: e.target.value })}
            placeholder={t('common.watermarkPlaceholder')}
            className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
          />
        </label>
      )}
      validateOptions={(options) => (!options.text?.trim() ? t('common.enterWatermarkText') : null)}
    />
  )
}
