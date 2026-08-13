import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
})

export type PdfJobStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface PdfJob {
  id: string
  tool_type: string
  status: PdfJobStatus
  progress: number
  error_message: string | null
  download_url: string | null
  expires_at: string | null
}

export async function uploadMergeFiles(files: File[]) {
  return uploadToolFiles('merge', files)
}

export async function uploadToolFiles(tool: string, files: File[], options?: Record<string, string>) {
  const formData = new FormData()
  files.forEach((file) => formData.append('files[]', file))
  if (options) {
    Object.entries(options).forEach(([key, value]) => formData.append(`options[${key}]`, value))
  }

  const { data } = await api.post<{ job_id: string }>(`/tools/${tool}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.job_id
}

export async function getJobStatus(jobId: string) {
  const { data } = await api.get<PdfJob>(`/jobs/${jobId}`)
  return data
}
