import { SimpleToolPage } from '@/components/SimpleToolPage'

export function WordToPdf() {
  return (
    <SimpleToolPage
      tool="word-to-pdf"
      title="Word to PDF"
      description="Convert a .doc or .docx file to PDF."
      submitLabel="Convert to PDF"
      accept={{
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      }}
    />
  )
}
