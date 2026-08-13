import { SimpleToolPage } from '@/components/SimpleToolPage'

export function SplitPdf() {
  return (
    <SimpleToolPage
      tool="split"
      title="Split PDF"
      description="Every page becomes its own PDF, delivered as a zip — free, no limits."
      submitLabel="Split PDF"
    />
  )
}
