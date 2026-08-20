import { useTranslation } from 'react-i18next'
import { MegaMenu } from '@/components/MegaMenu'
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICON_COLOR, toolsByCategory, type ToolCategory } from '@/lib/tools'

// "exclusive" tools fold into the "security" column below so the dropdown doesn't grow an extra, sparsely-filled column.
const NAV_CATEGORIES = CATEGORIES.filter((c) => c !== 'exclusive')

export function PdfToolsMenu() {
  const { t } = useTranslation()

  return (
    <MegaMenu
      label="PDF Tools"
      categories={NAV_CATEGORIES}
      categoryLabels={Object.fromEntries(NAV_CATEGORIES.map((c) => [c, t(`categories.${c}`, CATEGORY_LABELS[c])])) as Record<(typeof NAV_CATEGORIES)[number], string>}
      categoryIconColor={CATEGORY_ICON_COLOR}
      toolsByCategory={(category) => {
        const merged: ToolCategory[] = category === 'security' ? ['security', 'exclusive'] : [category]
        return merged.flatMap((c) => toolsByCategory(c)).map((tool) => ({
          slug: tool.slug,
          label: t(`tools.${tool.slug}.label`, tool.label),
          to: tool.to,
          icon: tool.icon,
          ready: tool.ready,
        }))
      }}
    />
  )
}
