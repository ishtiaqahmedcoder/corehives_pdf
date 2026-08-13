import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function SplitPdf() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="split"
      title={t('tools.split.label')}
      description={t('tools.split.description')}
      submitLabel={t('tools.split.label')}
    />
  )
}
