import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

const SIDES = ['top', 'right', 'bottom', 'left'] as const

export function CropPdf() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="crop"
      title={t('tools.crop.label')}
      description={t('tools.crop.description')}
      submitLabel={t('tools.crop.label')}
      optionsForm={(options, setOptions) => (
        <div>
          <span className="mb-2 block text-left text-sm font-medium" style={{ color: 'var(--text-h)' }}>
            {t('common.cropMarginsLabel')}
          </span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SIDES.map((side) => (
              <label key={side} className="block text-left text-xs">
                <span className="opacity-70">{t(`common.crop.${side}`)}</span>
                <input
                  type="number"
                  min={0}
                  max={150}
                  value={options[side] ?? ''}
                  onChange={(e) => setOptions({ ...options, [side]: e.target.value })}
                  placeholder="0"
                  className="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
                />
              </label>
            ))}
          </div>
          <span className="mt-2 block text-xs opacity-60">{t('common.cropHelper')}</span>
        </div>
      )}
    />
  )
}
