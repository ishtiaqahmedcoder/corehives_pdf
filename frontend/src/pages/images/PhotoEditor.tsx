import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileDropzone } from '@/components/FileDropzone'
import { ProgressTracker } from '@/components/ProgressTracker'
import { AdSlot } from '@/components/AdSlot'
import { useJobStatus } from '@/hooks/useJobStatus'
import { uploadToolFiles } from '@/lib/api'

interface TextEdit {
  id: string
  x: number
  y: number
  text: string
  fontSize: number
  color: string
}

const COLORS = ['#111111', '#ffffff', '#dc2626', '#2563eb', '#16a34a']
const FONT_SIZES = [16, 24, 32, 48]

export function PhotoEditor() {
  const [file, setFile] = useState<File | null>(null)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [elements, setElements] = useState<TextEdit[]>([])
  const [activeColor, setActiveColor] = useState(COLORS[0])
  const [activeFontSize, setActiveFontSize] = useState(FONT_SIZES[1])
  const [jobId, setJobId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const job = useJobStatus(jobId)

  function handleFilesChange(files: File[]) {
    setError(null)
    setElements([])
    if (files.length === 0) {
      setFile(null)
      setImageUrl(null)
      return
    }
    const selected = files[0]
    setFile(selected)
    setImageUrl(URL.createObjectURL(selected))
  }

  function handleImageClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const text = window.prompt('Text')
    if (!text || !text.trim()) return
    setElements((prev) => [
      ...prev,
      { id: `${Date.now()}-${prev.length}`, x, y, text: text.trim(), fontSize: activeFontSize, color: activeColor },
    ])
  }

  function removeElement(id: string) {
    setElements((prev) => prev.filter((el) => el.id !== id))
  }

  async function handleSubmit() {
    if (!file || elements.length === 0) {
      setError('Add at least one text element.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const id = await uploadToolFiles('photo-editor', [file], {
        edits: JSON.stringify(elements.map(({ x, y, text, fontSize, color }) => ({ x, y, text, fontSize, color }))),
      })
      setJobId(id)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setFile(null)
    setImageUrl(null)
    setElements([])
    setJobId(null)
    setError(null)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          Photo Editor
        </h1>
        <p className="mt-2 opacity-70">Add text, frames, and stickers</p>
      </motion.div>

      {!jobId && (
        <>
          {!file && (
            <FileDropzone
              files={[]}
              onFilesChange={handleFilesChange}
              accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
              multiple={false}
            />
          )}

          {file && imageUrl && (
            <>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setActiveColor(c)}
                      className="h-5 w-5 rounded-full border-2"
                      style={{ background: c, borderColor: activeColor === c ? 'var(--accent)' : 'var(--border)' }}
                      aria-label={c}
                    />
                  ))}
                </div>
                <select
                  value={activeFontSize}
                  onChange={(e) => setActiveFontSize(Number(e.target.value))}
                  className="rounded-lg border px-2 py-1 text-xs outline-none"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
                >
                  {FONT_SIZES.map((s) => (
                    <option key={s} value={s}>
                      {s}px
                    </option>
                  ))}
                </select>
              </div>

              <p className="mb-2 text-center text-xs opacity-60">Click anywhere on the photo to add text</p>

              <div
                onClick={handleImageClick}
                className="relative cursor-crosshair overflow-hidden rounded-xl border"
                style={{ borderColor: 'var(--border)' }}
              >
                <img src={imageUrl} alt="Your photo" className="block w-full select-none" draggable={false} />
                {elements.map((el) => (
                  <span
                    key={el.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      removeElement(el.id)
                    }}
                    title="Click to remove"
                    className="absolute -translate-y-full cursor-pointer whitespace-nowrap rounded px-0.5 hover:bg-red-500/10"
                    style={{
                      left: `${el.x * 100}%`,
                      top: `${el.y * 100}%`,
                      color: el.color,
                      fontSize: `${el.fontSize}px`,
                      lineHeight: 1,
                    }}
                  >
                    {el.text}
                  </span>
                ))}
              </div>

              {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

              <button
                type="button"
                disabled={elements.length === 0 || submitting}
                onClick={handleSubmit}
                className="mt-5 w-full rounded-xl py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: 'var(--accent)' }}
              >
                {submitting ? 'Uploading…' : 'Save Photo'}
              </button>
            </>
          )}
        </>
      )}

      {job && (
        <div className="mt-2">
          <ProgressTracker job={job} />
          {(job.status === 'completed' || job.status === 'failed') && (
            <button
              type="button"
              onClick={reset}
              className="mt-4 w-full rounded-xl border py-2.5 text-sm"
              style={{ borderColor: 'var(--border)' }}
            >
              Start another
            </button>
          )}
        </div>
      )}

      <AdSlot className="mt-10" />
    </div>
  )
}
