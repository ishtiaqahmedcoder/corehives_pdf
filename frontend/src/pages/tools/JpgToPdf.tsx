import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function JpgToPdf() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="jpg-to-pdf"
      title={t('tools.jpg-to-pdf.label')}
      description={t('tools.jpg-to-pdf.description')}
      submitLabel={t('tools.jpg-to-pdf.label')}
      multiple
      accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
    />
  )
}
