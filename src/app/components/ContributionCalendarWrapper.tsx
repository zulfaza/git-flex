'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas-pro';

interface ContributionCalendarWrapperProps {
  contributions: number[][];
  squareSize?: number;
  orientation?: 'horizontal' | 'vertical';
}

const colorConfig = {
  themes: {
    light: {
      background: '#ffffff',
      text: '#1f2937',
      border: '#d1d5db',
      header: '#f9fafb',
      button: '#3b82f6',
      buttonHover: '#2563eb',
      buttonText: '#ffffff',
      input: '#d1d5db',
      inputBg: '#ffffff',
      inputText: '#1f2937',
    },
    dark: {
      background: '#111827',
      text: '#f3f4f6',
      border: '#374151',
      header: '#1f2937',
      button: '#2563eb',
      buttonHover: '#1d4ed8',
      buttonText: '#ffffff',
      input: '#374151',
      inputBg: '#1f2937',
      inputText: '#f3f4f6',
    },
    dracula: {
      background: '#282a36',
      text: '#f8f8f2',
      border: '#6272a4',
      header: '#44475a',
      button: '#50fa7b',
      buttonHover: '#3fa66a',
      buttonText: '#282a36',
      input: '#6272a4',
      inputBg: '#44475a',
      inputText: '#f8f8f2',
    },
    monokai: {
      background: '#272822',
      text: '#f8f8f2',
      border: '#49483e',
      header: '#3e3d32',
      button: '#a6e22e',
      buttonHover: '#8bc21d',
      buttonText: '#272822',
      input: '#49483e',
      inputBg: '#3e3d32',
      inputText: '#f8f8f2',
    },
    'github-dark': {
      background: '#0d1117',
      text: '#c9d1d9',
      border: '#21262d',
      header: '#161b22',
      button: '#238636',
      buttonHover: '#2ea043',
      buttonText: '#ffffff',
      input: '#21262d',
      inputBg: '#161b22',
      inputText: '#c9d1d9',
    },
  },
  contributionColors: {
    light: ['#f3f4f6', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80'],
    dark: ['#1f2937', '#14532d', '#166534', '#15803d', '#16a34a'],
    dracula: ['#6272a4', '#50fa7b', '#f1fa8c', '#ffb86c', '#ff5555'],
    monokai: ['#49483e', '#a6e22e', '#f92672', '#fd971f', '#ae81ff'],
    'github-dark': ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  },
  backgrounds: {
    solid: '#f8fafc',
    'gradient-blue': '#e0f2fe',
    'gradient-purple': '#f3e8ff',
    'gradient-green': '#dcfce7',
    'gradient-orange': '#fff7ed',
    mesh: '#f8fafc',
    dots: '#f8fafc',
  },
  backgroundClasses: {
    solid: 'bg-gradient-to-br from-gray-100 to-gray-200',
    'gradient-blue': 'bg-gradient-to-br from-blue-50 to-indigo-100',
    'gradient-purple': 'bg-gradient-to-br from-purple-50 to-pink-100',
    'gradient-green': 'bg-gradient-to-br from-green-50 to-emerald-100',
    'gradient-orange': 'bg-gradient-to-br from-orange-50 to-red-100',
    mesh: 'bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] bg-[length:20px_20px]',
    dots: 'bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:24px_24px]',
  },
};

export default function ContributionCalendarWrapper({
  contributions,
  squareSize = 12,
  orientation: initialOrientation = 'horizontal',
}: ContributionCalendarWrapperProps) {
  const [currentTheme, setCurrentTheme] =
    useState<keyof typeof colorConfig.themes>('github-dark');
  const [currentBackground, setCurrentBackground] =
    useState<keyof typeof colorConfig.backgrounds>('solid');
  const [exportFormat, setExportFormat] = useState<'png' | 'svg'>('png');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
    initialOrientation
  );
  const [padding, setPadding] = useState(32);
  const [borderRadius, setBorderRadius] = useState(16);
  const [showWindowControls, setShowWindowControls] = useState(true);
  const calendarRef = useRef<HTMLDivElement>(null);

  const theme = colorConfig.themes[currentTheme];
  const background = colorConfig.backgroundClasses[currentBackground];

  // Color mapping based on contribution level (0-4)
  const getColor = (level: number) => {
    return colorConfig.contributionColors[currentTheme][level] || colorConfig.contributionColors[currentTheme][0];
  };

  const getBackgroundColor = () => {
    return colorConfig.backgrounds[currentBackground] || '#f8fafc';
  };

  const createSVGFromCanvas = (canvas: HTMLCanvasElement): string => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    const width = canvas.width;
    const height = canvas.height;

    svg.setAttribute('width', width.toString());
    svg.setAttribute('height', height.toString());
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // Create image element
    const image = document.createElementNS(svgNS, 'image');
    image.setAttribute('width', width.toString());
    image.setAttribute('height', height.toString());
    image.setAttribute('href', canvas.toDataURL('image/png'));

    svg.appendChild(image);
    return svg.outerHTML;
  };

  const exportCalendar = async () => {
    if (!calendarRef.current) return;

    try {
      // Show loading state
      const exportBtn = document.querySelector(
        '[data-export-btn]'
      ) as HTMLButtonElement;
      if (exportBtn) {
        exportBtn.textContent = 'Exporting...';
        exportBtn.disabled = true;
      }

      // Use html2canvas with safer settings to create the canvas
      const canvas = await html2canvas(calendarRef.current, {
        backgroundColor: getBackgroundColor(),
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
      });

      // Create download link
      if (exportFormat === 'png') {
        const dataUrl = canvas.toDataURL('image/png', 1.0);
        const link = document.createElement('a');
        link.download = `contribution-calendar-${Date.now()}.png`;
        link.href = dataUrl;
        link.click();
      } else {
        // For SVG, create a simple SVG representation
        const svgData = createSVGFromCanvas(canvas);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `contribution-calendar-${Date.now()}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }

      // Reset button state
      if (exportBtn) {
        exportBtn.textContent = `Export ${exportFormat.toUpperCase()}`;
        exportBtn.disabled = false;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');

      // Reset button state on error
      const exportBtn = document.querySelector(
        '[data-export-btn]'
      ) as HTMLButtonElement;
      if (exportBtn) {
        exportBtn.textContent = `Export ${exportFormat.toUpperCase()}`;
        exportBtn.disabled = false;
      }
    }
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Transpose data for vertical orientation
  const getGridData = () => {
    if (orientation === 'horizontal') return contributions;
    return contributions[0].map((_, colIndex) =>
      contributions.map((row) => row[colIndex])
    );
  };

  const getColSpanForTopLabel = (index: number, arrayLength: number) => {
    if (orientation === 'horizontal') {
      return 2;
    }
    if (orientation === 'vertical' && index !== arrayLength - 1) {
      return 3;
    }
    return 1;
  };

  const gridData = getGridData();
  const gridCols = orientation === 'horizontal' ? 53 : 7;
  const gridRows = orientation === 'horizontal' ? 7 : 53;

  return (
    <div className={`min-h-screen p-4 ${background}`}>
      {/* Header */}
      <div
        className="p-4 print:hidden rounded-t-lg border"
        style={{
          backgroundColor: theme.header,
          color: theme.text,
          borderColor: theme.border,
        }}
      >
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-bold'>GitHub Contribution Calendar</h1>
          <div className='flex items-center gap-2'>
            <button
              onClick={exportCalendar}
              data-export-btn
              className="px-3 py-1 rounded text-sm"
              style={{
                backgroundColor: theme.button,
                color: theme.buttonText,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.buttonHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.button;
              }}
            >
              Export {exportFormat.toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div
        className="print:hidden p-4 border-l border-r border-b rounded-b-lg mb-6"
        style={{
          backgroundColor: theme.background,
          color: theme.text,
          borderColor: theme.border,
        }}
      >
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          {/* Theme Selection */}
          <div>
            <label className='block text-sm font-medium mb-2'>Theme</label>
            <select
              value={currentTheme}
              onChange={(e) =>
                setCurrentTheme(e.target.value as keyof typeof colorConfig.themes)
              }
              className='w-full p-2 rounded border'
              style={{
                backgroundColor: theme.inputBg,
                color: theme.inputText,
                borderColor: theme.input,
              }}
            >
              {Object.keys(colorConfig.themes).map((themeKey) => (
                <option key={themeKey} value={themeKey}>
                  {themeKey.charAt(0).toUpperCase() +
                    themeKey.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Background Selection */}
          <div>
            <label className='block text-sm font-medium mb-2'>
              Background
            </label>
            <select
              value={currentBackground}
              onChange={(e) =>
                setCurrentBackground(e.target.value as keyof typeof colorConfig.backgrounds)
              }
              className='w-full p-2 rounded border'
              style={{
                backgroundColor: theme.inputBg,
                color: theme.inputText,
                borderColor: theme.input,
              }}
            >
              {Object.keys(colorConfig.backgrounds).map((bgKey) => (
                <option key={bgKey} value={bgKey}>
                  {bgKey.charAt(0).toUpperCase() +
                    bgKey.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Orientation Selection */}
          <div>
            <label className='block text-sm font-medium mb-2'>
              Orientation
            </label>
            <select
              value={orientation}
              onChange={(e) =>
                setOrientation(e.target.value as 'horizontal' | 'vertical')
              }
              className='w-full p-2 rounded border'
              style={{
                backgroundColor: theme.inputBg,
                color: theme.inputText,
                borderColor: theme.input,
              }}
            >
              <option value='horizontal'>Horizontal</option>
              <option value='vertical'>Vertical</option>
            </select>
          </div>

          {/* Export Format */}
          <div>
            <label className='block text-sm font-medium mb-2'>
              Export Format
            </label>
            <select
              value={exportFormat}
              onChange={(e) =>
                setExportFormat(e.target.value as 'png' | 'svg')
              }
              className='w-full p-2 rounded border'
              style={{
                backgroundColor: theme.inputBg,
                color: theme.inputText,
                borderColor: theme.input,
              }}
            >
              <option value='png'>PNG</option>
              <option value='svg'>SVG</option>
            </select>
          </div>
        </div>

        {/* Advanced Controls */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t' style={{ borderColor: theme.border }}>
          {/* Padding Control */}
          <div>
            <label className='block text-sm font-medium mb-2'>
              Padding: {padding}px
            </label>
            <input
              type='range'
              min='16'
              max='64'
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className='w-full'
            />
          </div>

          {/* Border Radius Control */}
          <div>
            <label className='block text-sm font-medium mb-2'>
              Border Radius: {borderRadius}px
            </label>
            <input
              type='range'
              min='0'
              max='32'
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className='w-full'
            />
          </div>

          {/* Window Controls Toggle */}
          <div>
            <label className='flex items-center'>
              <input
                type='checkbox'
                checked={showWindowControls}
                onChange={(e) => setShowWindowControls(e.target.checked)}
                className='mr-2'
              />
              <span className='text-sm font-medium'>
                Show Window Controls
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Calendar Container */}
      <div className='flex justify-center'>
        <div
          ref={calendarRef}
          className="relative overflow-hidden shadow-2xl"
          style={{
            backgroundColor: theme.background,
            color: theme.text,
            padding: `${padding}px`,
            borderRadius: `${borderRadius}px`,
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
          }}
        >
          {/* Window Controls */}
          {showWindowControls && (
            <div className='absolute top-4 left-4 flex items-center space-x-2'>
              <div className='w-3 h-3 rounded-full bg-red-500'></div>
              <div className='w-3 h-3 rounded-full bg-yellow-500'></div>
              <div className='w-3 h-3 rounded-full bg-green-500'></div>
            </div>
          )}

          {/* Calendar Title */}
          <div className='text-center mb-6 mt-6'>
            <h2 className='text-lg font-semibold'>Contribution Activity</h2>
          </div>

          {/* Calendar Grid */}
          <div className='flex items-center justify-center'>
            <div className='flex flex-col w-fit rounded-lg p-4'>
              <div className='flex min-w-fit w-full'>
                {/* Side labels */}
                <div
                  className="flex flex-col justify-between mr-3 text-xs opacity-70 font-mono"
                  style={{ color: theme.text }}
                >
                  {(orientation === 'horizontal' ? weekdays : months).map(
                    (label, index) => (
                      <div
                        key={label}
                        className='flex items-center justify-end pr-2'
                        style={{
                          marginBottom: '2px',
                          height: `${squareSize}px`,
                        }}
                      >
                        {index % (orientation === 'horizontal' ? 2 : 1) === 0 &&
                          label}
                      </div>
                    )
                  )}
                </div>

                {/* Contribution grid */}
                <div
                  className='grid gap-1 relative'
                  style={{
                    gridTemplateColumns: `repeat(${gridCols}, ${squareSize}px)`,
                    gridTemplateRows: `repeat(${gridRows}, ${squareSize}px)`,
                    borderRadius: '8px',
                  }}
                >
                  {/* Top labels */}
                  <div className='absolute -top-6 w-full'>
                    <div
                      className='grid mb-2 text-xs opacity-70'
                      style={{
                        color: theme.text,
                        gridTemplateColumns:
                          orientation === 'horizontal'
                            ? 'repeat(12, minmax(0, 1fr))'
                            : 'repeat(8, minmax(0, 1fr))',
                      }}
                    >
                      {(orientation === 'horizontal' ? months : weekdays).map(
                        (label, index, array) =>
                          (orientation === 'horizontal' && index % 2 === 0) ||
                          (orientation === 'vertical' && index % 3 === 0) ? (
                            <div
                              key={label}
                              className='text-left'
                              style={{
                                gridColumn: `span ${getColSpanForTopLabel(
                                  index,
                                  array.length
                                )} / span ${getColSpanForTopLabel(
                                  index,
                                  array.length
                                )}`,
                              }}
                            >
                              {label}
                            </div>
                          ) : null
                      )}
                    </div>
                  </div>
                  {gridData.map((row, rowIndex) =>
                    row.map((level, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className="transition-all duration-300 hover:scale-125 w-full"
                        title={`${level} contributions`}
                        style={{
                          backgroundColor: getColor(level),
                          borderRadius: '4px',
                          WebkitPrintColorAdjust: 'exact',
                          printColorAdjust: 'exact',
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className='flex items-center justify-center mt-8 text-sm font-mono'>
            <span className='mr-3 opacity-60 text-xs'>Less</span>
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className="w-4 h-4 rounded-sm mr-2 border border-white/30 dark:border-gray-600/50 transition-transform hover:scale-110"
                style={{
                  backgroundColor: getColor(level),
                }}
              />
            ))}
            <span className='ml-1 opacity-60 text-xs'>More</span>
          </div>

          {/* Footer */}
          <div className='text-center mt-6 text-xs opacity-40 font-mono'>
            Generated with GitFlex
          </div>
        </div>
      </div>
    </div>
  );
}