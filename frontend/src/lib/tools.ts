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
  FileCode2,
} from 'lucide-react'
import type { ToolIconColor } from '@/components/ToolIcon'

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
  exclusive: 'PDFHives Exclusive',
}

export const TOOLS: Tool[] = [
  // Organize
  { slug: 'merge', label: 'Merge PDF', description: 'Combine multiple PDF files into a single document, in the exact order you choose, in seconds.', icon: FileStack, to: '/merge', category: 'organize', ready: true },
  { slug: 'split', label: 'Split PDF', description: 'Break a large PDF into separate single-page files, or a custom page range, downloaded as a ZIP.', icon: Scissors, to: '/split', category: 'organize', ready: true },
  { slug: 'remove-pages', label: 'Remove Pages', description: 'Delete the pages you don’t need and download a cleaner, shorter version of your PDF.', icon: Trash2, to: '/remove-pages', category: 'organize', ready: true },
  { slug: 'extract-pages', label: 'Extract Pages', description: 'Pull out only the pages you need from a PDF and save them as a brand new file.', icon: FileOutput, to: '/extract-pages', category: 'organize', ready: true },
  { slug: 'organize', label: 'Organize PDF', description: 'Drag to reorder, rotate, or delete pages with a live visual preview before you save.', icon: ListOrdered, to: '/organize', category: 'organize', ready: true },
  { slug: 'rotate', label: 'Rotate PDF', description: 'Fix sideways or upside-down pages by rotating your whole PDF 90, 180, or 270 degrees.', icon: RotateCw, to: '/rotate', category: 'organize', ready: true },

  // Optimize
  { slug: 'compress', label: 'Compress PDF', description: 'Shrink a large PDF down to a fraction of its size while keeping text and images sharp.', icon: Minimize2, to: '/compress', category: 'optimize', ready: true },
  { slug: 'ocr', label: 'OCR PDF', description: 'Run text recognition on scanned PDFs to make every page searchable, selectable, and copyable.', icon: ScanText, to: '/ocr', category: 'optimize', ready: true },

  // Convert
  { slug: 'jpg-to-pdf', label: 'JPG to PDF', description: 'Combine one or more JPG or PNG images into a single, print-ready PDF document.', icon: FileImage, to: '/jpg-to-pdf', category: 'convert', ready: true },
  { slug: 'pdf-to-word', label: 'PDF to Word', description: 'Convert a PDF into an editable Word (.docx) file you can revise without retyping it.', icon: FileText, to: '/pdf-to-word', category: 'convert', ready: true },
  { slug: 'pdf-to-ppt', label: 'PDF to PowerPoint', description: 'Turn PDF pages into an editable PowerPoint (.pptx) presentation, one slide per page.', icon: Presentation, to: '/pdf-to-ppt', category: 'convert', ready: true },
  { slug: 'pdf-to-excel', label: 'PDF to Excel', description: 'Pull tables and data out of a PDF straight into an editable Excel (.xlsx) spreadsheet.', icon: FileSpreadsheet, to: '/pdf-to-excel', category: 'convert', ready: true },
  { slug: 'word-to-pdf', label: 'Word to PDF', description: 'Convert a Word document (.doc or .docx) into a polished, universally readable PDF.', icon: FileType, to: '/word-to-pdf', category: 'convert', ready: true },
  { slug: 'ppt-to-pdf', label: 'PowerPoint to PDF', description: 'Convert a PowerPoint slideshow (.ppt or .pptx) into a PDF that looks the same everywhere.', icon: Presentation, to: '/ppt-to-pdf', category: 'convert', ready: true },
  { slug: 'excel-to-pdf', label: 'Excel to PDF', description: 'Convert an Excel spreadsheet (.xls or .xlsx) into a clean, print-ready PDF document.', icon: FileSpreadsheet, to: '/excel-to-pdf', category: 'convert', ready: true },
  { slug: 'pdf-to-markdown', label: 'PDF to Markdown', description: 'Extract the text from a PDF and convert it into a clean, portable Markdown (.md) file.', icon: FileCode2, to: '/pdf-to-markdown', category: 'convert', ready: true },

  // Edit
  { slug: 'watermark', label: 'Add Watermark', description: 'Stamp custom text across every page of a PDF to mark it draft, confidential, or your own.', icon: Droplets, to: '/watermark', category: 'edit', ready: true },
  { slug: 'page-numbers', label: 'Add Page Numbers', description: 'Automatically number every page of your PDF, ready to download in one click.', icon: Hash, to: '/page-numbers', category: 'edit', ready: true },
  { slug: 'edit', label: 'Edit PDF', description: 'Click anywhere on a page to add text, then download a PDF with your changes built in.', icon: PencilLine, to: '/edit', category: 'edit', ready: true },
  { slug: 'crop', label: 'Crop PDF', description: 'Trim the margins and white space around every page to tighten up your PDF’s layout.', icon: Crop, to: '/crop', category: 'edit', ready: true },
  { slug: 'sign', label: 'Sign PDF', description: 'Draw or upload your signature and place it anywhere on a PDF, no printing required.', icon: PenTool, to: '/sign', category: 'edit', ready: true },

  // Security
  { slug: 'protect', label: 'Protect PDF', description: 'Add a password to a PDF so only the people you trust can open and read it.', icon: Lock, to: '/protect', category: 'security', ready: true },
  { slug: 'unlock', label: 'Unlock PDF', description: 'Remove a password from a protected PDF once you have the right to access it.', icon: Unlock, to: '/unlock', category: 'security', ready: true },

  // PDFHives exclusive
  { slug: 'batch', label: 'Batch Processing', description: 'Run compress, rotate, watermark, and more across up to 20 files at once, free and unlimited.', icon: PackageOpen, to: '/batch', category: 'exclusive', ready: true },
  // Commented out for now, per user request (2026-08-20) — marketing/informational
  // cards rather than real tools. Re-enable by uncommenting if wanted back.
  // { slug: 'privacy', label: 'Auto-Delete Privacy', description: 'Every file you upload or download is permanently deleted from our servers one hour after processing.', icon: ShieldCheck, to: '/privacy', category: 'exclusive', ready: true },
  // { slug: 'urdu', label: 'Urdu / Hindi Support', description: 'The full interface is available in Urdu and Hindi, not just English, for easier everyday use.', icon: Globe, to: '/', category: 'exclusive', ready: true },
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

export const CATEGORY_ICON_COLOR: Record<ToolCategory, ToolIconColor> = {
  organize: 'violet',
  optimize: 'emerald',
  convert: 'sky',
  edit: 'amber',
  security: 'rose',
  exclusive: 'fuchsia',
}
