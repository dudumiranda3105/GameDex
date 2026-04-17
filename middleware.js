const TIME_ZONE = 'America/Sao_Paulo'
const MAINTENANCE_PATH = '/maintenance.html'

function getSaoPauloHour(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    hour12: false,
  })
  return Number(formatter.format(date))
}

function parseHour(value, fallback) {
  const parsed = Number(value)
  if (Number.isNaN(parsed)) return fallback
  return Math.min(23, Math.max(0, Math.floor(parsed)))
}

function isInWindow(hour, startHour, endHour) {
  if (startHour === endHour) return false
  if (startHour < endHour) return hour >= startHour && hour < endHour
  return hour >= startHour || hour < endHour
}

export default function middleware(request) {
  const { pathname } = request.nextUrl

  if (
    pathname === MAINTENANCE_PATH ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/docs/') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return fetch(request)
  }

  const forceMaintenance = process.env.MAINTENANCE_FORCE === 'true'
  const disableMaintenance = process.env.MAINTENANCE_DISABLE === 'true'

  const hour = getSaoPauloHour()
  const startHour = parseHour(process.env.MAINTENANCE_START_HOUR, 0)
  const endHour = parseHour(process.env.MAINTENANCE_END_HOUR, 8)
  const inWindow = isInWindow(hour, startHour, endHour)

  if (!disableMaintenance && (forceMaintenance || inWindow)) {
    const url = new URL(MAINTENANCE_PATH, request.url)
    return Response.redirect(url, 307)
  }

  return fetch(request)
}

export const config = {
  matcher: ['/((?!_next/).*)'],
}