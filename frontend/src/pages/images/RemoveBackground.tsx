import { SimpleToolPage } from '@/components/SimpleToolPage'

export function RemoveBackground() {
  return (
    <SimpleToolPage
      tool="remove-background"
      title="Remove Background"
      description="Cut a subject out automatically"
      submitLabel="Remove Background"
      accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
    />
  )
}
