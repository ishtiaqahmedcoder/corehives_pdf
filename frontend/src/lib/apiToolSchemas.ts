// Canonical description of every public API endpoint's request shape.
// Drives both the API reference tables and the live tester on the docs page.
// Keep in sync with backend/app/Http/Controllers/Api/ToolController.php,
// MergeController.php, and SignController.php.

export type ApiFieldType = 'string' | 'password' | 'int' | 'float' | 'select' | 'json'

export interface ApiFileField {
  name: string
  label: string
  accept: string
  multiple: boolean
  min?: number
  max?: number
  hint: string
}

export interface ApiOptionField {
  name: string
  label: string
  type: ApiFieldType
  required: boolean
  default?: string
  placeholder?: string
  description: string
  choices?: string[]
  topLevel?: boolean // sent as a bare field instead of options[name]
}

export interface ApiToolSchema {
  slug: string
  label: string
  summary: string
  path: string
  fileFields: ApiFileField[]
  optionFields: ApiOptionField[]
  notes?: string[]
}

const PDF_FILE = (max = 1): ApiFileField => ({
  name: 'files[]',
  label: 'files[]',
  accept: '.pdf',
  multiple: max > 1,
  min: 1,
  max,
  hint: max > 1 ? `1 to ${max} PDF files` : 'One PDF file',
})

const PAGES_FIELD = (required: boolean, description: string, defaultValue?: string): ApiOptionField => ({
  name: 'pages',
  label: 'pages',
  type: 'string',
  required,
  default: defaultValue,
  placeholder: '1,3,5-7',
  description,
})

