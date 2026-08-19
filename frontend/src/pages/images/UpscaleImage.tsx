import { SimpleToolPage } from '@/components/SimpleToolPage'

export function UpscaleImage() {
  return (
    <SimpleToolPage
      tool="upscale-image"
      title="Upscale Image"
      description="Enlarge a photo 4x without losing quality"
      submitLabel="Upscale Image"
      accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
    />
  )
}
