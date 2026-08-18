import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Play, Loader2, CheckCircle2, XCircle, Download } from 'lucide-react'
import { API_TOOL_SCHEMAS, type ApiOptionField } from '@/lib/apiToolSchemas'

const TESTER_KEY_STORAGE = 'corehives-api-tester-key'

const testerApi = axios.create({ baseURL: '/api' })

type PollStatus = 'idle' | 'sending' | 'polling' | 'completed' | 'failed' | 'error'

interface RequestError {
  status: number | null
  body: unknown
}

function fieldInputType(type: ApiOptionField['type']) {
  if (type === 'int' || type === 'float') return 'number'
  if (type === 'password') return 'password'
  return 'text'
}

export function ApiTester() {
  const [slug, setSlug] = useState(API_TOOL_SCHEMAS[0].slug)
  const schema = API_TOOL_SCHEMAS.find((s) => s.slug === slug)!

  const [apiKey, setApiKey] = useState(() => localStorage.getItem(TESTER_KEY_STORAGE) ?? '')
  const [files, setFiles] = useState<Record<string, FileList | null>>({})
  const [optionValues, setOptionValues] = useState<Record<string, string>>({})

  const [status, setStatus] = useState<PollStatus>('idle')
  const [jobId, setJobId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [requestError, setRequestError] = useState<RequestError | null>(null)
  const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    localStorage.setItem(TESTER_KEY_STORAGE, apiKey)
  }, [apiKey])

  useEffect(() => {
    // Reset the form's transient state whenever a different tool is selected.
    setFiles({})
    const defaults: Record<string, string> = {}
    schema.optionFields.forEach((f) => {
      if (f.default !== undefined) defaults[f.name] = f.default
    })
    setOptionValues(defaults)
    setStatus('idle')
    setJobId(null)
    setDownloadUrl(null)
    setRequestError(null)
    if (pollRef.current) clearTimeout(pollRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  useEffect(() => () => { if (pollRef.current) clearTimeout(pollRef.current) }, [])

  function buildFormData() {
    const formData = new FormData()

    schema.fileFields.forEach((field) => {
      const list = files[field.name]
      if (!list) return
      Array.from(list).forEach((file) => {
        formData.append(field.name, file)
      })
    })

    schema.optionFields.forEach((field) => {
      const value = optionValues[field.name]
      if (value === undefined || value === '') return
      const key = field.topLevel ? field.name : `options[${field.name}]`
      formData.append(key, value)
    })

    return formData
  }

  function pollJob(id: string) {
    setStatus('polling')
    const tick = async () => {
      try {
        const { data } = await testerApi.get(`/v1/jobs/${id}`, {
          headers: { Authorization: `Bearer ${apiKey}` },
        })
        setProgress(data.progress ?? 0)
        if (data.status === 'completed') {
          setStatus('completed')
          setDownloadUrl(data.download_url)
          return
        }
        if (data.status === 'failed') {
          setStatus('failed')
          setRequestError({ status: null, body: data })
          return
        }
        pollRef.current = setTimeout(tick, 1200)
      } catch (err) {
        setStatus('error')
        if (axios.isAxiosError(err)) {
          setRequestError({ status: err.response?.status ?? null, body: err.response?.data ?? err.message })
        }
      }
    }
    tick()
  }

  async function handleSend() {
    setStatus('sending')
    setRequestError(null)
    setDownloadUrl(null)
    setJobId(null)
    try {
      const { data } = await testerApi.post(schema.path, buildFormData(), {
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'multipart/form-data' },
      })
      setJobId(data.job_id)
      pollJob(data.job_id)
    } catch (err) {
      setStatus('error')
      if (axios.isAxiosError(err)) {
        setRequestError({ status: err.response?.status ?? null, body: err.response?.data ?? err.message })
      }
    }
  }

  const missingRequired = [
    ...schema.fileFields.filter((f) => !files[f.name]?.length),
    ...schema.optionFields.filter((f) => f.required && !optionValues[f.name]),
  ]
  const canSend = apiKey.trim().length > 0 && missingRequired.length === 0 && status !== 'sending' && status !== 'polling'

  const curl = buildCurlPreview(schema, apiKey, files, optionValues)

  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-medium" style={{ color: 'var(--text-h)' }}>
          Try it live
        </h3>
        <select
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="rounded-lg border px-2.5 py-1.5 text-sm outline-none"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
        >
          {API_TOOL_SCHEMAS.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium opacity-70">API key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="chp_live_..."
            className="w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
          />
          <p className="mt-1 text-xs opacity-50">Stored only in your browser. Get one from your dashboard.</p>
        </div>

        {schema.fileFields.map((field) => (
          <div key={field.name}>
            <label className="mb-1 block text-xs font-medium opacity-70">
              {field.label} <span className="opacity-50">({field.hint})</span>
            </label>
            <input
              type="file"
              accept={field.accept}
              multiple={field.multiple}
              onChange={(e) => setFiles((prev) => ({ ...prev, [field.name]: e.target.files }))}
              className="w-full rounded-lg border px-2.5 py-1.5 text-xs outline-none"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
            />
          </div>
        ))}

        {schema.optionFields.map((field) => (
          <div key={field.name}>
            <label className="mb-1 block text-xs font-medium opacity-70">
              {field.label} {field.required ? <span style={{ color: 'var(--accent)' }}>*</span> : <span className="opacity-50">(optional)</span>}
            </label>
            {field.type === 'select' ? (
              <select
                value={optionValues[field.name] ?? ''}
                onChange={(e) => setOptionValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                className="w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
              >
                <option value="">Select…</option>
                {field.choices?.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            ) : field.type === 'json' ? (
              <textarea
                value={optionValues[field.name] ?? ''}
                onChange={(e) => setOptionValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                rows={2}
                className="w-full rounded-lg border px-2.5 py-1.5 font-mono text-xs outline-none"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
              />
            ) : (
              <input
                type={fieldInputType(field.type)}
                value={optionValues[field.name] ?? ''}
                onChange={(e) => setOptionValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
                placeholder={field.placeholder}
                className="w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
              />
            )}
            <p className="mt-1 text-xs opacity-50">{field.description}</p>
          </div>
        ))}
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-medium opacity-60">Equivalent curl request</summary>
        <pre
          className="mt-2 overflow-x-auto rounded-lg border p-3 text-xs leading-relaxed"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}
        >
          <code>{curl}</code>
        </pre>
      </details>

      <button
        type="button"
        onClick={handleSend}
        disabled={!canSend}
        className="mt-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium text-white disabled:opacity-40"
        style={{ background: 'var(--accent)' }}
      >
        {status === 'sending' || status === 'polling' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
        {status === 'sending' ? 'Sending…' : status === 'polling' ? `Processing… ${progress}%` : 'Send request'}
      </button>

      {jobId && (status === 'polling' || status === 'sending') && (
        <p className="mt-2 text-xs opacity-60">
          job_id: <code>{jobId}</code>
        </p>
      )}

      {status === 'completed' && downloadUrl && (
        <a
          href={downloadUrl}
          className="mt-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium"
          style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
        >
          <CheckCircle2 className="h-4 w-4" />
          <Download className="h-4 w-4" />
          Download result
        </a>
      )}

      {(status === 'failed' || status === 'error') && requestError && (
        <div className="mt-4 rounded-xl border p-3" style={{ borderColor: '#ef4444' }}>
          <p className="flex items-center gap-2 text-sm font-medium text-red-500">
            <XCircle className="h-4 w-4" />
            {requestError.status ? `Request failed (${requestError.status})` : 'Job failed'}
          </p>
          <pre className="mt-2 overflow-x-auto text-xs opacity-80">
            <code>{JSON.stringify(requestError.body, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  )
}

function buildCurlPreview(
  schema: (typeof API_TOOL_SCHEMAS)[number],
  apiKey: string,
  files: Record<string, FileList | null>,
  optionValues: Record<string, string>,
) {
  const lines = [`curl -X POST https://corehives.com/api${schema.path} \\`, `  -H "Authorization: Bearer ${apiKey || 'chp_live_xxxxxxxxxxxxxxxxxxxxxxxx'}" \\`]

  schema.fileFields.forEach((field) => {
    const list = files[field.name]
    if (list && list.length > 0) {
      Array.from(list).forEach((f) => lines.push(`  -F "${field.name}=@${f.name}" \\`))
    } else {
      lines.push(`  -F "${field.name}=@example.${field.accept.split(',')[0].replace('.', '')}" \\`)
    }
  })

  schema.optionFields.forEach((field) => {
    const value = optionValues[field.name] ?? field.placeholder ?? ''
    if (!value) return
    const key = field.topLevel ? field.name : `options[${field.name}]`
    lines.push(`  -F "${key}=${value}" \\`)
  })

  const last = lines[lines.length - 1]
  lines[lines.length - 1] = last.endsWith('\\') ? last.slice(0, -2) : last

  return lines.join('\n')
}
