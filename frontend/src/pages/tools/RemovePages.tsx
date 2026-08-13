import { SimpleToolPage } from '@/components/SimpleToolPage'
import { PageRangeField } from '@/components/PageRangeField'

export function RemovePages() {
  return (
    <SimpleToolPage
      tool="remove-pages"
      title="Remove Pages"
      description="Delete the pages you don't need from a PDF."
      submitLabel="Remove Pages"
      optionsForm={(options, setOptions) => (
        <PageRangeField
          label="Pages to remove"
          value={options.pages ?? ''}
          onChange={(pages) => setOptions({ ...options, pages })}
        />
      )}
      validateOptions={(options) => (!options.pages?.trim() ? 'Enter which pages to remove.' : null)}
    />
  )
}
