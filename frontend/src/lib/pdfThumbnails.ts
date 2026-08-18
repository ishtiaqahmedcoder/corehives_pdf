import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl

async function loadPdf(file: File): Promise<PDFDocumentProxy> {
  const buffer = await file.arrayBuffer()
  return getDocument({ data: buffer }).promise
}

async function renderPageToDataUrl(pdf: PDFDocumentProxy, pageNumber: number, maxWidth: number): Promise<string> {
  const page = await pdf.getPage(pageNumber)
  const baseViewport = page.getViewport({ scale: 1 })
  const scale = maxWidth / baseViewport.width
  const viewport = page.getViewport({ scale })

  const canvas = document.createElement('canvas')
  canvas.width = viewport.width
  canvas.height = viewport.height
  // Some browsers only complete canvas rendering reliably once the canvas
  // is attached to the document; keep it off-screen and remove it after.
  canvas.style.position = 'fixed'
  canvas.style.left = '-9999px'
  document.body.appendChild(canvas)

  try {
    await page.render({ canvas, viewport }).promise
    return canvas.toDataURL('image/jpeg', 0.85)
  } finally {
    canvas.remove()
  }
}

export async function renderPdfThumbnails(file: File, maxWidth = 220): Promise<string[]> {
  const pdf = await loadPdf(file)
  const thumbnails: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    thumbnails.push(await renderPageToDataUrl(pdf, i, maxWidth))
  }

  return thumbnails
}

export async function renderPdfPage(file: File, pageNumber: number, maxWidth = 700): Promise<{ dataUrl: string; pageCount: number }> {
  const pdf = await loadPdf(file)
  const dataUrl = await renderPageToDataUrl(pdf, pageNumber, maxWidth)
  return { dataUrl, pageCount: pdf.numPages }
}
