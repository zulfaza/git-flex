export default function Home() {
  // Mock data for contributions: 7 days x 53 weeks
  const contributions = Array.from({ length: 7 }, () =>
    Array.from({ length: 53 }, () => Math.floor(Math.random() * 5))
  );

  // Color mapping based on contribution level (0-4)
  const getColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100 dark:bg-gray-800';
      case 1: return 'bg-green-100 dark:bg-green-900';
      case 2: return 'bg-green-200 dark:bg-green-800';
      case 3: return 'bg-green-300 dark:bg-green-700';
      case 4: return 'bg-green-400 dark:bg-green-600';
      default: return 'bg-gray-100 dark:bg-gray-800';
    }
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="font-sans min-h-screen p-8 pb-20 sm:p-20 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-2xl font-bold mb-8 text-center">Contribution Calendar</h1>

        <div className="flex">
          {/* Weekday labels */}
          <div className="flex flex-col justify-between mr-2 text-xs text-gray-500">
            {weekdays.map((day, index) => (
              <div key={day} className="h-3 flex items-center">
                {index % 2 === 0 && day}
              </div>
            ))}
          </div>

          {/* Contribution grid */}
          <div className="flex-1">
            {/* Month labels */}
            <div className="flex mb-2 text-xs text-gray-500">
              {Array.from({ length: 12 }, (_, i) => (
                <div key={months[i]} className="flex-1 text-center">
                  {i % 2 === 0 && months[i]}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-53 gap-1">
              {contributions.map((week, weekIndex) =>
                week.map((level, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-3 h-3 rounded-sm ${getColor(level)}`}
                    title={`${level} contributions`}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center mt-4 text-sm">
          <span className="mr-2">Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm mr-1 ${getColor(level)}`}
            />
          ))}
          <span className="ml-2">More</span>
        </div>
      </div>
    </div>
  );
}
