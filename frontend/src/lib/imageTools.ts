import type { LucideIcon } from 'lucide-react'
import {
  Minimize2,
  Maximize2,
  RotateCw,
  Crop,
  FileImage,
  Droplets,
  PencilLine,
  Smile,
  Expand,
  Eraser,
  ScanFace,
  Globe,
} from 'lucide-react'

export interface ImageTool {
  slug: string
  label: string
  description: string
  icon: LucideIcon
  to: string
  category: ImageToolCategory
  ready: boolean
}

export const IMAGE_CATEGORIES = ['optimize', 'convert', 'edit', 'create', 'security'] as const

export type ImageToolCategory = (typeof IMAGE_CATEGORIES)[number]

export const IMAGE_CATEGORY_LABELS: Record<ImageToolCategory, string> = {
  optimize: 'Optimize Image',
  convert: 'Convert Image',
  edit: 'Edit Image',
  create: 'Create',
  security: 'Image Security',
}

export const IMAGE_CATEGORY_STYLES: Record<ImageToolCategory, string> = {
  optimize: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  convert: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  edit: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  create: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
  security: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
}

export const IMAGE_TOOLS: ImageTool[] = [
  { slug: 'compress-image', label: 'Compress Image', description: 'Shrink file size, keep the quality', icon: Minimize2, to: '/images/compress', category: 'optimize', ready: true },
  { slug: 'resize-image', label: 'Resize Image', description: 'Change the width and height', icon: Maximize2, to: '/images/resize', category: 'optimize', ready: true },
  { slug: 'rotate-image', label: 'Rotate Image', description: 'Fix a sideways or upside-down photo', icon: RotateCw, to: '/images/rotate', category: 'edit', ready: true },
  { slug: 'convert-to-jpg', label: 'Convert to JPG', description: 'Turn PNG, GIF, or WEBP into JPG', icon: FileImage, to: '/images/convert-to-jpg', category: 'convert', ready: true },
  { slug: 'crop-image', label: 'Crop Image', description: 'Trim the edges of a photo', icon: Crop, to: '/images/crop', category: 'edit', ready: true },
  { slug: 'convert-from-jpg', label: 'Convert from JPG', description: 'Turn a JPG into PNG, GIF, or WEBP', icon: FileImage, to: '/images/convert-from-jpg', category: 'convert', ready: true },
  { slug: 'watermark-image', label: 'Watermark Image', description: 'Stamp text over a photo', icon: Droplets, to: '/images/watermark', category: 'edit', ready: true },
  { slug: 'photo-editor', label: 'Photo Editor', description: 'Add text, frames, and stickers', icon: PencilLine, to: '/images/editor', category: 'create', ready: true },
  { slug: 'meme-generator', label: 'Meme Generator', description: 'Caption an image in seconds', icon: Smile, to: '/images/meme', category: 'create', ready: true },
  { slug: 'upscale-image', label: 'Upscale Image', description: 'Enlarge a photo 4x without losing quality', icon: Expand, to: '/images/upscale', category: 'optimize', ready: true },
  { slug: 'remove-background', label: 'Remove Background', description: 'Cut a subject out automatically', icon: Eraser, to: '/images/remove-background', category: 'edit', ready: true },
  { slug: 'blur-face', label: 'Blur Face', description: 'Hide faces for privacy', icon: ScanFace, to: '/images/blur-face', category: 'security', ready: true },
  { slug: 'html-to-image', label: 'HTML to Image', description: 'Turn a web page into a JPG or PNG', icon: Globe, to: '/images/html-to-image', category: 'convert', ready: true },
]

export function imageToolsByCategory(category: ImageToolCategory | 'all'): ImageTool[] {
  if (category === 'all') return IMAGE_TOOLS
  return IMAGE_TOOLS.filter((t) => t.category === category)
}
