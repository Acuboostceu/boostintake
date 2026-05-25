import { useRef, useEffect, useState } from 'react'
import SignaturePadLib from 'signature_pad'
import { Button } from '../ui/Button'

export function SignaturePad({ label, onSave, onDecline, canDecline = false, existingDataUrl }) {
  const canvasRef = useRef(null)
  const padRef = useRef(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const [saved, setSaved] = useState(!!existingDataUrl)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    padRef.current = new SignaturePadLib(canvas, {
      backgroundColor: 'rgb(255,255,255)',
      penColor: '#1a1a2e',
      minWidth: 1.5,
      maxWidth: 3,
    })

    function resizeCanvas() {
      const ratio = Math.max(window.devicePixelRatio || 1, 1)
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      canvas.getContext('2d').scale(ratio, ratio)
      padRef.current.clear()
      setIsEmpty(true)
      setSaved(false)
    }

    resizeCanvas()

    if (existingDataUrl) {
      padRef.current.fromDataURL(existingDataUrl)
      setIsEmpty(false)
      setSaved(true)
    }

    padRef.current.addEventListener('endStroke', () => {
      if (!padRef.current.isEmpty()) {
        const dataUrl = padRef.current.toDataURL('image/png')
        onSave(dataUrl)
        setIsEmpty(false)
        setSaved(true)
      }
    })

    return () => { padRef.current?.off() }
  }, [])

  function handleClear() {
    padRef.current?.clear()
    setIsEmpty(true)
    setSaved(false)
    onSave(null)
  }

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <div>
          <p className="text-sm font-semibold text-gray-800">{label}</p>
          <p className="text-xs text-gray-500 mt-0.5">Sign in the box below using your finger or stylus — auto-saved when you lift your finger</p>
        </div>
      )}

      <div className="relative">
        <canvas
          ref={canvasRef}
          className={`w-full border-2 rounded-xl touch-none cursor-crosshair
            ${saved ? 'border-teal-400 bg-teal-50' : 'border-gray-300 bg-white'}`}
          style={{ height: 160 }}
        />
        {isEmpty && !saved && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-300 text-sm select-none">Sign here</span>
          </div>
        )}
        {saved && (
          <div className="absolute top-2 right-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Signed
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="secondary" size="sm" type="button" onClick={handleClear} disabled={isEmpty && !saved}>
          Clear
        </Button>
      </div>

      {canDecline && (
        <div className="border-t border-gray-100 pt-3 mt-1">
          <button
            type="button"
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors"
            onClick={onDecline}
          >
            I decline to sign this form
          </button>
        </div>
      )}
    </div>
  )
}
