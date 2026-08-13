import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function CompressPdf() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="compress"
      title={t('tools.compress.label')}
      description={t('tools.compress.description')}
      submitLabel={t('tools.compress.label')}
    />
  )
}
