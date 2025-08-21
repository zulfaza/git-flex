'use client';

import { useState } from 'react';

const contributions = [
  [
    4, 2, 1, 2, 0, 1, 2, 3, 3, 4, 1, 0, 1, 2, 4, 0, 4, 1, 4, 4, 1, 4, 1, 3, 2,
    4, 2, 1, 1, 0, 4, 4, 4, 4, 4, 3, 0, 4, 1, 4, 0, 1, 4, 0, 3, 0, 0, 2, 0, 1,
    1, 3, 2,
  ],
  [
    2, 3, 3, 0, 1, 3, 4, 0, 3, 3, 3, 2, 1, 0, 3, 2, 0, 2, 1, 0, 1, 1, 0, 1, 0,
    4, 0, 2, 1, 4, 0, 4, 0, 2, 4, 3, 1, 2, 1, 2, 4, 1, 3, 1, 3, 4, 1, 0, 1, 1,
    0, 2, 4,
  ],
  [
    3, 0, 3, 2, 0, 0, 0, 2, 0, 3, 0, 3, 0, 3, 4, 3, 4, 0, 3, 2, 4, 0, 2, 2, 2,
    0, 3, 3, 2, 0, 3, 1, 0, 0, 0, 4, 1, 4, 2, 1, 1, 2, 0, 2, 0, 0, 3, 1, 2, 3,
    0, 0, 1,
  ],
  [
    1, 1, 2, 4, 4, 2, 0, 1, 4, 4, 1, 3, 4, 0, 4, 0, 3, 4, 0, 2, 0, 2, 0, 0, 0,
    1, 3, 3, 2, 1, 1, 0, 4, 0, 2, 0, 2, 2, 1, 0, 4, 0, 3, 4, 0, 0, 0, 0, 3, 2,
    3, 0, 4,
  ],
  [
    2, 2, 3, 4, 4, 2, 3, 2, 4, 4, 2, 2, 1, 1, 4, 3, 3, 3, 2, 2, 1, 3, 0, 0, 0,
    4, 0, 3, 3, 4, 4, 1, 0, 3, 2, 1, 0, 1, 4, 4, 2, 2, 4, 1, 3, 2, 2, 4, 4, 0,
    1, 2, 2,
  ],
  [
    0, 4, 3, 3, 0, 3, 1, 3, 4, 0, 0, 1, 2, 2, 0, 2, 3, 0, 4, 2, 2, 1, 1, 4, 4,
    3, 3, 1, 1, 0, 2, 4, 3, 0, 3, 0, 4, 1, 3, 4, 1, 1, 1, 1, 3, 2, 2, 2, 1, 4,
    2, 0, 4,
  ],
  [
    0, 1, 0, 2, 2, 2, 0, 0, 1, 1, 2, 4, 1, 1, 4, 1, 1, 0, 2, 2, 3, 3, 3, 0, 0,
    0, 0, 4, 4, 3, 0, 2, 2, 1, 0, 0, 0, 1, 0, 2, 2, 1, 1, 4, 0, 3, 2, 1, 2, 0,
    3, 1, 4,
  ],
];

export default function Home() {
  // State for controls
  const [squareSize, setSquareSize] = useState(12); // Size in pixels
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>(
    'horizontal'
  );

  // Color mapping based on contribution level (0-4)
  const getColor = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-gray-100 dark:bg-gray-800';
      case 1:
        return 'bg-green-100 dark:bg-green-900';
      case 2:
        return 'bg-green-200 dark:bg-green-800';
      case 3:
        return 'bg-green-300 dark:bg-green-700';
      case 4:
        return 'bg-green-400 dark:bg-green-600';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
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
    <div className='font-sans min-h-screen p-8 pb-20 sm:p-20 flex items-center justify-center'>
      <div className='max-w-6xl w-full'>
        <h1 className='text-2xl font-bold mb-8 text-center'>
          Contribution Calendar
        </h1>

        {/* Controls */}
        <div className='mb-16 flex flex-col sm:flex-row items-center justify-center gap-4'>
          <div className='flex items-center gap-2'>
            <label htmlFor='size-slider' className='text-sm'>
              Square Size:
            </label>
            <input
              id='size-slider'
              type='range'
              min='8'
              max='20'
              value={squareSize}
              onChange={(e) => setSquareSize(Number(e.target.value))}
              className='w-24'
            />
            <span className='text-sm'>{squareSize}px</span>
          </div>
          <button
            onClick={() =>
              setOrientation(
                orientation === 'horizontal' ? 'vertical' : 'horizontal'
              )
            }
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
          >
            {orientation === 'horizontal'
              ? 'Switch to Vertical'
              : 'Switch to Horizontal'}
          </button>
        </div>

        <div className='flex items-center justify-center'>
          <div className='flex flex-col w-fit'>
            <div className='flex min-w-fit w-full'>
              {/* Side labels */}
              <div className='flex flex-col justify-between mr-2 text-xs text-gray-500'>
                {(orientation === 'horizontal' ? weekdays : months).map(
                  (label, index) => (
                    <div
                      key={label}
                      className='flex items-center justify-end pr-1'
                      style={{
                        marginBottom: '1px',
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
                }}
              >
                {/* Top labels */}
                <div className='absolute -top-6 w-full'>
                  <div
                    className='grid mb-2 text-xs text-gray-500 '
                    style={{
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
                      className={`rounded-sm ${getColor(level)}`}
                      title={`${level} contributions`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className='flex items-center justify-center mt-4 text-sm'>
          <span className='mr-2'>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm mr-1 ${getColor(level)}`}
            />
          ))}
          <span className='ml-2'>More</span>
        </div>
      </div>
    </div>
  );
}
