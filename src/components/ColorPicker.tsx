"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import type { HSVA, RGBA } from '../lib/colorUtils'
import { hexToRgba, rgbaToHex, rgbaToHsva, hsvaToRgba, hsvaToHsla, parseInputHex, getContrastingText } from '../lib/colorUtils'

interface ColorPickerProps {
  value: string
  onChange: (hex: string) => void
  initialAlpha?: number
  className?: string
}

interface SavedColor { hex: string }

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export default function ColorPicker({ value, onChange, initialAlpha = 1, className = '' }: ColorPickerProps) {
  const rgba = hexToRgba(value)
  const initialHsva = rgbaToHsva({ ...rgba, a: initialAlpha })

  const [hsva, setHsva] = useState<HSVA>(initialHsva)
  const [hexInput, setHexInput] = useState(value)
  const [alpha, setAlpha] = useState(initialAlpha)
  const [saved, setSaved] = useState<SavedColor[]>([])

  useEffect(() => {
    setHexInput(value)
    const nr = hexToRgba(value)
    const nh = rgbaToHsva(nr)
    setHsva(prev => ({ ...prev, h: nh.h, s: nh.s, v: nh.v }))
  }, [value])

  const updateColor = useCallback((next: HSVA, nextAlpha: number = alpha) => {
    const newRgba: RGBA = hsvaToRgba({ ...next, a: nextAlpha })
    const hex = rgbaToHex(newRgba)
    setHsva(next)
    setAlpha(nextAlpha)
    setHexInput(hex)
    onChange(hex)
  }, [alpha, onChange])

  const satValRef = useRef<HTMLDivElement>(null)

  const handleSVPointer = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const target = satValRef.current
    if (!target) return
    const rect = target.getBoundingClientRect()
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY
    const s = clamp((clientX - rect.left) / rect.width, 0, 1)
    const v = clamp(1 - (clientY - rect.top) / rect.height, 0, 1)
    updateColor({ ...hsva, s, v })
  }, [hsva, updateColor])

  const startSVDrag = (e: React.MouseEvent | React.TouchEvent) => {
    handleSVPointer(e)
    const move = (ev: MouseEvent | TouchEvent) => {
      const isTouch = (ev as TouchEvent).touches !== undefined
      if (isTouch) {
        const touch = (ev as TouchEvent).touches[0]
        handleSVPointer({
          touches: [touch]
        } as unknown as React.TouchEvent)
      } else {
        handleSVPointer(ev as unknown as React.MouseEvent)
      }
    }
    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchend', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('touchmove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchend', up)
  }

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = Number(e.target.value)
    updateColor({ ...hsva, h })
  }

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = clamp(Number(e.target.value), 0, 1)
    setAlpha(a)
  }

  useEffect(() => {
    // reflect alpha only in preview (hex stored remains opaque)
  }, [alpha])

  const commitAlpha = () => {
    updateColor(hsva, alpha)
  }

  const handleHexBlur = () => {
    const parsed = parseInputHex(hexInput, value)
    setHexInput(parsed)
    if (parsed !== value) onChange(parsed)
  }

  const hsla = hsvaToHsla({ ...hsva, a: alpha })
  const displayRgba = hsvaToRgba({ ...hsva, a: alpha })
  const displayHex = rgbaToHex(displayRgba)

  const addSaved = () => {
    setSaved(prev => prev.some(c => c.hex === displayHex) ? prev : [...prev, { hex: displayHex }])
  }

  const copyHex = async () => {
    try { await navigator.clipboard.writeText(displayHex) } catch {}
  }

  const pointerX = hsva.s * 100
  const pointerY = (1 - hsva.v) * 100

  const hueGradient = 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
  const { r, g, b } = hsvaToRgba({ ...hsva, a: 1 })
  const baseColor = `rgb(${r}, ${g}, ${b})`
  const svBackground = `linear-gradient(to top, black, transparent), linear-gradient(to right, white, hsl(${hsva.h},100%,50%))`

  const contrast = getContrastingText(displayHex)

  return (
    <div className={`text-xs select-none ${className}`}>
      <div className="flex flex-col gap-3">
        {/* Saturation / Brightness Square */}
        <div
          ref={satValRef}
          onMouseDown={startSVDrag}
          onTouchStart={startSVDrag}
          className="relative w-full aspect-square rounded-md cursor-crosshair overflow-hidden border border-gray-600"
          style={{ backgroundImage: svBackground }}
        >
          <div
            className="absolute w-3 h-3 rounded-full border border-white shadow -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pointerX}%`, top: `${pointerY}%`, background: baseColor }}
          />
        </div>

        {/* Hue Slider */}
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={360}
            value={Math.round(hsva.h)}
            onChange={handleHueChange}
            className="flex-1 h-3 appearance-none bg-transparent cursor-pointer"
            style={{ background: hueGradient }}
          />
          <span className="w-10 text-center">Hue</span>
        </div>

        {/* Alpha Slider */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-3 relative rounded overflow-hidden">
            <div className="absolute inset-0 bg-[length:8px_8px] opacity-70" style={{ backgroundImage: 'linear-gradient(45deg,#444 25%,transparent 25%),linear-gradient(-45deg,#444 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#444 75%),linear-gradient(-45deg,transparent 75%,#444 75%)', backgroundSize: '8px 8px', backgroundPosition: '0 0,0 4px,4px -4px,-4px 0' }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, rgba(${r},${g},${b},0), rgba(${r},${g},${b},1))` }} />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={alpha}
              onChange={handleAlphaChange}
              onMouseUp={commitAlpha}
              onTouchEnd={commitAlpha}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `${alpha * 100}%` }}>
              <div className="w-3 h-3 rounded-full border border-white shadow -translate-x-1/2" style={{ background: `rgba(${r},${g},${b},${alpha})` }} />
            </div>
          </div>
          <span className="w-10 text-center">A</span>
        </div>

        {/* Inputs */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-1">Hex</label>
            <div className="flex items-center gap-1">
              <input
                value={hexInput}
                onChange={e => setHexInput(e.target.value.startsWith('#') ? e.target.value : '#' + e.target.value)}
                onBlur={handleHexBlur}
                className="flex-1 px-2 py-1 rounded border border-gray-600 bg-gray-700 text-white font-mono text-[11px]"
                maxLength={7}
              />
              <button onClick={copyHex} className="px-2 py-1 rounded border border-gray-600 bg-gray-700 hover:bg-gray-600">Copy</button>
            </div>
          </div>
          <div className="w-20">
            <label className="block mb-1">Opacity</label>
            <input
              type="number"
              min={0}
              max={100}
              value={Math.round(alpha * 100)}
              onChange={e => { const v = clamp(Number(e.target.value)/100,0,1); setAlpha(v) }}
              onBlur={commitAlpha}
              className="w-full px-2 py-1 rounded border border-gray-600 bg-gray-700 text-white text-[11px]"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded border border-gray-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-[length:8px_8px]" style={{ backgroundImage: 'linear-gradient(45deg,#444 25%,transparent 25%),linear-gradient(-45deg,#444 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#444 75%),linear-gradient(-45deg,transparent 75%,#444 75%)', backgroundSize: '8px 8px', backgroundPosition: '0 0,0 4px,4px -4px,-4px 0' }} />
            <div className="absolute inset-0" style={{ background: `rgba(${displayRgba.r},${displayRgba.g},${displayRgba.b},${alpha})` }} />
          </div>
          <div className="flex flex-col text-[11px] font-mono">
            <span>{displayHex}</span>
            <span>{`rgba(${displayRgba.r},${displayRgba.g},${displayRgba.b},${alpha.toFixed(2)})`}</span>
            <span>{`hsla(${Math.round(hsla.h)},${Math.round(hsla.s*100)}%,${Math.round(hsla.l*100)}%,${alpha.toFixed(2)})`}</span>
          </div>
        </div>

        {/* Saved colors */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wide text-gray-400">Saved</span>
            <button onClick={addSaved} className="px-2 py-1 text-[11px] rounded bg-gray-700 border border-gray-600 hover:bg-gray-600">+ Add</button>
          </div>
          {saved.length === 0 && <div className="text-[11px] text-gray-500">None yet</div>}
          <div className="flex flex-wrap gap-2">
            {saved.map(s => (
              <button key={s.hex} onClick={() => onChange(s.hex)} className="w-7 h-7 rounded-full border border-gray-600 flex items-center justify-center" style={{ background: s.hex, color: getContrastingText(s.hex) }} title={s.hex}>
                {value === s.hex ? '✓' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 text-[10px] px-2 py-1 rounded" style={{ background: displayHex, color: contrast }}>Current</div>
      </div>
    </div>
  )
}
