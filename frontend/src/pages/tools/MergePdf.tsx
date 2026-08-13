import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FileDropzone } from '@/components/FileDropzone'
import { ProgressTracker } from '@/components/ProgressTracker'
import { AdSlot } from '@/components/AdSlot'
import { useJobStatus } from '@/hooks/useJobStatus'
import { uploadMergeFiles } from '@/lib/api'

export function MergePdf() {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const [jobId, setJobId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const job = useJobStatus(jobId)

  async function handleMerge() {
    if (files.length < 2) {
      setError(t('common.addAtLeast', { count: 2 }))
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const id = await uploadMergeFiles(files)
      setJobId(id)
    } catch {
      setError(t('common.uploadFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setFiles([])
    setJobId(null)
    setError(null)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          {t('tools.merge.label')}
        </h1>
        <p className="mt-2 opacity-70">{t('tools.merge.description')}</p>
      </motion.div>

      {!jobId && (
        <>
          <FileDropzone files={files} onFilesChange={setFiles} multiple />
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <button
            type="button"
            disabled={files.length < 2 || submitting}
            onClick={handleMerge}
            className="mt-5 w-full rounded-xl py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: 'var(--accent)' }}
          >
            {submitting ? t('common.uploading') : t('tools.merge.label')}
          </button>
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
