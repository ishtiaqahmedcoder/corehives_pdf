import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

GlobalWorkerOptions.workerSrc = workerUrl

export async function renderPdfThumbnails(file: File, maxWidth = 220): Promise<string[]> {
  const buffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: buffer }).promise
  const thumbnails: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
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
      thumbnails.push(canvas.toDataURL('image/jpeg', 0.8))
    } finally {
      canvas.remove()
    }
  }

  return thumbnails
}
