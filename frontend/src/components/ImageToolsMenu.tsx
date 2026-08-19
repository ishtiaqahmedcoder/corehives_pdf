import { MegaMenu } from '@/components/MegaMenu'
import { IMAGE_CATEGORIES, IMAGE_CATEGORY_LABELS, IMAGE_CATEGORY_ICON_COLOR, imageToolsByCategory } from '@/lib/imageTools'

export function ImageToolsMenu() {
  return (
    <MegaMenu
      label="Image Tools"
      categories={IMAGE_CATEGORIES}
      categoryLabels={IMAGE_CATEGORY_LABELS}
      categoryIconColor={IMAGE_CATEGORY_ICON_COLOR}
      toolsByCategory={(category) => imageToolsByCategory(category)}
    />
  )
}