export const API_TOOL_SCHEMAS: ApiToolSchema[] = [
  {
    slug: 'merge',
    label: 'Merge PDF',
    summary: 'Combine multiple PDFs into one, in the order the files are submitted.',
    path: '/v1/tools/merge',
    fileFields: [PDF_FILE(20)],
    optionFields: [],
    notes: ['Requires at least 2 files.'],
  },
  {
    slug: 'split',
    label: 'Split PDF',
    summary: 'Break a PDF into one file per page, returned as a zip.',
    path: '/v1/tools/split',
    fileFields: [PDF_FILE(1)],
    optionFields: [],
  },
  {
    slug: 'remove-pages',
    label: 'Remove Pages',
    summary: 'Delete the given pages and return the remaining PDF.',
    path: '/v1/tools/remove-pages',
    fileFields: [PDF_FILE(1)],
    optionFields: [PAGES_FIELD(true, 'Pages to remove. 1-based, comma-separated, ranges allowed.')],
    notes: ["The job fails if removing these pages would leave the document empty."],
  },
  {
    slug: 'extract-pages',
    label: 'Extract Pages',
    summary: 'Pull only the given pages into a new PDF.',
    path: '/v1/tools/extract-pages',
    fileFields: [PDF_FILE(1)],
    optionFields: [PAGES_FIELD(true, 'Pages to extract. 1-based, comma-separated, ranges allowed.')],
  },
  {
    slug: 'watermark',
    label: 'Add Watermark',
    summary: 'Stamp text across every page.',
    path: '/v1/tools/watermark',
    fileFields: [PDF_FILE(1)],
    optionFields: [
      {
        name: 'text',
        label: 'text',
        type: 'string',
        required: true,
        placeholder: 'CONFIDENTIAL',
        description: 'The watermark text stamped on every page.',
      },
    ],
  },
  {
    slug: 'page-numbers',
    label: 'Add Page Numbers',
    summary: 'Number every page automatically.',
    path: '/v1/tools/page-numbers',
    fileFields: [PDF_FILE(1)],
    optionFields: [],
    notes: ['No options today: numbering uses a fixed position and format.'],
  },
  {
    slug: 'jpg-to-pdf',
    label: 'JPG to PDF',
    summary: 'Combine JPG or PNG images into a single PDF, one image per page.',
    path: '/v1/tools/jpg-to-pdf',
    fileFields: [{ name: 'files[]', label: 'files[]', accept: '.jpg,.jpeg,.png', multiple: true, min: 1, max: 30, hint: '1 to 30 JPG or PNG images' }],
    optionFields: [],
  },
  {
    slug: 'compress',
    label: 'Compress PDF',
    summary: 'Shrink file size while keeping the document readable.',
    path: '/v1/tools/compress',
    fileFields: [PDF_FILE(1)],
    optionFields: [],
  },
  {
    slug: 'rotate',
    label: 'Rotate PDF',
    summary: 'Rotate the given pages by a fixed angle.',
    path: '/v1/tools/rotate',
    fileFields: [PDF_FILE(1)],
    optionFields: [
      PAGES_FIELD(false, 'Pages to rotate. Defaults to every page.', '1-z'),
      {
        name: 'degrees',
        label: 'degrees',
        type: 'int',
        required: false,
        default: '90',
        placeholder: '90',
        description: 'Rotation angle in degrees, typically 90, 180, or 270.',
      },
    ],
  },
  {
    slug: 'protect',
    label: 'Protect PDF',
    summary: 'Add a password required to open the document.',
    path: '/v1/tools/protect',
    fileFields: [PDF_FILE(1)],
    optionFields: [
      { name: 'password', label: 'password', type: 'password', required: true, description: 'The password to set on the output PDF.' },
    ],
  },
  {
    slug: 'unlock',
    label: 'Unlock PDF',
    summary: "Remove a PDF's open password.",
    path: '/v1/tools/unlock',
    fileFields: [PDF_FILE(1)],
    optionFields: [
      { name: 'password', label: 'password', type: 'password', required: false, default: '', description: "The document's current password." },
    ],
  },
  {
    slug: 'word-to-pdf',
    label: 'Word to PDF',
    summary: 'Convert a .doc or .docx file to PDF.',
    path: '/v1/tools/word-to-pdf',
    fileFields: [{ name: 'files[]', label: 'files[]', accept: '.doc,.docx', multiple: false, min: 1, max: 1, hint: 'One .doc or .docx file' }],
    optionFields: [],
  },
  {
    slug: 'ppt-to-pdf',
    label: 'PowerPoint to PDF',
    summary: 'Convert a .ppt or .pptx file to PDF.',
    path: '/v1/tools/ppt-to-pdf',
    fileFields: [{ name: 'files[]', label: 'files[]', accept: '.ppt,.pptx', multiple: false, min: 1, max: 1, hint: 'One .ppt or .pptx file' }],
    optionFields: [],
  },
  {
    slug: 'excel-to-pdf',
    label: 'Excel to PDF',
    summary: 'Convert an .xls or .xlsx file to PDF.',
    path: '/v1/tools/excel-to-pdf',
    fileFields: [{ name: 'files[]', label: 'files[]', accept: '.xls,.xlsx', multiple: false, min: 1, max: 1, hint: 'One .xls or .xlsx file' }],
    optionFields: [],
  },
  {
    slug: 'ocr',
    label: 'OCR PDF',
    summary: 'Make a scanned PDF searchable by recognizing its text.',
    path: '/v1/tools/ocr',
    fileFields: [PDF_FILE(1)],
    optionFields: [],
  },
  {
    slug: 'crop',
    label: 'Crop PDF',
    summary: 'Trim margins from every page.',
    path: '/v1/tools/crop',
    fileFields: [PDF_FILE(1)],
    optionFields: (['top', 'right', 'bottom', 'left'] as const).map((side) => ({
      name: side,
      label: side,
      type: 'float' as const,
      required: false,
      default: '0',
      placeholder: '0',
      description: `Margin to trim from the ${side} of the page, in millimeters (0 to 200).`,
    })),
  },
  {
    slug: 'organize',
    label: 'Organize PDF',
    summary: 'Reorder pages by supplying the new page order.',
    path: '/v1/tools/organize',
    fileFields: [PDF_FILE(1)],
    optionFields: [
      {
        name: 'order',
        label: 'order',
        type: 'json',
        required: true,
        placeholder: '[3,1,2]',
        description: 'A JSON array of 1-based page numbers giving the new page order. Pages omitted from the array are dropped.',
      },
    ],
  },
  {
    slug: 'edit',
    label: 'Edit PDF',
    summary: 'Overlay text onto one page of a PDF.',
    path: '/v1/tools/edit',
    fileFields: [PDF_FILE(1)],
    optionFields: [
      {
        name: 'page',
        label: 'page',
        type: 'int',
        required: false,
        default: '1',
        placeholder: '1',
        description: 'The 1-based page number to add text to.',
      },
      {
        name: 'edits',
        label: 'edits',
        type: 'json',
        required: true,
        placeholder: '[{"x":0.1,"y":0.1,"text":"Approved","fontSize":14,"color":"#111111"}]',
        description: 'A JSON array of text overlays: {x, y} as fractions (0 to 1) of the page width/height, plus text, and optional fontSize (6 to 72) and color (hex).',
      },
    ],
  },
  {
    slug: 'sign',
    label: 'Sign PDF',
    summary: 'Place a signature image onto one page of a PDF.',
    path: '/v1/tools/sign',
    fileFields: [
      { name: 'pdf', label: 'pdf', accept: '.pdf', multiple: false, min: 1, max: 1, hint: 'One PDF file' },
      { name: 'signature', label: 'signature', accept: '.png,.jpg,.jpeg', multiple: false, min: 1, max: 1, hint: 'One PNG or JPG image, up to 5MB' },
    ],
    optionFields: [
      {
        name: 'page',
        label: 'page',
        type: 'int',
        required: false,
        default: '0',
        placeholder: '0',
        description: '0-based page index to place the signature on. 0 means the last page.',
        topLevel: true,
      },
    ],
    notes: ['This endpoint takes separate `pdf` and `signature` fields instead of `files[]`, and `page` is a top-level field, not `options[page]`.'],
  },
  {
    slug: 'pdf-to-word',
    label: 'PDF to Word',
    summary: 'Extract text and rebuild it as an editable .docx.',
    path: '/v1/tools/pdf-to-word',
    fileFields: [PDF_FILE(1)],
    optionFields: [],
    notes: ['Preserves text content only, not the original layout, tables, or images.'],
  },
  {
    slug: 'pdf-to-ppt',
    label: 'PDF to PowerPoint',
    summary: 'Extract text and rebuild it as an editable .pptx, one slide per page.',
    path: '/v1/tools/pdf-to-ppt',
    fileFields: [PDF_FILE(1)],
    optionFields: [],
    notes: ['Preserves text content only, not the original layout, tables, or images.'],
  },
  {
    slug: 'pdf-to-excel',
    label: 'PDF to Excel',
    summary: 'Extract text and rebuild it as a .xlsx spreadsheet.',
    path: '/v1/tools/pdf-to-excel',
    fileFields: [PDF_FILE(1)],
    optionFields: [],
    notes: ['Preserves text content only, not the original layout, tables, or images.'],
  },
  {
    slug: 'batch',
    label: 'Batch Processing',
    summary: 'Run one tool across many files at once, returned as a zip.',
    path: '/v1/tools/batch',
    fileFields: [PDF_FILE(20)],
    optionFields: [
      {
        name: 'batch_tool',
        label: 'batch_tool',
        type: 'select',
        required: true,
        description: 'The tool to run on every file.',
        choices: ['compress', 'rotate', 'watermark', 'page-numbers', 'crop', 'protect', 'unlock'],
      },
      {
        name: 'tool_options',
        label: 'tool_options',
        type: 'json',
        required: false,
        default: '{}',
        placeholder: '{"text":"CONFIDENTIAL"}',
        description: "A JSON object of the chosen tool's own options, using the same option names documented for that tool above.",
      },
    ],
    notes: ['Requires at least 2 files.', 'Files that fail are skipped and reported; the job only fails if every file fails.'],
  },
  {
    slug: 'compress-image',
    label: 'Compress Image',
    summary: 'Shrink a JPG or PNG image while keeping it readable.',
    path: '/v1/tools/compress-image',
    fileFields: [{ name: 'files[]', label: 'files[]', accept: '.jpg,.jpeg,.png', multiple: false, min: 1, max: 1, hint: 'One JPG or PNG image' }],
    optionFields: [],
  },
  {
    slug: 'resize-image',
    label: 'Resize Image',
    summary: 'Change the width and/or height of a JPG or PNG image.',
    path: '/v1/tools/resize-image',
    fileFields: [{ name: 'files[]', label: 'files[]', accept: '.jpg,.jpeg,.png', multiple: false, min: 1, max: 1, hint: 'One JPG or PNG image' }],
    optionFields: [
      { name: 'width', label: 'width', type: 'int', required: false, placeholder: '800', description: 'Target width in pixels. Omit to scale proportionally from height.' },
      { name: 'height', label: 'height', type: 'int', required: false, placeholder: '600', description: 'Target height in pixels. Omit to scale proportionally from width.' },
    ],
    notes: ['At least one of width or height is required.'],
  },
  {
    slug: 'rotate-image',
    label: 'Rotate Image',
    summary: 'Rotate a JPG or PNG image by a fixed angle.',
    path: '/v1/tools/rotate-image',
    fileFields: [{ name: 'files[]', label: 'files[]', accept: '.jpg,.jpeg,.png', multiple: false, min: 1, max: 1, hint: 'One JPG or PNG image' }],
    optionFields: [
      { name: 'degrees', label: 'degrees', type: 'int', required: false, default: '90', placeholder: '90', description: 'Rotation angle in degrees, typically 90, 180, or 270.' },
    ],
  },
  {
    slug: 'convert-to-jpg',
    label: 'Convert to JPG',
    summary: 'Convert a PNG or GIF image to JPG.',
    path: '/v1/tools/convert-to-jpg',
    fileFields: [{ name: 'files[]', label: 'files[]', accept: '.png,.gif', multiple: false, min: 1, max: 1, hint: 'One PNG or GIF image' }],
    optionFields: [],
    notes: ['Transparent areas are flattened onto a white background, since JPG has no transparency.'],
  },
]

export const API_TOOL_SCHEMA_BY_SLUG: Record<string, ApiToolSchema> = Object.fromEntries(
  API_TOOL_SCHEMAS.map((s) => [s.slug, s]),
)
