import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function PdfToPpt() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="pdf-to-ppt"
      title={t('tools.pdf-to-ppt.label')}
      description={t('tools.pdf-to-ppt.description')}
      submitLabel={t('tools.pdf-to-ppt.label')}
    />
  )
}
