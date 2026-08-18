import { motion } from 'framer-motion'
import { TOOLS } from '@/lib/tools'

const BESPOKE_ENDPOINTS = new Set(['merge', 'sign'])
const NON_API_SLUGS = new Set(['privacy', 'urdu']) // marketing cards, not real endpoints

const API_TOOLS = TOOLS.filter((t) => t.ready && !NON_API_SLUGS.has(t.slug))

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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xl font-semibold" style={{ color: 'var(--text-h)' }}>
        {title}
      </h2>
      <div className="space-y-3 text-sm opacity-90">{children}</div>
    </section>
  )
}

export function DeveloperDocs() {
  return (
    <div className="mx-auto max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--text-h)' }}>
          API Documentation
        </h1>
        <p className="mt-2 opacity-70">
          Base URL: <code className="rounded bg-[var(--bg-soft)] px-1.5 py-0.5">https://corehives.com/api/v1</code>
        </p>
      </motion.div>

      <Section title="Authentication">
        <p>Every request needs your API key as a bearer token:</p>
        <CodeBlock>{`Authorization: Bearer chp_live_xxxxxxxxxxxxxxxxxxxxxxxx`}</CodeBlock>
        <p>Get a key from your <a href="/developers/dashboard" className="underline" style={{ color: 'var(--accent)' }}>dashboard</a> — free accounts get 100 files/month.</p>
      </Section>

      <Section title="The flow">
        <p>Every tool follows the same three steps:</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li><strong>Submit</strong> — <code>POST /v1/tools/&#123;tool&#125;</code> with your file(s), get back a <code>job_id</code> immediately (202 Accepted).</li>
          <li><strong>Poll</strong> — <code>GET /v1/jobs/&#123;job_id&#125;</code> until <code>status</code> is <code>completed</code> or <code>failed</code> (doesn't count against your quota).</li>
          <li><strong>Download</strong> — follow the <code>download_url</code> from the completed response (a signed URL, valid for 30 minutes).</li>
        </ol>
        <p>Or skip polling entirely and register a <a href="#webhooks" className="underline" style={{ color: 'var(--accent)' }}>webhook</a> to get notified when the job finishes.</p>
      </Section>

      <Section title="Example: Merge PDF">
        <CodeBlock>{`curl -X POST https://corehives.com/api/v1/tools/merge \\
  -H "Authorization: Bearer chp_live_xxxxxxxxxxxxxxxxxxxxxxxx" \\
  -F "files[]=@first.pdf" \\
  -F "files[]=@second.pdf"

# => { "job_id": "0199f1a2-..." }

curl https://corehives.com/api/v1/jobs/0199f1a2-... \\
  -H "Authorization: Bearer chp_live_xxxxxxxxxxxxxxxxxxxxxxxx"

# => { "status": "completed", "download_url": "https://..." }`}</CodeBlock>
      </Section>

      <Section title="Tool options">
        <p>
          Tools that take extra settings (page ranges, watermark text, passwords, rotation degrees…) accept them as
          multipart fields prefixed with <code>options</code>, e.g. <code>options[pages]=1,3,5-7</code> or{' '}
          <code>options[text]=CONFIDENTIAL</code>. These match the same option names used by each tool's page on the
          website.
        </p>
      </Section>

      <Section title="Sign PDF (different shape)">
        <p>
          <code>POST /v1/tools/sign</code> is the one exception — it takes two separate files instead of a{' '}
          <code>files[]</code> array: a <code>pdf</code> field and a <code>signature</code> field (PNG/JPG), plus an
          optional <code>page</code> field (0 = last page, default).
        </p>
      </Section>

      <Section title="Available tools">
        <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                <th className="px-3 py-2 font-medium opacity-60">Endpoint</th>
                <th className="px-3 py-2 font-medium opacity-60">Tool</th>
              </tr>
            </thead>
            <tbody>
              {API_TOOLS.map((tool) => (
                <tr key={tool.slug} className="border-b last:border-0" style={{ borderColor: 'var(--border)' }}>
                  <td className="px-3 py-1.5 font-mono text-xs">
                    POST /v1/tools/{tool.slug}
                    {BESPOKE_ENDPOINTS.has(tool.slug) && <span className="ml-1 opacity-50">*</span>}
                  </td>
                  <td className="px-3 py-1.5 opacity-80">{tool.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs opacity-50">* See the note above — this endpoint's request shape differs from the rest.</p>
      </Section>

      <Section title="Errors">
        <ul className="list-disc space-y-1 pl-5">
          <li><code>401</code> — missing or invalid API key</li>
          <li><code>422</code> — invalid request (bad file type, missing required option)</li>
          <li><code>429</code> — you've used your monthly quota; <code>resets_at</code> tells you when it refills</li>
        </ul>
      </Section>

      <Section title="Webhooks">
        <p id="webhooks">
          Set a webhook URL on your key from the dashboard. When a job finishes, we <code>POST</code> to it:
        </p>
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
        <p>The same shape is sent with <code>"event": "task.failed"</code> and <code>download_url: null</code> if the job fails.</p>
      </Section>
    </div>
  )
}
