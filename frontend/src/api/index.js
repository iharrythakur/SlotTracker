import axios from 'axios'

// Use environment variable for API URL, fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Event API calls
export const eventAPI = {
  // Get all events
  getEvents: async () => {
    const response = await api.get('/events')
    return response.data
  },

  // Get single event with details
  getEvent: async (eventId) => {
    const response = await api.get(`/events/${eventId}`)
    return response.data
  },

  // Create new event
  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData)
    return response.data
  },
}

// Booking API calls
export const bookingAPI = {
  // Create booking
  createBooking: async (eventId, slotId, bookingData) => {
    const response = await api.post(`/events/${eventId}/bookings?slot_id=${slotId}`, bookingData)
    return response.data
  },

  // Get user bookings
  getUserBookings: async (email) => {
    const response = await api.get(`/users/${email}/bookings`)
    return response.data
  },
}

export default api 