import { SimpleToolPage } from '@/components/SimpleToolPage'

export function CompressImage() {
  return (
    <SimpleToolPage
      tool="compress-image"
      title="Compress Image"
      description="Shrink file size, keep the quality"
      submitLabel="Compress Image"
      accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
    />
  )
}
