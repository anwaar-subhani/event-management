import { useEffect, useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import EventCard from '../components/EventCard'
import { apiRequest } from '../utils/api'
import { mapEventFromApi } from '../utils/eventMapper'
import './EventsPage.css'

const EVENTS_PER_PAGE = 8

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedCity, setSelectedCity] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await apiRequest('/events')
        const mappedEvents = (response?.data?.events || []).map(mapEventFromApi)
        setEvents(mappedEvents)
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load events')
      } finally {
        setIsLoading(false)
      }
    }

    loadEvents()
  }, [])

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(events.map((event) => event.category)))
    return ['All', ...uniqueCategories]
  }, [events])

  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(events.map((event) => event.city)))
    return ['All', ...uniqueCities]
  }, [events])

  const filteredEvents = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()

    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(term) ||
        String(event.dateLabel || event.date).toLowerCase().includes(term)

      const matchesCategory =
        selectedCategory === 'All' || event.category === selectedCategory

      const matchesCity = selectedCity === 'All' || event.city === selectedCity

      return matchesSearch && matchesCategory && matchesCity
    })
  }, [events, searchTerm, selectedCategory, selectedCity])

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / EVENTS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * EVENTS_PER_PAGE
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE)

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return
    setCurrentPage(pageNumber)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value)
    setCurrentPage(1)
  }

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value)
    setCurrentPage(1)
  }

  return (
    <>
      <Navbar />
      <main className="page events-page">
        <div className="events-page-container">
          <div className="events-toolbar">
            <input
              className="events-search"
              type="text"
              placeholder="Search by event name or date (e.g. May 10, 2026)"
              value={searchTerm}
              onChange={handleSearchChange}
            />

            <select
              className="events-category-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              className="events-category-select"
              value={selectedCity}
              onChange={handleCityChange}
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {isLoading ? (
            <p className="events-empty-state">Loading events...</p>
          ) : errorMessage ? (
            <p className="events-empty-state">{errorMessage}</p>
          ) : paginatedEvents.length === 0 ? (
            <p className="events-empty-state">No events found for your search.</p>
          ) : (
            <div className="events-grid-page">
              {paginatedEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}

          <div className="events-pagination">
            <button type="button" onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1

              return (
                <button
                  key={pageNumber}
                  type="button"
                  className={pageNumber === safePage ? 'is-active' : ''}
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              )
            })}

            <button
              type="button"
              onClick={() => goToPage(safePage + 1)}
              disabled={safePage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
