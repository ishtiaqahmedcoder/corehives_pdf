import { motion } from 'framer-motion'
import { API_TOOL_SCHEMAS, type ApiToolSchema } from '@/lib/apiToolSchemas'
import { ApiTester } from '@/components/developers/ApiTester'

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      className="overflow-x-auto rounded-xl border p-4 text-xs leading-relaxed"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)', color: 'var(--text-h)' }}
    >
      <code>{children}</code>
    </pre>
  )
}

function Section({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mt-12 scroll-mt-20">
      <h2 className="mb-3 text-xl font-semibold" style={{ color: 'var(--text-h)' }}>
        {title}
      </h2>
      <div className="space-y-3 text-sm opacity-90">{children}</div>
    </section>
  )
}

function exampleValue(field: { placeholder?: string; default?: string; choices?: string[] }): string {
  if (field.choices?.length) return field.choices[0]
  return field.placeholder ?? field.default ?? ''
}

function buildExampleCurl(schema: ApiToolSchema): string {
  const lines = [`curl -X POST https://corehives.com/api${schema.path} \\`, `  -H "Authorization: Bearer chp_live_xxxxxxxxxxxxxxxxxxxxxxxx" \\`]

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

function ToolReference({ schema }: { schema: ApiToolSchema }) {
  return (
    <div id={schema.slug} className="scroll-mt-20 rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-semibold" style={{ color: 'var(--text-h)' }}>
          {schema.label}
        </h3>
        <code className="text-xs opacity-60">POST {schema.path}</code>
      </div>
      <p className="mt-1 text-sm opacity-70">{schema.summary}</p>

      {(schema.fileFields.length > 0 || schema.optionFields.length > 0) && (
        <div className="mt-4 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                <th className="px-3 py-2 font-medium opacity-60">Field</th>
                <th className="px-3 py-2 font-medium opacity-60">Type</th>
                <th className="px-3 py-2 font-medium opacity-60">Required</th>
                <th className="px-3 py-2 font-medium opacity-60">Description</th>
              </tr>
            </thead>
            <tbody>
              {schema.fileFields.map((field) => (
                <tr key={field.name} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-3 py-2 font-mono">{field.name}</td>
                  <td className="px-3 py-2 opacity-70">file</td>
                  <td className="px-3 py-2 opacity-70">Yes</td>
                  <td className="px-3 py-2 opacity-70">{field.hint}</td>
                </tr>
              ))}
              {schema.optionFields.map((field) => (
                <tr key={field.name} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-3 py-2 font-mono">{field.topLevel ? field.name : `options[${field.name}]`}</td>
                  <td className="px-3 py-2 opacity-70">{field.type}</td>
                  <td className="px-3 py-2 opacity-70">
                    {field.required ? 'Yes' : field.default !== undefined ? `No, default ${field.default}` : 'No'}
                  </td>
                  <td className="px-3 py-2 opacity-70">{field.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {schema.notes && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-xs opacity-60">
          {schema.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}

      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-medium opacity-60">Example request</summary>
        <div className="mt-2">
          <CodeBlock>{buildExampleCurl(schema)}</CodeBlock>
        </div>
      </details>
    </div>
  )
}

export function DeveloperDocs() {
  return (
    <div className="mx-auto max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          API reference
        </h1>
        <p className="mt-2 max-w-xl opacity-70">
          Every PDF tool on CoreHives, available as a REST API. This page documents every endpoint's exact request
          fields and response shape, and includes a live tester so you can send a real request before you write any code.
        </p>
        <p className="mt-2 opacity-70">
          Base URL: <code className="rounded bg-[var(--bg-soft)] px-1.5 py-0.5">https://corehives.com/api</code>
        </p>
      </motion.div>

      <Section title="Authentication">
        <p>Every request needs your API key as a bearer token.</p>
        <CodeBlock>{`Authorization: Bearer chp_live_xxxxxxxxxxxxxxxxxxxxxxxx`}</CodeBlock>
        <p>
          Get a key from your <a href="/developers/dashboard" className="underline" style={{ color: 'var(--accent)' }}>dashboard</a>. Free
          accounts get 100 files per month.
        </p>
      </Section>

      <Section title="The request flow">
        <p>Every tool follows the same three steps.</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            <strong>Submit.</strong> <code>POST /v1/tools/&#123;tool&#125;</code> with your file(s) and options. You get back a{' '}
            <code>job_id</code> immediately, with a <code>202</code> status.
          </li>
          <li>
            <strong>Poll.</strong> <code>GET /v1/jobs/&#123;job_id&#125;</code> until <code>status</code> is{' '}
            <code>completed</code> or <code>failed</code>. Polling does not count against your quota.
          </li>
          <li>
            <strong>Download.</strong> Follow the <code>download_url</code> from the completed response. It is a signed
            URL, valid for 30 minutes.
          </li>
        </ol>
        <p>
          Or skip polling entirely and register a <a href="#webhooks" className="underline" style={{ color: 'var(--accent)' }}>webhook</a> to
          get notified the moment a job finishes.
        </p>
      </Section>

      <Section title="Job status response">
        <p><code>GET /v1/jobs/&#123;job_id&#125;</code> returns:</p>
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
          <code>status</code> is one of <code>pending</code>, <code>processing</code>, <code>completed</code>, or{' '}
          <code>failed</code>. <code>expires_at</code> is when the input and output files are permanently deleted
          (1 hour after the job was created).
        </p>
      </Section>

      <Section title="Errors">
        <ul className="list-disc space-y-1 pl-5">
          <li><code>401 missing_api_key</code> or <code>invalid_api_key</code>: no key, or the key is wrong or revoked.</li>
          <li><code>422</code>: invalid request, such as a missing required option or an unsupported file type.</li>
          <li>
            <code>429 quota_exceeded</code>: you have used your monthly quota. The response includes{' '}
            <code>quota</code>, <code>used</code>, and <code>resets_at</code>.
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
        <p>Set a webhook URL on your key from the dashboard. When a job finishes, CoreHives sends a <code>POST</code> to it.</p>
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
        <p>The same shape is sent with <code>"event": "task.failed"</code> and <code>download_url: null</code> when a job fails.</p>
      </Section>

      <Section title="Try it live">
        <p>Paste a real API key, fill in the fields, and send an actual request against your account.</p>
        <ApiTester />
      </Section>

      <section className="mt-12">
        <h2 className="mb-3 text-xl font-semibold" style={{ color: 'var(--text-h)' }}>
          Endpoints
        </h2>
        <p className="mb-4 text-sm opacity-70">
          Every field each endpoint accepts, with an example request. Tools not listed here take no options beyond
          the file itself.
        </p>
        <div className="space-y-4">
          {API_TOOL_SCHEMAS.map((schema) => (
            <ToolReference key={schema.slug} schema={schema} />
          ))}
        </div>
      </section>
    </div>
  )
}
