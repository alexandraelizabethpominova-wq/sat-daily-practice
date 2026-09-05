import { useEffect, useRef, useState } from 'react'
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy, type RenderTask } from 'pdfjs-dist'

GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

// Cache the promise rather than only the finished PDF document. React Strict Mode
// can run effects twice in development; sharing the in-flight load avoids duplicate
// worker transfers for the same PDF.
const cache = new Map<string, Promise<PDFDocumentProxy>>()

function loadPdf(key: string, bytes: ArrayBuffer) {
  const cached = cache.get(key)
  if (cached) return cached

  // pdf.js may transfer the ArrayBuffer to its worker, which detaches it. Always
  // give pdf.js a copy so the IndexedDB/browser copy remains usable for later
  // renders and for React's development-mode effect re-runs.
  const copiedBytes = bytes.slice(0)
  const promise = getDocument({ data: new Uint8Array(copiedBytes) }).promise

  promise.catch(() => cache.delete(key))
  cache.set(key, promise)
  return promise
}

export default function PdfPage({
  pdfKey,
  bytes,
  page,
  label,
}: {
  pdfKey: string
  bytes: ArrayBuffer
  page: number
  label: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [error, setError] = useState('')
  const [zoom, setZoom] = useState(1.15)

  useEffect(() => {
    let cancelled = false
    let renderTask: RenderTask | null = null

    async function render() {
      try {
        setError('')
        const doc = await loadPdf(pdfKey, bytes)
        if (cancelled) return

        const pdfPage = await doc.getPage(page)
        if (cancelled) return

        const viewport = pdfPage.getViewport({ scale: zoom })
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Unable to create the PDF canvas.')

        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.floor(viewport.width * dpr)
        canvas.height = Math.floor(viewport.height * dpr)
        canvas.style.width = `${viewport.width}px`
        canvas.style.height = `${viewport.height}px`

        renderTask = pdfPage.render({
          canvasContext: ctx,
          viewport,
          transform: dpr === 1 ? undefined : [dpr, 0, 0, dpr, 0, 0],
        })

        await renderTask.promise
      } catch (e) {
        if (cancelled) return

        const message = e instanceof Error ? e.message : 'Unable to render PDF page.'
        // Cancelling an old render during a page/zoom change is expected.
        if (!message.toLowerCase().includes('cancel')) setError(message)
      }
    }

    render()

    return () => {
      cancelled = true
      renderTask?.cancel()
    }
  }, [pdfKey, bytes, page, zoom])

  return (
    <div className="pdf-panel">
      <div className="pdf-toolbar">
        <span>
          {label} · PDF page {page}
        </span>
        <div className="zoom-group">
          <button onClick={() => setZoom((z) => Math.max(0.75, z - 0.15))}>−</button>
          <span>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(2.2, z + 0.15))}>+</button>
        </div>
      </div>
      <div className="pdf-scroll">
        {error ? <div className="error-box">{error}</div> : <canvas ref={canvasRef} />}
      </div>
    </div>
  )
}
