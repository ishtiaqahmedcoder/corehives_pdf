import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'

interface FileDropzoneProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  accept?: Record<string, string[]>
  multiple?: boolean
}

export function FileDropzone({
  files,
  onFilesChange,
  accept = { 'application/pdf': ['.pdf'] },
  multiple = true,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      onFilesChange(multiple ? [...files, ...accepted] : accepted)
    },
    [files, multiple, onFilesChange],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
  })

  function removeFile(index: number) {
    onFilesChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        style={{
          borderColor: isDragActive ? 'var(--accent)' : 'var(--border)',
          backgroundColor: isDragActive ? 'var(--accent-soft)' : 'var(--bg-soft)',
          transition: 'border-color 150ms, background-color 150ms',
        }}
        className="cursor-pointer rounded-2xl border-2 border-dashed px-6 py-14 text-center"
      >
        <input {...getInputProps()} />
        <motion.div
          animate={{ y: isDragActive ? -4 : 0, scale: isDragActive ? 1.05 : 1 }}
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: 'var(--accent-soft)' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7"
            style={{ color: 'var(--accent)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7 9m5-5l5 5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3" />
          </svg>
        </motion.div>
        <p className="font-medium" style={{ color: 'var(--text-h)' }}>
          {isDragActive ? 'Drop your PDFs here' : 'Drag & drop PDFs, or click to browse'}
        </p>
        <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
          Files never leave your control — auto-deleted 1 hour after processing
        </p>
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, i) => (
            <motion.li
              key={`${file.name}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between rounded-xl border px-4 py-2.5"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold"
                  style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
                >
                  {i + 1}
                </span>
                <span className="truncate text-sm" style={{ color: 'var(--text-h)' }}>
                  {file.name}
                </span>
                <span className="shrink-0 text-xs opacity-60">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="shrink-0 rounded-full px-2 py-1 text-xs opacity-60 hover:opacity-100"
                aria-label={`Remove ${file.name}`}
              >
                ✕
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
