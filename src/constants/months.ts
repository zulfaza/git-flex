export const MONTHS_FULL_STRING = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MONTHS_SHORT_STRING = [
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

export function getMonthLabelsFromData(gridData: Array<Array<{ date: string } | null>>): Array<{ label: string; colspan: number }> {
  const monthLabels: Array<{ label: string; colspan: number }> = [];
  
  if (!gridData || gridData.length === 0) {
    return [];
  }

  let currentMonth = '';
  let currentColspan = 0;
  
  // For horizontal layout, iterate through weeks (columns)
  const maxWeeks = Math.max(...gridData.map(row => row.length));
  
  for (let weekIndex = 0; weekIndex < maxWeeks; weekIndex++) {
    // Get the first valid date from this week
    let weekDate = null;
    for (let dayIndex = 0; dayIndex < gridData.length; dayIndex++) {
      const cell = gridData[dayIndex]?.[weekIndex];
      if (cell?.date) {
        weekDate = new Date(cell.date);
        break;
      }
    }
    
    if (weekDate) {
      const monthName = MONTHS_SHORT_STRING[weekDate.getMonth()];
      
      if (currentMonth === monthName) {
        currentColspan++;
      } else {
        if (currentMonth) {
          monthLabels.push({ label: currentMonth, colspan: currentColspan });
        }
        currentMonth = monthName;
        currentColspan = 1;
      }
    }
  }
  
  // Add the last month
  if (currentMonth && currentColspan > 0) {
    monthLabels.push({ label: currentMonth, colspan: currentColspan });
  }
  
  return monthLabels;
}

export function getDateRangeFromToday(daysBack: number = 365): { from: string; to: string } {
  const today = new Date();
  const fromDate = new Date(today);
  fromDate.setDate(today.getDate() - daysBack);
  
  return {
    from: fromDate.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0]
  };
}
