import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export interface SignaturePadHandle {
  toBlob: () => Promise<Blob | null>
  isEmpty: () => boolean
}

interface SignaturePadProps {
  onChange?: (hasContent: boolean) => void
}

export function SignaturePad({ onChange, ref }: SignaturePadProps & { ref?: React.Ref<SignaturePadHandle> }) {
  const { t } = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const hasContent = useRef(false)
  const [, forceRender] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#1f2937'
  }, [])

  useImperativeHandle(ref, () => ({
    toBlob: () =>
      new Promise((resolve) => {
        canvasRef.current?.toBlob((blob) => resolve(blob), 'image/png')
      }),
    isEmpty: () => !hasContent.current,
  }))

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true
    const ctx = canvasRef.current?.getContext('2d')
    const { x, y } = getPos(e)
    ctx?.beginPath()
    ctx?.moveTo(x, y)
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const ctx = canvasRef.current?.getContext('2d')
    const { x, y } = getPos(e)
    ctx?.lineTo(x, y)
    ctx?.stroke()
    if (!hasContent.current) {
      hasContent.current = true
      onChange?.(true)
      forceRender((n) => n + 1)
    }
  }

  function end() {
    drawing.current = false
  }

  function clear() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
    hasContent.current = false
    onChange?.(false)
    forceRender((n) => n + 1)
  }

  return (
    <div>
      <div
        className="relative overflow-hidden rounded-2xl border-2 border-dashed"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-soft)' }}
      >
        <canvas
          ref={canvasRef}
          width={480}
          height={180}
          className="block w-full touch-none"
          style={{ height: 180 }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
        />
        {!hasContent.current && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm opacity-40">
            {t('common.signHere')}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        className="mt-2 rounded-full border px-3 py-1 text-xs"
        style={{ borderColor: 'var(--border)', color: 'var(--text-h)' }}
      >
        {t('common.clear')}
      </button>
    </div>
  )
}
