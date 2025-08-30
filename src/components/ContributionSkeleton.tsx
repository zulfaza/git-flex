interface ContributionSkeletonProps {
  squareSize: number
  orientation: 'horizontal' | 'vertical'
  padding: number
  borderRadius: number
}

export default function ContributionSkeleton({
  squareSize,
  orientation,
  padding,
  borderRadius
}: ContributionSkeletonProps) {
  const gridCols = orientation === 'horizontal' ? 53 : 7
  const gridRows = orientation === 'horizontal' ? 7 : 53
  
  return (
    <div 
      className="bg-gray-800 rounded-lg border border-gray-700 animate-pulse"
      style={{ 
        padding: `${padding}px`,
        borderRadius: `${borderRadius}px`
      }}
    >
      <div className="mb-4">
        <div className="h-6 bg-gray-700 rounded w-64 mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-48"></div>
      </div>
      
      <div className="flex flex-col gap-1">
        {Array.from({ length: gridRows }, (_, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {Array.from({ length: gridCols }, (_, colIndex) => (
              <div
                key={colIndex}
                className="bg-gray-700 rounded-sm animate-pulse"
                style={{
                  width: `${squareSize}px`,
                  height: `${squareSize}px`,
                  borderRadius: `${borderRadius}px`
                }}
              />
            ))}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 bg-gray-700 rounded w-24"></div>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="bg-gray-700 rounded-sm"
              style={{
                width: `${squareSize}px`,
                height: `${squareSize}px`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}