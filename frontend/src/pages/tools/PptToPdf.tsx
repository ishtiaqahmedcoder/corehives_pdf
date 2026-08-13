import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function PptToPdf() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="ppt-to-pdf"
      title={t('tools.ppt-to-pdf.label')}
      description={t('tools.ppt-to-pdf.description')}
      submitLabel={t('tools.ppt-to-pdf.label')}
      accept={{
        'application/vnd.ms-powerpoint': ['.ppt'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      }}
    />
  )
}
