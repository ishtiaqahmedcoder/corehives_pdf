import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'
import { PageRangeField } from '@/components/PageRangeField'

export function ExtractPages() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="extract-pages"
      title={t('tools.extract-pages.label')}
      description={t('tools.extract-pages.description')}
      submitLabel={t('tools.extract-pages.label')}
      optionsForm={(options, setOptions) => (
        <PageRangeField
          label={t('common.pagesToExtract')}
          value={options.pages ?? ''}
          onChange={(pages) => setOptions({ ...options, pages })}
        />
      )}
      validateOptions={(options) => (!options.pages?.trim() ? t('common.enterPagesToExtract') : null)}
    />
  )
}
