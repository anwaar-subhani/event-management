import { useState, useEffect, useRef } from 'react'
import './LocationPicker.css'

export default function LocationPicker({ value, onChange, city }) {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)
  const [isResolvingAddress, setIsResolvingAddress] = useState(false)
  const [resolveError, setResolveError] = useState('')
  const mapContainer = useRef(null)
  const map = useRef(null)
  const marker = useRef(null)

  // Initialize Google Map
  useEffect(() => {
    const initializeMap = () => {
      if (!mapContainer.current) return

      // Create a simple map using HTML5 Geolocation as fallback
      if (window.google && window.google.maps) {
        // Allow overriding the default location via environment variables
        const envLat = parseFloat(import.meta.env.VITE_DEFAULT_LAT)
        const envLng = parseFloat(import.meta.env.VITE_DEFAULT_LNG)
        const envAddress = import.meta.env.VITE_DEFAULT_ADDRESS || ''

        const defaultLocation = (!Number.isNaN(envLat) && !Number.isNaN(envLng))
          ? { lat: envLat, lng: envLng }
          : { lat: 31.5204, lng: 74.3587 } // Lahore, Pakistan

        map.current = new window.google.maps.Map(mapContainer.current, {
          zoom: 13,
          center: defaultLocation,
          mapTypeControl: true,
          fullscreenControl: true,
        })

        marker.current = new window.google.maps.Marker({
          position: defaultLocation,
          map: map.current,
          draggable: true,
        })

        // If there is a manual/default location provided via env, apply it
        if (envAddress || (!Number.isNaN(envLat) && !Number.isNaN(envLng))) {
          // If we already have an address configured in env, use it; otherwise resolve it
          if (envAddress) {
            applySelectedAddress(envAddress, defaultLocation.lat, defaultLocation.lng)
          } else {
            // resolve address from coordinates and apply
            resolveAddressFromCoordinates(defaultLocation.lat, defaultLocation.lng)
              .then((addr) => {
                if (addr) applySelectedAddress(addr, defaultLocation.lat, defaultLocation.lng)
              })
              .catch(() => {})
          }
        }

        // Handle map clicks
        map.current.addListener('click', (event) => {
          updateLocationFromCoords(event.latLng)
        })

        // Handle marker drag
        marker.current.addListener('dragend', () => {
          updateLocationFromCoords(marker.current.getPosition())
        })
      } else {
        // Fallback message if Google Maps API not loaded
        console.warn('Google Maps API not loaded. Please ensure API key is set.')
      }
    }

    // Load Google Maps script if not already loaded
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script')
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      if (!apiKey || apiKey.includes('Demo') || apiKey.includes('demo')) {
        console.warn('VITE_GOOGLE_MAPS_API_KEY not set or invalid. Map features disabled.')
        setApiKeyMissing(true)
        return
      }
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.onload = initializeMap
      script.onerror = () => {
        console.error('Failed to load Google Maps API')
        setApiKeyMissing(true)
      }
      document.head.appendChild(script)
    } else {
      initializeMap()
    }
  }, [])

  const applySelectedAddress = (address, lat, lng) => {
    setSelectedLocation({
      address,
      lat,
      lng,
      city: city || '',
    })

    if (onChange) {
      onChange(address)
    }
  }

  const resolveAddressFromCoordinates = async (lat, lng) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}&zoom=18&addressdetails=1`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data?.display_name || data?.name || null
  }

  const updateLocationFromCoords = async (latLng) => {
    try {
      const lat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat
      const lng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng

      if (marker.current) {
        marker.current.setPosition({ lat, lng })
      }
      if (map.current) {
        map.current.setCenter({ lat, lng })
      }

      setIsResolvingAddress(true)
      setResolveError('')

      const address = await resolveAddressFromCoordinates(lat, lng)
      setIsResolvingAddress(false)

      if (address) {
        applySelectedAddress(address, lat, lng)
        return
      }

      setResolveError('Could not fetch address for this point. Please click a nearby road or building.')
    } catch (error) {
      console.error('Geocoding error:', error)
      setIsResolvingAddress(false)
      setResolveError('Could not fetch address. Please try again.')
    }
  }

  return (
    <div className="location-picker">
      {apiKeyMissing && (
        <div className="location-api-warning">
          <p>
            <strong>Google Maps API Not Configured</strong><br />
            To enable the interactive map, please:
          </p>
          <ol>
            <li>Get a Google Maps API key from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
            <li>Enable "Maps JavaScript API"</li>
            <li>Create a <code>.env</code> file in the frontend folder with:<br />
              <code>VITE_GOOGLE_MAPS_API_KEY=your_api_key_here</code></li>
            <li>Restart the development server</li>
          </ol>
          <p><strong>Location must be selected from map only.</strong></p>
        </div>
      )}

      {!apiKeyMissing && (
        <div className="location-map-container">
          <div ref={mapContainer} className="location-map" />
          {isResolvingAddress && <p className="location-map-status">Fetching selected address...</p>}
          {resolveError && <p className="location-map-error">{resolveError}</p>}
        </div>
      )}

      <div className="location-input-wrapper">
        <input
          type="text"
          placeholder="Select a point on map to fill this address"
          value={value}
          readOnly
          className="location-display-input"
        />
      </div>
    </div>
  )
}
