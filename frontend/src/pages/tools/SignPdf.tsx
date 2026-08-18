import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FileDropzone } from '@/components/FileDropzone'
import { ProgressTracker } from '@/components/ProgressTracker'
import { AdSlot } from '@/components/AdSlot'
import { SignaturePad, type SignaturePadHandle } from '@/components/SignaturePad'
import { useJobStatus } from '@/hooks/useJobStatus'
import { uploadSignFiles } from '@/lib/api'

export function SignPdf() {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const [hasSignature, setHasSignature] = useState(false)
  const [jobId, setJobId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const padRef = useRef<SignaturePadHandle>(null)

  const job = useJobStatus(jobId)

  async function handleSubmit() {
    if (files.length < 1) {
      setError(t('common.addAtLeast', { count: 1 }))
      return
    }
    if (!padRef.current || padRef.current.isEmpty()) {
      setError(t('common.drawSignatureFirst'))
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      const blob = await padRef.current.toBlob()
      if (!blob) throw new Error('empty signature')
      const id = await uploadSignFiles(files[0], blob)
      setJobId(id)
    } catch {
      setError(t('common.uploadFailed'))
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setFiles([])
    setHasSignature(false)
    setJobId(null)
    setError(null)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          {t('tools.sign.label')}
        </h1>
        <p className="mt-2 opacity-70">{t('tools.sign.description')}</p>
      </motion.div>

      {!jobId && (
        <>
          <FileDropzone files={files} onFilesChange={setFiles} multiple={false} />

          {files.length > 0 && (
            <div className="mt-4">
              <span className="mb-2 block text-left text-sm font-medium" style={{ color: 'var(--text-h)' }}>
                {t('common.signaturePad')}
              </span>
              <SignaturePad ref={padRef} onChange={setHasSignature} />
            </div>
          )}

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <button
            type="button"
            disabled={files.length < 1 || !hasSignature || submitting}
            onClick={handleSubmit}
            className="mt-5 w-full rounded-xl py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: 'var(--accent)' }}
          >
            {submitting ? t('common.uploading') : t('tools.sign.label')}
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
