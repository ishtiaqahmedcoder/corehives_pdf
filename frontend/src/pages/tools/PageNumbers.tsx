import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function PageNumbers() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="page-numbers"
      title={t('tools.page-numbers.label')}
      description={t('tools.page-numbers.description')}
      submitLabel={t('tools.page-numbers.label')}
    />
  )
}
