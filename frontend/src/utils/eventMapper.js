export const DEFAULT_EVENT_IMAGE = 'https://via.placeholder.com/800x450?text=Event'

function buildApiOrigin() {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
  return base.replace(/\/api\/?$/, '')
}

function resolveEventImage(imagePath) {
  if (!imagePath) return DEFAULT_EVENT_IMAGE
  if (String(imagePath).startsWith('http')) return imagePath
  return `${buildApiOrigin()}${imagePath}`
}

export function formatEventDate(dateValue) {
  if (!dateValue) return 'Date TBD'

  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return String(dateValue)

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export function mapEventFromApi(event) {
  const price = Number(event.ticketPrice || 0)
  const dateObject = event?.date ? new Date(event.date) : null
  const dateInput = dateObject && !Number.isNaN(dateObject.getTime())
    ? dateObject.toISOString().slice(0, 10)
    : ''

  return {
    ...event,
    id: event._id,
    dateInput,
    dateLabel: formatEventDate(event.date),
    ticketPriceLabel: `PKR ${price.toLocaleString()}`,
    image: resolveEventImage(event.image),
  }
}
