"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import type { HSVA, RGBA } from "../lib/colorUtils";
import {
  hexToRgba,
  rgbaToHex,
  rgbaToHsva,
  hsvaToRgba,
  parseInputHex,
} from "../lib/colorUtils";

interface ColorPickerProps {
  value: string;
  onChange: (hex: string) => void;
  initialAlpha?: number;
  className?: string;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

export default function ColorPicker({
  value,
  onChange,
  initialAlpha = 1,
  className = "",
}: ColorPickerProps) {
  const rgba = hexToRgba(value);
  const initialHsva = rgbaToHsva({ ...rgba, a: initialAlpha });

  const [hsva, setHsva] = useState<HSVA>(initialHsva);
  const [hexInput, setHexInput] = useState(value);
  const [alpha, setAlpha] = useState(initialAlpha);

  useEffect(() => {
    setHexInput(value);
    const nr = hexToRgba(value);
    const nh = rgbaToHsva(nr);
    setHsva((prev) => ({ ...prev, h: nh.h, s: nh.s, v: nh.v }));
  }, [value]);

  const updateColor = useCallback(
    (next: HSVA, nextAlpha: number = alpha) => {
      const newRgba: RGBA = hsvaToRgba({ ...next, a: nextAlpha });
      const hex = rgbaToHex(newRgba);
      setHsva(next);
      setAlpha(nextAlpha);
      setHexInput(hex);
      onChange(hex);
    },
    [alpha, onChange],
  );

  const satValRef = useRef<HTMLDivElement>(null);

  const handleSVPointer = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const target = satValRef.current;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const clientX =
        "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY =
        "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      const s = clamp((clientX - rect.left) / rect.width, 0, 1);
      const v = clamp(1 - (clientY - rect.top) / rect.height, 0, 1);
      updateColor({ ...hsva, s, v });
    },
    [hsva, updateColor],
  );

  const startSVDrag = (e: React.MouseEvent | React.TouchEvent) => {
    handleSVPointer(e);
    const move = (ev: MouseEvent | TouchEvent) => {
      const isTouch = (ev as TouchEvent).touches !== undefined;
      if (isTouch) {
        const touch = (ev as TouchEvent).touches[0];
        handleSVPointer({
          touches: [touch],
        } as unknown as React.TouchEvent);
      } else {
        handleSVPointer(ev as unknown as React.MouseEvent);
      }
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = Number(e.target.value);
    updateColor({ ...hsva, h });
  };

  const handleHexBlur = () => {
    const parsed = parseInputHex(hexInput, value);
    setHexInput(parsed);
    if (parsed !== value) onChange(parsed);
  };

  const pointerX = hsva.s * 100;
  const pointerY = (1 - hsva.v) * 100;

  const hueGradient =
    "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)";
  const { r, g, b } = hsvaToRgba({ ...hsva, a: 1 });
  const baseColor = `rgb(${r}, ${g}, ${b})`;
  const svBackground = `linear-gradient(to top, black, transparent), linear-gradient(to right, white, hsl(${hsva.h},100%,50%))`;

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
            style={{
              left: `${pointerX}%`,
              top: `${pointerY}%`,
              background: baseColor,
            }}
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

        {/* Inputs */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block mb-1">Hex</label>
            <div className="flex items-center gap-1">
              <input
                value={hexInput}
                onChange={(e) =>
                  setHexInput(
                    e.target.value.startsWith("#")
                      ? e.target.value
                      : "#" + e.target.value,
                  )
                }
                onBlur={handleHexBlur}
                className="flex-1 px-2 py-1 rounded border border-gray-600 bg-gray-700 text-white font-mono text-[11px]"
                maxLength={7}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
