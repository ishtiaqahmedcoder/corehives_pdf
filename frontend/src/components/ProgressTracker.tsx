import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import type { PdfJob } from '@/lib/api'

interface ProgressTrackerProps {
  job: PdfJob
}

export function ProgressTracker({ job }: ProgressTrackerProps) {
  const { t } = useTranslation()

  const statusLabel: Record<PdfJob['status'], string> = {
    pending: t('common.statusQueued'),
    processing: t('common.statusProcessing'),
    completed: t('common.statusDone'),
    failed: t('common.statusFailed'),
  }

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-medium" style={{ color: 'var(--text-h)' }}>
          {statusLabel[job.status]}
        </span>
        <span className="text-sm opacity-60">{job.progress}%</span>
      </div>

      <div
        className="h-2.5 w-full overflow-hidden rounded-full"
        style={{ background: 'var(--bg-soft)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'var(--accent)' }}
          initial={{ width: 0 }}
          animate={{ width: `${job.progress}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {job.status === 'failed' && job.error_message && (
        <p className="mt-3 text-sm text-red-500">{job.error_message}</p>
      )}

      {job.status === 'completed' && job.download_url && (
        <motion.a
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          href={job.download_url}
          className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-medium text-white"
          style={{ background: 'var(--accent)' }}
        >
          {t('common.download')}
        </motion.a>
      )}
    </div>
  )
}
