import { useTranslation } from 'react-i18next'
import { SimpleToolPage } from '@/components/SimpleToolPage'
import { PageRangeField } from '@/components/PageRangeField'

export function RemovePages() {
  const { t } = useTranslation()
  return (
    <SimpleToolPage
      tool="remove-pages"
      title={t('tools.remove-pages.label')}
      description={t('tools.remove-pages.description')}
      submitLabel={t('tools.remove-pages.label')}
      optionsForm={(options, setOptions) => (
        <PageRangeField
          label={t('common.pagesToRemove')}
          value={options.pages ?? ''}
          onChange={(pages) => setOptions({ ...options, pages })}
        />
      )}
      validateOptions={(options) => (!options.pages?.trim() ? t('common.enterPagesToRemove') : null)}
    />
  )
}
