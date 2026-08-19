import { useState } from 'react'
import { motion } from 'framer-motion'
import { AdSlot } from '@/components/AdSlot'
import { ProgressTracker } from '@/components/ProgressTracker'
import { useJobStatus } from '@/hooks/useJobStatus'
import { submitHtmlToImage } from '@/lib/api'

export function HtmlToImage() {
  const [url, setUrl] = useState('')
  const [format, setFormat] = useState<'jpg' | 'png'>('jpg')
  const [jobId, setJobId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const job = useJobStatus(jobId)

  async function handleSubmit() {
    if (!url.trim()) {
      setError('Enter a URL.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const id = await submitHtmlToImage(url.trim(), format)
      setJobId(id)
    } catch {
      setError('Could not render this page. Please check the URL and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setUrl('')
    setJobId(null)
    setError(null)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          HTML to Image
        </h1>
        <p className="mt-2 opacity-70">Turn a web page into a JPG or PNG</p>
      </motion.div>

      {!jobId && (
        <>
          <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <label className="block text-left text-sm">
              <span className="font-medium" style={{ color: 'var(--text-h)' }}>
                Page URL
              </span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
              />
            </label>

            <label className="mt-4 block text-left text-sm">
              <span className="font-medium" style={{ color: 'var(--text-h)' }}>
                Output format
              </span>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as 'jpg' | 'png')}
                className="mt-1.5 w-full rounded-lg border px-3 py-2 text-sm outline-none"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
              >
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </label>
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <button
            type="button"
            disabled={!url.trim() || submitting}
            onClick={handleSubmit}
            className="mt-5 w-full rounded-xl py-3 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: 'var(--accent)' }}
          >
            {submitting ? 'Rendering…' : 'Convert to Image'}
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
              Start another
            </button>
          )}
        </div>
      )}

      <AdSlot className="mt-10" />
    </div>
  )
}
