import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function ExcelToPdf() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="excel-to-pdf"
      title={t('tools.excel-to-pdf.label')}
      description={t('tools.excel-to-pdf.description')}
      submitLabel={t('tools.excel-to-pdf.label')}
      accept={{
        'application/vnd.ms-excel': ['.xls'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      }}
    />
  )
}
