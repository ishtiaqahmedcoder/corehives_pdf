import { SimpleToolPage } from '@/components/SimpleToolPage'

export function CompressPdf() {
  return (
    <SimpleToolPage
      tool="compress"
      title="Compress PDF"
      description="Shrink file size while keeping quality — great for scanned documents."
      submitLabel="Compress PDF"
    />
  )
}
