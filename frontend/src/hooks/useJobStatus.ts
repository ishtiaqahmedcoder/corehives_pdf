import { useEffect, useRef, useState } from 'react'
import { getJobStatus, type PdfJob } from '@/lib/api'

const POLL_INTERVAL_MS = 1200

export function useJobStatus(jobId: string | null) {
  const [job, setJob] = useState<PdfJob | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!jobId) {
      setJob(null)
      return
    }

    let cancelled = false

    async function poll() {
      try {
        const data = await getJobStatus(jobId as string)
        if (cancelled) return
        setJob(data)
        if (data.status === 'pending' || data.status === 'processing') {
          timerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
        }
      } catch {
        if (!cancelled) timerRef.current = setTimeout(poll, POLL_INTERVAL_MS)
      }
    }

    poll()

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [jobId])

  return job
}
