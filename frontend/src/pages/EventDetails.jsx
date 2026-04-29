import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { apiRequest } from '../utils/api'
import { DEFAULT_EVENT_IMAGE, mapEventFromApi } from '../utils/eventMapper'
import './EventDetails.css'

export default function EventDetails() {
  const { eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false)
  const [purchaseMessage, setPurchaseMessage] = useState('')
  const [isPurchaseLoading, setIsPurchaseLoading] = useState(false)
  const [purchaseForm, setPurchaseForm] = useState({
    ticketCount: 1,
    name: '',
    cnic: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    const loadEventDetails = async () => {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await apiRequest(`/events/${eventId}`)
        const mappedEvent = mapEventFromApi(response?.data?.event)
        setEvent(mappedEvent)
      } catch (error) {
        setErrorMessage(error.message || 'Failed to load event details')
      } finally {
        setIsLoading(false)
      }
    }

    if (eventId) {
      loadEventDetails()
    }
  }, [eventId])

  const openPurchaseModal = () => {
    setPurchaseMessage('')
    setIsPurchaseModalOpen(true)
  }

  const closePurchaseModal = () => {
    setIsPurchaseModalOpen(false)
    setPurchaseMessage('')
  }

  const handlePurchaseInputChange = (event) => {
    const { name, value } = event.target

    setPurchaseForm((previous) => ({
      ...previous,
      [name]: name === 'ticketCount' ? Number(value) : value,
    }))
  }

  const handlePurchaseSubmit = async (event) => {
    event.preventDefault()

    if (purchaseForm.ticketCount < 1 || purchaseForm.ticketCount > 5) {
      setPurchaseMessage('You can purchase between 1 and 5 tickets per CNIC.')
      return
    }

    setIsPurchaseLoading(true)

    try {
      const response = await apiRequest('/tickets/purchase', {
        method: 'POST',
        body: {
          eventId,
          purchaserName: purchaseForm.name,
          purchaserCnic: purchaseForm.cnic,
          purchaserEmail: purchaseForm.email,
          purchaserPhone: purchaseForm.phone,
          quantity: purchaseForm.ticketCount,
        },
      })

      const remainingTickets = response?.data?.remainingTickets
      setPurchaseMessage(
        `Purchase successful! Remaining tickets: ${
          remainingTickets === undefined ? 'updated' : remainingTickets
        }`
      )

      const refreshedEventResponse = await apiRequest(`/events/${eventId}`)
      setEvent(mapEventFromApi(refreshedEventResponse?.data?.event))
    } catch (error) {
      setPurchaseMessage(error.message || 'Ticket purchase failed')
    } finally {
      setIsPurchaseLoading(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="page event-details-page">
          <div className="event-details-container">
            <h2>Loading event...</h2>
          </div>
        </main>
      </>
    )
  }

  if (!event || errorMessage) {
    return (
      <>
        <Navbar />
        <main className="page event-details-page">
          <div className="event-details-container">
            <h2>Event not found</h2>
            <p>{errorMessage || 'Sorry, we could not find details for this event.'}</p>
            <Link className="details-back-link" to="/events">
              Back to Events
            </Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="page event-details-page">
        <section className="event-details-container">
          <div className="event-details-left">
            <h2>{event.title}</h2>
            <p className="details-meta">
              {event.category} • {event.dateLabel} • {event.location}
            </p>

            <h4>About</h4>
            <p>{event.about}</p>

            <h4>Details</h4>
            <p>{event.details}</p>

            <h4>Ticket Price</h4>
            <p className="ticket-price">{event.ticketPriceLabel}</p>

            <div className="details-actions">
              <button className="details-purchase-link" type="button" onClick={openPurchaseModal}>
                Purchase Tickets
              </button>

              <Link className="details-back-link" to="/events">
                Back to Events
              </Link>
            </div>
          </div>

          <div className="event-details-right">
            <img
              src={event.image || DEFAULT_EVENT_IMAGE}
              alt={event.title}
              className="event-details-image"
            />
          </div>
        </section>

        {isPurchaseModalOpen ? (
          <div className="purchase-modal-overlay" role="presentation" onClick={closePurchaseModal}>
            <section
              className="purchase-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="purchase-modal-title"
              onClick={(event) => event.stopPropagation()}
            >
              <button className="purchase-modal-close" type="button" onClick={closePurchaseModal}>
                ×
              </button>

              <h3 id="purchase-modal-title">Purchase Tickets</h3>
              <p className="purchase-modal-subtitle">Maximum 5 tickets per CNIC</p>

              <form className="purchase-form" onSubmit={handlePurchaseSubmit}>
                <label htmlFor="ticketCount">Number of Tickets</label>
                <input
                  id="ticketCount"
                  type="number"
                  name="ticketCount"
                  min="1"
                  max="5"
                  value={purchaseForm.ticketCount}
                  onChange={handlePurchaseInputChange}
                  required
                />

                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={purchaseForm.name}
                  onChange={handlePurchaseInputChange}
                  required
                />

                <label htmlFor="cnic">CNIC</label>
                <input
                  id="cnic"
                  type="text"
                  name="cnic"
                  value={purchaseForm.cnic}
                  onChange={handlePurchaseInputChange}
                  placeholder="XXXXX-XXXXXXX-X"
                  required
                />

                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={purchaseForm.email}
                  onChange={handlePurchaseInputChange}
                  required
                />

                <label htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={purchaseForm.phone}
                  onChange={handlePurchaseInputChange}
                  required
                />

                {purchaseMessage ? <p className="purchase-form-message">{purchaseMessage}</p> : null}

                <button className="purchase-submit-button" type="submit">
                  {isPurchaseLoading ? 'Processing...' : 'Purchase'}
                </button>
              </form>
            </section>
          </div>
        ) : null}
      </main>
    </>
  )
}
