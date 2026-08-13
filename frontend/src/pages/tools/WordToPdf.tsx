import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'

export function WordToPdf() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="word-to-pdf"
      title={t('tools.word-to-pdf.label')}
      description={t('tools.word-to-pdf.description')}
      submitLabel={t('tools.word-to-pdf.label')}
      accept={{
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      }}
    />
  )
}
