import type { LucideIcon } from 'lucide-react'
import {
  FileStack,
  Scissors,
  Trash2,
  FileOutput,
  ListOrdered,
  RotateCw,
  Minimize2,
  ScanText,
  FileImage,
  FileText,
  Presentation,
  FileSpreadsheet,
  FileType,
  Droplets,
  Hash,
  PencilLine,
  Crop,
  Lock,
  Unlock,
  PenTool,
  PackageOpen,
  ShieldCheck,
  Globe,
} from 'lucide-react'

export interface Tool {
  slug: string
  label: string
  description: string
  icon: LucideIcon
  to: string
  category: ToolCategory
  ready: boolean
}

export const CATEGORIES = [
  'organize',
  'optimize',
  'convert',
  'edit',
  'security',
  'exclusive',
] as const

export type ToolCategory = (typeof CATEGORIES)[number]

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  organize: 'Organize PDF',
  optimize: 'Optimize PDF',
  convert: 'Convert PDF',
  edit: 'Edit & Sign',
  security: 'PDF Security',
  exclusive: 'CoreHives Exclusive',
}

export const TOOLS: Tool[] = [
  // Organize
  { slug: 'merge', label: 'Merge PDF', description: 'Combine PDFs in the order you choose', icon: FileStack, to: '/merge', category: 'organize', ready: true },
  { slug: 'split', label: 'Split PDF', description: 'Break a PDF into separate files', icon: Scissors, to: '/split', category: 'organize', ready: true },
  { slug: 'remove-pages', label: 'Remove Pages', description: 'Delete pages you don’t need', icon: Trash2, to: '/remove-pages', category: 'organize', ready: true },
  { slug: 'extract-pages', label: 'Extract Pages', description: 'Pull specific pages into a new PDF', icon: FileOutput, to: '/extract-pages', category: 'organize', ready: true },
  { slug: 'organize', label: 'Organize PDF', description: 'Drag to reorder, rotate or delete pages', icon: ListOrdered, to: '/organize', category: 'organize', ready: true },
  { slug: 'rotate', label: 'Rotate PDF', description: 'Fix sideways or upside-down pages', icon: RotateCw, to: '/rotate', category: 'organize', ready: true },

  // Optimize
  { slug: 'compress', label: 'Compress PDF', description: 'Shrink file size, keep the quality', icon: Minimize2, to: '/compress', category: 'optimize', ready: true },
  { slug: 'ocr', label: 'OCR PDF', description: 'Make scanned PDFs searchable', icon: ScanText, to: '/ocr', category: 'optimize', ready: true },

  // Convert
  { slug: 'jpg-to-pdf', label: 'JPG to PDF', description: 'Turn images into a PDF', icon: FileImage, to: '/jpg-to-pdf', category: 'convert', ready: true },
  { slug: 'pdf-to-word', label: 'PDF to Word', description: 'Convert to an editable .docx', icon: FileText, to: '/pdf-to-word', category: 'convert', ready: true },
  { slug: 'pdf-to-ppt', label: 'PDF to PowerPoint', description: 'Convert to an editable .pptx', icon: Presentation, to: '/pdf-to-ppt', category: 'convert', ready: true },
  { slug: 'pdf-to-excel', label: 'PDF to Excel', description: 'Pull tables into a spreadsheet', icon: FileSpreadsheet, to: '/pdf-to-excel', category: 'convert', ready: true },
  { slug: 'word-to-pdf', label: 'Word to PDF', description: 'Convert .docx to PDF', icon: FileType, to: '/word-to-pdf', category: 'convert', ready: true },
  { slug: 'ppt-to-pdf', label: 'PowerPoint to PDF', description: 'Convert .pptx to PDF', icon: Presentation, to: '/ppt-to-pdf', category: 'convert', ready: true },
  { slug: 'excel-to-pdf', label: 'Excel to PDF', description: 'Convert .xlsx to PDF', icon: FileSpreadsheet, to: '/excel-to-pdf', category: 'convert', ready: true },

  // Edit
  { slug: 'watermark', label: 'Add Watermark', description: 'Stamp text or a logo on every page', icon: Droplets, to: '/watermark', category: 'edit', ready: true },
  { slug: 'page-numbers', label: 'Add Page Numbers', description: 'Number pages automatically', icon: Hash, to: '/page-numbers', category: 'edit', ready: true },
  { slug: 'edit', label: 'Edit PDF', description: 'Add text, shapes and annotations', icon: PencilLine, to: '/edit', category: 'edit', ready: true },
  { slug: 'crop', label: 'Crop PDF', description: 'Trim margins and page edges', icon: Crop, to: '/crop', category: 'edit', ready: true },
  { slug: 'sign', label: 'Sign PDF', description: 'Draw or upload your signature', icon: PenTool, to: '/sign', category: 'edit', ready: true },

  // Security
  { slug: 'protect', label: 'Protect PDF', description: 'Add a password to a PDF', icon: Lock, to: '/protect', category: 'security', ready: true },
  { slug: 'unlock', label: 'Unlock PDF', description: 'Remove a password from a PDF', icon: Unlock, to: '/unlock', category: 'security', ready: true },

  // CoreHives exclusive
  { slug: 'batch', label: 'Batch Processing', description: 'Run any tool on many files at once. Free, with no limit', icon: PackageOpen, to: '/batch', category: 'exclusive', ready: true },
  { slug: 'privacy', label: 'Auto-Delete Privacy', description: 'Every file is wiped 1 hour after processing', icon: ShieldCheck, to: '/privacy', category: 'exclusive', ready: true },
  { slug: 'urdu', label: 'Urdu / Hindi Support', description: 'Full interface in your language, not just English', icon: Globe, to: '/', category: 'exclusive', ready: true },
]

export function toolsByCategory(category: ToolCategory | 'all'): Tool[] {
  if (category === 'all') return TOOLS
  return TOOLS.filter((t) => t.category === category)
}

export const CATEGORY_STYLES: Record<ToolCategory, string> = {
  organize: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  optimize: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  convert: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  edit: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  security: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  exclusive: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
}

export const CATEGORY_DOT: Record<ToolCategory, string> = {
  organize: 'bg-violet-500',
  optimize: 'bg-emerald-500',
  convert: 'bg-sky-500',
  edit: 'bg-amber-500',
  security: 'bg-rose-500',
  exclusive: 'bg-fuchsia-500',
}
