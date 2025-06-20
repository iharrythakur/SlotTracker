import { format, parseISO } from 'date-fns'
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz'

// Get user's timezone
export const getUserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

// Format date for display in user's timezone
export const formatDateInUserTimezone = (dateString, formatString = 'PPP') => {
  const userTimezone = getUserTimezone()
  const date = parseISO(dateString)
  const zonedDate = utcToZonedTime(date, userTimezone)
  return formatInTimeZone(zonedDate, userTimezone, formatString)
}

// Format time for display in user's timezone
export const formatTimeInUserTimezone = (dateString, formatString = 'p') => {
  const userTimezone = getUserTimezone()
  const date = parseISO(dateString)
  const zonedDate = utcToZonedTime(date, userTimezone)
  return formatInTimeZone(zonedDate, userTimezone, formatString)
}

// Format date and time for display
export const formatDateTime = (dateString) => {
  return formatDateInUserTimezone(dateString, 'PPP p')
}

// Get timezone abbreviation
export const getTimezoneAbbr = () => {
  const userTimezone = getUserTimezone()
  const date = new Date()
  return formatInTimeZone(date, userTimezone, 'zzz')
}

// Convert local datetime to UTC for API
export const localToUTC = (localDateTime) => {
  const userTimezone = getUserTimezone()
  const date = new Date(localDateTime)
  return formatInTimeZone(date, userTimezone, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")
} 