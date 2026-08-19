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

export async function uploadSignFiles(pdf: File, signature: Blob, page = 0) {
  const formData = new FormData()
  formData.append('pdf', pdf)
  formData.append('signature', signature, 'signature.png')
  formData.append('page', String(page))

  const { data } = await api.post<{ job_id: string }>('/tools/sign', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.job_id
}

export async function submitHtmlToImage(url: string, format: 'jpg' | 'png') {
  const { data } = await api.post<{ job_id: string }>('/tools/html-to-image', { url, format })
  return data.job_id
}

export async function getJobStatus(jobId: string) {
  const { data } = await api.get<PdfJob>(`/jobs/${jobId}`)
  return data
}
