import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { KeyRound } from 'lucide-react'
import { API_TOOL_SCHEMAS, type ApiToolSchema } from '@/lib/apiToolSchemas'
import { ApiTester } from '@/components/developers/ApiTester'
import { PromoBanner } from '@/components/PromoBanner'
import { usePageMeta } from '@/hooks/usePageMeta'

const TESTER_KEY_STORAGE = 'corehives-api-tester-key'

const GUIDE_LINKS = [
  { id: 'authentication', label: 'Authentication' },
  { id: 'flow', label: 'The request flow' },
  { id: 'job-status', label: 'Job status response' },
  { id: 'errors', label: 'Errors' },
  { id: 'webhooks', label: 'Webhooks' },
]

const ALL_NAV_IDS = [...GUIDE_LINKS.map((l) => l.id), ...API_TOOL_SCHEMAS.map((s) => s.slug)]

function useScrollSpy(ids: string[]) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const elements = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        setActiveId((prev) => {
          const visible = entries.filter((e) => e.isIntersecting)
          if (visible.length === 0) return prev
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          return visible[0].target.id
        })
      },
      { rootMargin: '-110px 0px -70% 0px', threshold: 0 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return activeId
}

function SidebarLink({ id, label, active }: { id: string; label: string; active: boolean }) {
  return (
    <a
      href={`#${id}`}
      className="block rounded-lg px-2.5 py-1.5 text-[15px] transition-colors"
      style={{
        color: active ? 'var(--accent)' : 'var(--text-h)',
        opacity: active ? 1 : 0.7,
        background: active ? 'var(--accent-soft)' : 'transparent',
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </a>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      className="overflow-x-auto rounded-xl border p-4 font-mono text-[13px] leading-relaxed"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
    >
      <code>{children}</code>
    </pre>
  )
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-14 max-w-2xl scroll-mt-24">
      <h2 className="mb-4 text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-h)' }}>
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed" style={{ color: 'var(--text)' }}>
        {children}
      </div>
    </section>
  )
}

function exampleValue(field: { placeholder?: string; default?: string; choices?: string[] }): string {
  if (field.choices?.length) return field.choices[0]
  return field.placeholder ?? field.default ?? ''
}

function buildExampleCurl(schema: ApiToolSchema): string {
  const lines = [`curl -X POST https://corehives.com/api${schema.path} \\`, `  -H "Authorization: Bearer pdfh_live_xxxxxxxxxxxxxxxxxxxxxxxx" \\`]

  schema.fileFields.forEach((field) => {
    const ext = field.accept.split(',')[0].replace('.', '')
    lines.push(`  -F "${field.name}=@example.${ext}" \\`)
  })

  schema.optionFields.forEach((field) => {
    const value = exampleValue(field)
    if (!value) return
    const key = field.topLevel ? field.name : `options[${field.name}]`
    lines.push(`  -F "${key}=${value}" \\`)
  })

  const last = lines[lines.length - 1]
  lines[lines.length - 1] = last.endsWith('\\') ? last.slice(0, -2) : last
  return lines.join('\n')
}

function ToolReference({ schema, apiKey }: { schema: ApiToolSchema; apiKey: string }) {
  return (
    <div id={schema.slug} className="scroll-mt-24 rounded-2xl border p-6" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--text-h)' }}>
          {schema.label}
        </h3>
        <code className="font-mono text-xs" style={{ color: 'var(--text)' }}>POST {schema.path}</code>
      </div>
      <p className="mt-1 text-[15px]" style={{ color: 'var(--text)' }}>
        {schema.summary}
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-2 lg:items-start">
        <div>
          {(schema.fileFields.length > 0 || schema.optionFields.length > 0) && (
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <th className="px-3 py-2 font-semibold" style={{ color: 'var(--text-h)' }}>Field</th>
                    <th className="px-3 py-2 font-semibold" style={{ color: 'var(--text-h)' }}>Type</th>
                    <th className="px-3 py-2 font-semibold" style={{ color: 'var(--text-h)' }}>Required</th>
                    <th className="px-3 py-2 font-semibold" style={{ color: 'var(--text-h)' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {schema.fileFields.map((field) => (
                    <tr key={field.name} className="border-b last:border-0" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                      <td className="px-3 py-2 font-mono" style={{ color: 'var(--text-h)' }}>{field.name}</td>
                      <td className="px-3 py-2">file</td>
                      <td className="px-3 py-2">Yes</td>
                      <td className="px-3 py-2">{field.hint}</td>
                    </tr>
                  ))}
                  {schema.optionFields.map((field) => (
                    <tr key={field.name} className="border-b last:border-0" style={{ borderColor: 'var(--border)', color: 'var(--text)' }}>
                      <td className="px-3 py-2 font-mono" style={{ color: 'var(--text-h)' }}>{field.topLevel ? field.name : `options[${field.name}]`}</td>
                      <td className="px-3 py-2">{field.type}</td>
                      <td className="px-3 py-2">
                        {field.required ? 'Yes' : field.default !== undefined ? `No, default ${field.default}` : 'No'}
                      </td>
                      <td className="px-3 py-2">{field.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {schema.notes && (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm" style={{ color: 'var(--text)' }}>
              {schema.notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          )}

          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-medium" style={{ color: 'var(--text-h)', opacity: 0.75 }}>Example request</summary>
            <div className="mt-2">
              <CodeBlock>{buildExampleCurl(schema)}</CodeBlock>
            </div>
          </details>
        </div>

        <ApiTester schema={schema} apiKey={apiKey} />
      </div>
    </div>
  )
}

export function DeveloperDocs() {
  usePageMeta('API Reference', 'Full request and response reference for every PDFHives endpoint, with a live tester for each one.')
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(TESTER_KEY_STORAGE) ?? '')
  const activeId = useScrollSpy(ALL_NAV_IDS)

  useEffect(() => {
    localStorage.setItem(TESTER_KEY_STORAGE, apiKey)
  }, [apiKey])

  return (
    <div className="lg:grid lg:grid-cols-[220px_1fr] lg:items-start lg:gap-14">
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pb-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide opacity-50">Guides</p>
        <nav className="space-y-1">
          {GUIDE_LINKS.map((link) => (
            <SidebarLink key={link.id} id={link.id} label={link.label} active={activeId === link.id} />
          ))}
        </nav>
        <p className="mt-6 mb-2 text-xs font-semibold uppercase tracking-wide opacity-50">Endpoints</p>
        <nav className="space-y-1">
          {API_TOOL_SCHEMAS.map((schema) => (
            <SidebarLink key={schema.slug} id={schema.slug} label={schema.label} active={activeId === schema.slug} />
          ))}
        </nav>
      </aside>

      <div className="min-w-0">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--text-h)' }}>
            API reference
          </h1>
          <p className="mt-3 text-[17px] leading-relaxed" style={{ color: 'var(--text)' }}>
            Every PDF and image tool on PDFHives, available as a REST API. This page documents every endpoint's exact request
            fields and response shape, and includes a live tester on each one so you can send a real request before
            you write any code.
          </p>
          <p className="mt-3 text-[15px]" style={{ color: 'var(--text)' }}>
            Base URL: <code className="rounded bg-[var(--bg-soft)] px-1.5 py-0.5 font-mono">https://corehives.com/api</code>
          </p>
        </motion.div>

        <PromoBanner
          eyebrow="No key yet?"
          title="Get a free API key in under a minute"
          body="100 files a month on the free tier, no credit card required. Create an account and start testing the live requests below right away."
          ctaLabel="Create free account"
          ctaTo="/developers/register"
          ctaNewTab
          icon={KeyRound}
          gradient="linear-gradient(135deg, #7c3aed, #c026d3)"
          className="mt-8 max-w-2xl"
        />

        <Section id="authentication" title="Authentication">
          <p>Every request needs your API key as a bearer token.</p>
          <CodeBlock>{`Authorization: Bearer pdfh_live_xxxxxxxxxxxxxxxxxxxxxxxx`}</CodeBlock>
          <p>
            Get a key from your <a href="/developers/dashboard" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--accent)' }}>dashboard</a>. Free
            accounts get 100 files per month.
          </p>
        </Section>

        <Section id="flow" title="The request flow">
          <p>Every tool follows the same three steps.</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              <strong>Submit.</strong> <code className="font-mono">POST /v1/tools/&#123;tool&#125;</code> with your file(s) and options. You get back
              a <code className="font-mono">job_id</code> immediately, with a <code className="font-mono">202</code> status.
            </li>
            <li>
              <strong>Poll.</strong> <code className="font-mono">GET /v1/jobs/&#123;job_id&#125;</code> until <code className="font-mono">status</code> is{' '}
              <code className="font-mono">completed</code> or <code className="font-mono">failed</code>. Polling does not count against your quota.
            </li>
            <li>
              <strong>Download.</strong> Follow the <code className="font-mono">download_url</code> from the completed response. It is a signed
              URL, valid for 30 minutes.
            </li>
          </ol>
          <p>
            Or skip polling entirely and register a{' '}
            <a href="#webhooks" className="underline" style={{ color: 'var(--accent)' }}>webhook</a> to get notified the moment a job finishes.
          </p>
        </Section>

        <Section id="job-status" title="Job status response">
          <p><code className="font-mono">GET /v1/jobs/&#123;job_id&#125;</code> returns:</p>
          <CodeBlock>{`{
  "id": "0199f1a2-...",
  "tool_type": "merge",
  "status": "completed",
  "progress": 100,
  "error_message": null,
  "download_url": "https://corehives.com/api/jobs/0199f1a2-.../download?...",
  "expires_at": "2026-08-19T15:04:00.000000Z"
}`}</CodeBlock>
          <p>
            <code className="font-mono">status</code> is one of <code className="font-mono">pending</code>, <code className="font-mono">processing</code>,{' '}
            <code className="font-mono">completed</code>, or <code className="font-mono">failed</code>. <code className="font-mono">expires_at</code> is
            when the input and output files are permanently deleted (1 hour after the job was created).
          </p>
        </Section>

        <Section id="errors" title="Errors">
          <ul className="list-disc space-y-1 pl-5">
            <li><code className="font-mono">401 missing_api_key</code> or <code className="font-mono">invalid_api_key</code>: no key, or the key is wrong or revoked.</li>
            <li><code className="font-mono">422</code>: invalid request, such as a missing required option or an unsupported file type.</li>
            <li>
              <code className="font-mono">429 quota_exceeded</code>: you have used your monthly quota. The response includes{' '}
              <code className="font-mono">quota</code>, <code className="font-mono">used</code>, and <code className="font-mono">resets_at</code>.
            </li>
          </ul>
          <CodeBlock>{`{
  "error": "quota_exceeded",
  "message": "You've used all 100 files in your free plan for this period.",
  "quota": 100,
  "used": 100,
  "resets_at": "2026-09-01T00:00:00.000000Z"
}`}</CodeBlock>
        </Section>

        <Section id="webhooks" title="Webhooks">
          <p>Set a webhook URL on your key from the dashboard. When a job finishes, PDFHives sends a <code className="font-mono">POST</code> to it.</p>
          <CodeBlock>{`{
  "event": "task.completed",
  "data": {
    "job_id": "0199f1a2-...",
    "tool": "merge",
    "status": "completed",
    "download_url": "https://...",
    "error_message": null
  }
}`}</CodeBlock>
          <p>The same shape is sent with <code className="font-mono">"event": "task.failed"</code> and <code className="font-mono">download_url: null</code> when a job fails.</p>
        </Section>

        <section className="mt-16">
          <h2 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-h)' }}>
            Endpoints
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed" style={{ color: 'var(--text)' }}>
            Every field each endpoint accepts, with an example request and a live tester. Enter your key once below,
            it applies to every endpoint on this page.
          </p>

          <div className="sticky top-16 z-10 mt-5 max-w-md rounded-xl border p-3" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
            <label className="mb-1 block text-xs font-semibold" style={{ color: 'var(--text-h)' }}>Your API key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="pdfh_live_..."
              className="w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none"
              style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
            />
            <p className="mt-1 text-xs" style={{ color: 'var(--text)' }}>Stored only in your browser. Get one from your dashboard.</p>
          </div>

          <div className="mt-6 space-y-6">
            {API_TOOL_SCHEMAS.map((schema) => (
              <ToolReference key={schema.slug} schema={schema} apiKey={apiKey} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
