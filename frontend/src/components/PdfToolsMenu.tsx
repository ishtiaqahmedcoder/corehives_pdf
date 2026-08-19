import { useTranslation } from 'react-i18next'
import { MegaMenu } from '@/components/MegaMenu'
import { CATEGORIES, CATEGORY_LABELS, CATEGORY_ICON_COLOR, toolsByCategory } from '@/lib/tools'

export function PdfToolsMenu() {
  const { t } = useTranslation()

  return (
    <MegaMenu
      label="PDF Tools"
      categories={CATEGORIES}
      categoryLabels={Object.fromEntries(CATEGORIES.map((c) => [c, t(`categories.${c}`, CATEGORY_LABELS[c])])) as Record<(typeof CATEGORIES)[number], string>}
      categoryIconColor={CATEGORY_ICON_COLOR}
      toolsByCategory={(category) =>
        toolsByCategory(category).map((tool) => ({
          slug: tool.slug,
          label: t(`tools.${tool.slug}.label`, tool.label),
          to: tool.to,
          icon: tool.icon,
          ready: tool.ready,
        }))
      }
    />
  )
}
