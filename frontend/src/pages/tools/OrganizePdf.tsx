import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FileDropzone } from '@/components/FileDropzone'
import { ProgressTracker } from '@/components/ProgressTracker'
import { AdSlot } from '@/components/AdSlot'
import { useJobStatus } from '@/hooks/useJobStatus'
import { uploadToolFiles } from '@/lib/api'
import { renderPdfThumbnails } from '@/lib/pdfThumbnails'

interface PageItem {
  id: string
  originalPage: number
  thumbnail: string
}

function SortablePage({ item, index, onRemove }: { item: PageItem; index: number; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      {...attributes}
      {...listeners}
      className="group relative cursor-grab touch-none rounded-xl border p-1.5 active:cursor-grabbing"
    >
      <img src={item.thumbnail} alt={`Page ${item.originalPage}`} className="w-full rounded-lg" draggable={false} />
      <span
        className="absolute left-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold text-white"
        style={{ background: 'var(--accent)' }}
      >
        {index + 1}
      </span>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation()
          onRemove()
        }}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: 'rgba(0,0,0,0.6)' }}
        aria-label="Remove page"
      >
        ✕
      </button>
    </div>
  )
}

export function OrganizePdf() {
  const { t } = useTranslation()
  const [file, setFile] = useState<File | null>(null)
  const [pages, setPages] = useState<PageItem[]>([])
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const job = useJobStatus(jobId)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  async function handleFilesChange(files: File[]) {
    setError(null)
    if (files.length === 0) {
      setFile(null)
      setPages([])
      return
    }
    const selected = files[0]
    setFile(selected)
    setLoadingPreview(true)
    try {
      const thumbnails = await renderPdfThumbnails(selected)
      setPages(thumbnails.map((thumbnail, i) => ({ id: `p${i + 1}`, originalPage: i + 1, thumbnail })))
    } catch (e) {
      console.error('renderPdfThumbnails failed:', e)
      setError(t('common.uploadFailed'))
    } finally {
      setLoadingPreview(false)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setPages((items) => {
      const oldIndex = items.findIndex((p) => p.id === active.id)
      const newIndex = items.findIndex((p) => p.id === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })
  }

  function removePage(id: string) {
    setPages((items) => items.filter((p) => p.id !== id))
  }

  async function handleSubmit() {
    if (!file || pages.length === 0) {
      setError(t('common.addAtLeast', { count: 1 }))
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const order = pages.map((p) => p.originalPage)
      const id = await uploadToolFiles('organize', [file], { order: JSON.stringify(order) })
      setJobId(id)
    } catch {
      setError(t('common.uploadFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setFile(null)
    setPages([])
    setJobId(null)
    setError(null)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          {t('tools.organize.label')}
        </h1>
        <p className="mt-2 opacity-70">{t('tools.organize.description')}</p>
      </motion.div>

      {!jobId && (
        <>
          {!file && <FileDropzone files={[]} onFilesChange={handleFilesChange} multiple={false} />}

          {loadingPreview && (
            <p className="py-10 text-center text-sm opacity-60">{t('common.loadingPreview')}</p>
          )}

          {file && pages.length > 0 && !loadingPreview && (
            <>
              <p className="mb-3 text-center text-sm opacity-60">{t('common.organizeHint')}</p>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={pages.map((p) => p.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {pages.map((item, i) => (
                      <SortablePage key={item.id} item={item} index={i} onRemove={() => removePage(item.id)} />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </>
          )}

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          {file && (
            <button
              type="button"
              disabled={pages.length === 0 || submitting}
              onClick={handleSubmit}
              className="mt-5 w-full rounded-xl py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
              style={{ background: 'var(--accent)' }}
            >
              {submitting ? t('common.uploading') : t('common.applyOrganize')}
            </button>
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
              {t('common.startAnother')}
            </button>
          )}
        </div>
      )}

      <AdSlot className="mt-10" />
    </div>
  )
}
