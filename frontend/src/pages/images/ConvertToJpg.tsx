import { SimpleToolPage } from '@/components/SimpleToolPage'

export function ConvertToJpg() {
  return (
    <SimpleToolPage
      tool="convert-to-jpg"
      title="Convert to JPG"
      description="Turn PNG or GIF into JPG"
      submitLabel="Convert to JPG"
      accept={{ 'image/png': ['.png'], 'image/gif': ['.gif'] }}
    />
  )
}
