import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FileDropzone } from '@/components/FileDropzone'
import { ProgressTracker } from '@/components/ProgressTracker'
import { AdSlot } from '@/components/AdSlot'
import { useJobStatus } from '@/hooks/useJobStatus'
import { uploadToolFiles } from '@/lib/api'

interface SimpleToolPageProps {
  tool: string
  title: string
  description: string
  accept?: Record<string, string[]>
  multiple?: boolean
  minFiles?: number
  submitLabel?: string
  /** Render tool-specific option inputs; return the current options as a flat string map. */
  optionsForm?: (options: Record<string, string>, setOptions: (o: Record<string, string>) => void) => ReactNode
  /** Validate options before submit; return an error message, or null if valid. */
  validateOptions?: (options: Record<string, string>) => string | null
}

export function SimpleToolPage({
  tool,
  title,
  description,
  accept = { 'application/pdf': ['.pdf'] },
  multiple = false,
  minFiles = 1,
  submitLabel,
  optionsForm,
  validateOptions,
}: SimpleToolPageProps) {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const [options, setOptions] = useState<Record<string, string>>({})
  const [jobId, setJobId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const job = useJobStatus(jobId)

  async function handleSubmit() {
    if (files.length < minFiles) {
      setError(t('common.addAtLeast', { count: minFiles }))
      return
    }
    if (validateOptions) {
      const validationError = validateOptions(options)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    setError(null)
    setSubmitting(true)
    try {
      const id = await uploadToolFiles(tool, files, options)
      setJobId(id)
    } catch {
      setError(t('common.uploadFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setFiles([])
    setOptions({})
    setJobId(null)
    setError(null)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          {title}
        </h1>
        <p className="mt-2 opacity-70">{description}</p>
      </motion.div>

      {!jobId && (
        <>
          <FileDropzone files={files} onFilesChange={setFiles} accept={accept} multiple={multiple} />

          {optionsForm && files.length > 0 && (
            <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              {optionsForm(options, setOptions)}
            </div>
          )}

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <button
            type="button"
            disabled={files.length < minFiles || submitting}
            onClick={handleSubmit}
            className="mt-5 w-full rounded-xl py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: 'var(--accent)' }}
          >
            {submitting ? t('common.uploading') : (submitLabel ?? title)}
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
