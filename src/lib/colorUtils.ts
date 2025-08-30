// Basic color conversion utilities (hex, rgb, hsl, hsv, etc.)
// No external deps

export interface RGBA { r: number; g: number; b: number; a: number }
export interface HSVA { h: number; s: number; v: number; a: number }
export interface HSLA { h: number; s: number; l: number; a: number }

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v))

export const hexToRgba = (hex: string): RGBA => {
  let h = hex.replace('#', '').trim()
  if (h.length === 3) {
    h = h.split('').map(c => c + c).join('')
  }
  if (h.length === 6) h = h + 'ff'
  if (h.length === 8) {
    const bigint = parseInt(h, 16)
    const r = (bigint >> 24) & 255
    const g = (bigint >> 16) & 255
    const b = (bigint >> 8) & 255
    const a = bigint & 255
    return { r, g, b, a: +(a / 255).toFixed(3) }
  }
  return { r: 0, g: 0, b: 0, a: 1 }
}

export const rgbaToHex = ({ r, g, b }: RGBA, includeAlpha = false, a = 1) => {
  const toHex = (n: number) => n.toString(16).padStart(2, '0')
  const base = `#${toHex(r)}${toHex(g)}${toHex(b)}`
  if (!includeAlpha) return base
  return base + toHex(Math.round(clamp(a) * 255))
}

export const rgbaToHsva = ({ r, g, b, a }: RGBA): HSVA => {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const d = max - min
  let h = 0
  if (d !== 0) {
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)); break
      case gn: h = ((bn - rn) / d + 2); break
      case bn: h = ((rn - gn) / d + 4); break
    }
    h /= 6
  }
  const s = max === 0 ? 0 : d / max
  const v = max
  return { h: h * 360, s, v, a }
}

export const hsvaToRgba = ({ h, s, v, a }: HSVA): RGBA => {
  const H = (h % 360 + 360) % 360 / 60
  const i = Math.floor(H)
  const f = H - i
  const p = v * (1 - s)
  const q = v * (1 - f * s)
  const t = v * (1 - (1 - f) * s)
  let r = 0, g = 0, b = 0
  switch (i) {
    case 0: r = v; g = t; b = p; break
    case 1: r = q; g = v; b = p; break
    case 2: r = p; g = v; b = t; break
    case 3: r = p; g = q; b = v; break
    case 4: r = t; g = p; b = v; break
    default: r = v; g = p; b = q; break
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255), a }
}

export const hsvaToHsla = ({ h, s, v, a }: HSVA): HSLA => {
  const l = v * (1 - s / 2)
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l)
  return { h, s: sl, l, a }
}

export const formatHex = (hex: string) => {
  const m = hex.trim().replace(/[^0-9a-fA-F]/g, '')
  if (m.length === 3 || m.length === 6) return '#' + m.toLowerCase()
  if (m.length === 8) return '#' + m.toLowerCase().slice(0, 6)
  return '#000000'
}

export const parseInputHex = (value: string, fallback: string) => {
  const cleaned = value.trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(cleaned) || /^[0-9a-fA-F]{6}$/.test(cleaned)) return '#' + cleaned.toLowerCase()
  return fallback
}

export const getContrastingText = (hex: string) => {
  const { r, g, b } = hexToRgba(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b)/255
  return luminance > 0.5 ? '#111827' : '#f9fafb'
}
