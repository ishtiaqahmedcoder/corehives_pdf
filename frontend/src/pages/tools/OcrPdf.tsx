import { SimpleToolPage } from '@/components/SimpleToolPage'

export function OcrPdf() {
  return (
    <SimpleToolPage
      tool="ocr"
      title="OCR PDF"
      description="Make a scanned PDF searchable and selectable — English text."
      submitLabel="Run OCR"
    />
  )
}
