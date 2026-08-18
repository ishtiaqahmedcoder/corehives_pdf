import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function PdfToExcel() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="pdf-to-excel"
      title={t('tools.pdf-to-excel.label')}
      description={t('tools.pdf-to-excel.description')}
      submitLabel={t('tools.pdf-to-excel.label')}
    />
  )
}
