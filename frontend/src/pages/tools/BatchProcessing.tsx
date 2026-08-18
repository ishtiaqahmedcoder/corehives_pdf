import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { FileDropzone } from '@/components/FileDropzone'
import { PasswordField } from '@/components/PasswordField'
import { ProgressTracker } from '@/components/ProgressTracker'
import { AdSlot } from '@/components/AdSlot'
import { useJobStatus } from '@/hooks/useJobStatus'
import { uploadToolFiles } from '@/lib/api'

const BATCH_TOOLS = ['compress', 'rotate', 'watermark', 'page-numbers', 'crop', 'protect', 'unlock'] as const
type BatchTool = (typeof BATCH_TOOLS)[number]

export function BatchProcessing() {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const [tool, setTool] = useState<BatchTool>('compress')
  const [options, setOptions] = useState<Record<string, string>>({})
  const [jobId, setJobId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const job = useJobStatus(jobId)

  function needsOptions(t: BatchTool) {
    return ['rotate', 'watermark', 'crop', 'protect', 'unlock'].includes(t)
  }

  async function handleSubmit() {
    if (files.length < 2) {
      setError(t('common.addAtLeast', { count: 2 }))
      return
    }
    if (tool === 'watermark' && !options.text?.trim()) {
      setError(t('common.enterWatermarkText'))
      return
    }
    if ((tool === 'protect' || tool === 'unlock') && !options.password) {
      setError(t('common.enterPassword'))
      return
    }

    setError(null)
    setSubmitting(true)
    try {
      const id = await uploadToolFiles('batch', files, {
        batch_tool: tool,
        tool_options: JSON.stringify(options),
      })
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
          {t('tools.batch.label')}
        </h1>
        <p className="mt-2 opacity-70">{t('tools.batch.description')}</p>
      </motion.div>

      {!jobId && (
        <>
          <label className="mb-4 block text-left text-sm">
            <span className="font-medium" style={{ color: 'var(--text-h)' }}>
              {t('common.selectToolLabel')}
            </span>
            <select
              value={tool}
              onChange={(e) => {
                setTool(e.target.value as BatchTool)
                setOptions({})
              }}
              className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
            >
              {BATCH_TOOLS.map((slug) => (
                <option key={slug} value={slug}>
                  {t(`tools.${slug}.label`)}
                </option>
              ))}
            </select>
          </label>

          <FileDropzone files={files} onFilesChange={setFiles} multiple />

          {needsOptions(tool) && files.length > 0 && (
            <div className="mt-4 rounded-2xl border p-4" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
              {tool === 'watermark' && (
                <label className="block text-left text-sm">
                  <span className="font-medium" style={{ color: 'var(--text-h)' }}>
                    {t('common.watermarkTextLabel')}
                  </span>
                  <input
                    type="text"
                    value={options.text ?? ''}
                    onChange={(e) => setOptions({ ...options, text: e.target.value })}
                    placeholder={t('common.watermarkPlaceholder')}
                    className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
                  />
                </label>
              )}

              {tool === 'rotate' && (
                <div className="space-y-4">
                  <label className="block text-left text-sm">
                    <span className="font-medium" style={{ color: 'var(--text-h)' }}>
                      {t('common.rotationLabel')}
                    </span>
                    <select
                      value={options.degrees ?? '90'}
                      onChange={(e) => setOptions({ ...options, degrees: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                      style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
                    >
                      <option value="90">{t('common.rotate90')}</option>
                      <option value="180">{t('common.rotate180')}</option>
                      <option value="270">{t('common.rotate270')}</option>
                    </select>
                  </label>
                </div>
              )}

              {tool === 'crop' && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                    <label key={side} className="block text-left text-xs">
                      <span className="opacity-70">{t(`common.crop.${side}`)}</span>
                      <input
                        type="number"
                        min={0}
                        max={150}
                        value={options[side] ?? ''}
                        onChange={(e) => setOptions({ ...options, [side]: e.target.value })}
                        placeholder="0"
                        className="mt-1 w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none"
                        style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
                      />
                    </label>
                  ))}
                </div>
              )}

              {tool === 'protect' && (
                <PasswordField
                  label={t('common.setPasswordLabel')}
                  value={options.password ?? ''}
                  onChange={(password) => setOptions({ ...options, password })}
                />
              )}

              {tool === 'unlock' && (
                <PasswordField
                  label={t('common.currentPasswordLabel')}
                  value={options.password ?? ''}
                  onChange={(password) => setOptions({ ...options, password })}
                />
              )}
            </div>
          )}

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <button
            type="button"
            disabled={files.length < 2 || submitting}
            onClick={handleSubmit}
            className="mt-5 w-full rounded-xl py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: 'var(--accent)' }}
          >
            {submitting ? t('common.uploading') : t('tools.batch.label')}
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
