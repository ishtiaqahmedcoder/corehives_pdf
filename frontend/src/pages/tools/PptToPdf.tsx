import { SimpleToolPage } from '@/components/SimpleToolPage'

export function PptToPdf() {
  return (
    <SimpleToolPage
      tool="ppt-to-pdf"
      title="PowerPoint to PDF"
      description="Convert a .ppt or .pptx file to PDF."
      submitLabel="Convert to PDF"
      accept={{
        'application/vnd.ms-powerpoint': ['.ppt'],
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      }}
    />
  )
}
