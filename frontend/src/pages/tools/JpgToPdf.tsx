import { SimpleToolPage } from '@/components/SimpleToolPage'

export function JpgToPdf() {
  return (
    <SimpleToolPage
      tool="jpg-to-pdf"
      title="JPG to PDF"
      description="Turn one or more images into a single PDF, in the order you add them."
      submitLabel="Convert to PDF"
      multiple
      accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
    />
  )
}
