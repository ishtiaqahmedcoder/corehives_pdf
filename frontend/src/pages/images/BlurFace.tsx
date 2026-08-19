import { SimpleToolPage } from '@/components/SimpleToolPage'

export function BlurFace() {
  return (
    <SimpleToolPage
      tool="blur-face"
      title="Blur Face"
      description="Hide faces for privacy"
      submitLabel="Blur Faces"
      accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
    />
  )
}
