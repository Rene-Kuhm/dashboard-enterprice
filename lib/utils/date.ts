import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  isToday,
  isYesterday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns"

export interface DateRange {
  from: Date
  to: Date
}

/**
 * Get predefined date ranges
 */
export const getDateRanges = () => {
  const now = new Date()

  return {
    today: {
      from: startOfDay(now),
      to: endOfDay(now),
    },
    yesterday: {
      from: startOfDay(subDays(now, 1)),
      to: endOfDay(subDays(now, 1)),
    },
    thisWeek: {
      from: startOfWeek(now, { weekStartsOn: 1 }),
      to: endOfWeek(now, { weekStartsOn: 1 }),
    },
    lastWeek: {
      from: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
      to: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
    },
    thisMonth: {
      from: startOfMonth(now),
      to: endOfMonth(now),
    },
    lastMonth: {
      from: startOfMonth(subMonths(now, 1)),
      to: endOfMonth(subMonths(now, 1)),
    },
    thisYear: {
      from: startOfYear(now),
      to: endOfYear(now),
    },
    lastYear: {
      from: startOfYear(subYears(now, 1)),
      to: endOfYear(subYears(now, 1)),
    },
    last7Days: {
      from: startOfDay(subDays(now, 7)),
      to: endOfDay(now),
    },
    last30Days: {
      from: startOfDay(subDays(now, 30)),
      to: endOfDay(now),
    },
    last90Days: {
      from: startOfDay(subDays(now, 90)),
      to: endOfDay(now),
    },
  }
}

/**
 * Check if date is within range
 */
export function isDateInRange(date: Date, range: DateRange): boolean {
  return date >= range.from && date <= range.to
}

/**
 * Get time ago label
 */
export function getTimeAgo(date: Date | string | number): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  const now = new Date()

  const minutes = differenceInMinutes(now, dateObj)
  const hours = differenceInHours(now, dateObj)
  const days = differenceInDays(now, dateObj)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

/**
 * Get friendly date label
 */
export function getFriendlyDate(date: Date | string | number): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date

  if (isToday(dateObj)) return "Today"
  if (isYesterday(dateObj)) return "Yesterday"
  if (isThisWeek(dateObj)) return "This week"
  if (isThisMonth(dateObj)) return "This month"
  if (isThisYear(dateObj)) return "This year"

  return dateObj.toLocaleDateString()
}

/**
 * Generate date array for chart
 */
export function generateDateArray(
  startDate: Date,
  endDate: Date,
  format: "day" | "week" | "month" = "day"
): Date[] {
  const dates: Date[] = []
  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))

    if (format === "day") {
      currentDate.setDate(currentDate.getDate() + 1)
    } else if (format === "week") {
      currentDate.setDate(currentDate.getDate() + 7)
    } else if (format === "month") {
      currentDate.setMonth(currentDate.getMonth() + 1)
    }
  }

  return dates
}

/**
 * Get business days between dates
 */
export function getBusinessDays(startDate: Date, endDate: Date): number {
  let count = 0
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++
    }
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return count
}

/**
 * Check if date is business day
 */
export function isBusinessDay(date: Date): boolean {
  const dayOfWeek = date.getDay()
  return dayOfWeek !== 0 && dayOfWeek !== 6
}

/**
 * Format date in human-readable format
 */
export function formatDate(date: Date | string | number): string {
  const dateObj = typeof date === "string" || typeof date === "number" ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/**
 * Format date as relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string | number): string {
  return getTimeAgo(date)
}

// Export isToday and isThisWeek from date-fns for testing
export { isToday, isThisWeek }
